(function attachSelfHeal(global) {
    "use strict";

    const DEFAULTS = {
        debug: false,
        sessionStorageKey: "__frontend_self_heal_patches__",
        replayTimeoutMs: 120,
        maxLayoutShift: 0.02,
        minTargetArea: 44 * 44,
        patchScope: "session",
    };

    const now = () => Math.round(performance.now());

    function rectToJSON(rect) {
        if (!rect) return null;
        return {
            x: Math.round(rect.x),
            y: Math.round(rect.y),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
            top: Math.round(rect.top),
            right: Math.round(rect.right),
            bottom: Math.round(rect.bottom),
            left: Math.round(rect.left),
        };
    }

    function makeSelector(el) {
        if (!el || el.nodeType !== Node.ELEMENT_NODE) return "";
        if (el.id) return `#${CSS.escape(el.id)}`;
        const testId = el.getAttribute("data-testid");
        if (testId) return `[data-testid="${CSS.escape(testId)}"]`;
        const parts = [];
        let node = el;
        while (node && node.nodeType === Node.ELEMENT_NODE && parts.length < 4) {
            let part = node.localName;
            if (node.classList.length) {
                part += `.${Array.from(node.classList).slice(0, 2).map(CSS.escape).join(".")}`;
            }
            const parent = node.parentElement;
            if (parent) {
                const index = Array.from(parent.children).indexOf(node) + 1;
                part += `:nth-child(${index})`;
            }
            parts.unshift(part);
            node = parent;
        }
        return parts.join(" > ");
    }

    function getElement(selector) {
        try {
            return selector ? document.querySelector(selector) : null;
        } catch (_) {
            return null;
        }
    }
    
    function getStyleSummary(el) {
        if (!el) return null;
        const style = getComputedStyle(el);
        return {
            position: style.position,
            zIndex: style.zIndex,
            pointerEvents: style.pointerEvents,
            opacity: style.opacity,
            display: style.display,
            visibility: style.visibility,
            overflow: style.overflow,
            transform: style.transform,
        };
    }


    function accessibleSummary(el) {
        if (!el) return null;
        const label =
          el.getAttribute("aria-label") ||
          el.getAttribute("title") ||
          (el.labels && el.labels[0] && el.labels[0].textContent) ||
          el.textContent ||
          "";
        return {
            role: el.getAttribute("role") || el.localName,
            label: label.trim().slice(0, 80),
            tabIndex: el.tabIndex,
            ariaHidden: el.getAttribute("aria-hidden"),
            ariaDisabled: el.getAttribute("aria-disabled"),
            disabled: Boolean(el.disabled),
        };
    }

    function isActionableElement(el) {
        if (!el || el.nodeType !== Node.ELEMENT_NODE) return false;
        const role = el.getAttribute("role");
        const tag = el.localName;
        return (
            /^(button|a|input|textarea|select|summary)$/i.test(tag) ||
            ["button", "link", "checkbox", "menuitem", "option", "radio", "switch", "tab"].includes(role) ||
            el.hasAttribute("onclick") ||
            el.tabIndex >= 0
        );
    }
    
    function isLikelyTransparentBlocker(el) {
        if (!el) return false;
        const style = getComputedStyle(el);
        const opacity = Number.parseFloat(style.opacity || "1");
        return (
            el.getAttribute("aria-hidden") === "true" ||
            opacity < 0.05 ||
            style.backgroundColor === "rgba(0, 0, 0, 0)" ||
            style.cursor === "default"
        );
    }

    function findActionableUnderPoint(x, y) {
        const stack = document.elementsFromPoint(x, y);
        const top = stack[0] || null;
        const target = stack.find((el) => el !== top && isActionableElement(el));
        return { top, target: target || null, stack };
    }
    
    function findScrollableAncestor(el) {
        let node = el && el.parentElement;
        while (node) {
            const style = getComputedStyle(node);
            const scrollable = /(auto|scroll|overlay)/.test(`${style.overflow}${style.overflowY}${style.overflowX}`);
            if (scrollable && (node.scrollHeight > node.clientHeight || node.scrollWidth > node.clientWidth)) {
                return node;
            }
            node = node.parentElement;
        }
        return document.scrollingElement || document.documentElement;
    }


    class EventProbe {
        constructor(sdk) {
            this.sdk = sdk;
            this.lastPointer = null;
            this.lastFocusPath = [];
            this.handlers = [];
        }

        start() {
            this.on(document, "pointerdown", (event) => {
                this.lastPointer = {
                    type: event.type,
                    x: event.clientX,
                    y: event.clientY,
                    time: now(),
                    intendedSelector: makeSelector(event.target),
                    propagationPath: event.composedPath().filter((n) => n.nodeType === Node.ELEMENT_NODE).map(makeSelector).slice(0, 8),
                };
            }, true);
      
            this.on(document, "click", (event) => {
                const evidence = this.sdk.evidenceBuilder.fromClick(event, this.lastPointer);
                if (evidence && evidence.failureType !== "none") {
                    this.sdk.handleEvidence(evidence);
                }
            }, true);
      
            this.on(document, "focusin", (event) => {
                this.lastFocusPath.push({
                    selector: makeSelector(event.target),
                    time: now(),
                    a11y: accessibleSummary(event.target),
                });
                this.lastFocusPath = this.lastFocusPath.slice(-20);
            }, true);
      
            if (global.visualViewport) {
                this.on(global.visualViewport, "resize", () => {
                    const active = document.activeElement;
                    const evidence = this.sdk.evidenceBuilder.fromViewportResize(active);
                    if (evidence && evidence.failureType !== "none") {
                        this.sdk.handleEvidence(evidence);
                    }
                });
            }
        }

        stop() {
            for (const [target, type, handler, options] of this.handlers) {
               target.removeEventListener(type, handler, options);
            }
            this.handlers = [];
        }
      
        on(target, type, handler, options) {
            target.addEventListener(type, handler, options);
            this.handlers.push([target, type, handler, options]);
        }
    }

    class RenderProbe {
        constructor() {
            this.layoutShift = 0;
            this.observer = null;
        }

        start() {
            if (!("PerformanceObserver" in global)) return;
            try {
                this.observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (!entry.hadRecentInput) this.layoutShift += entry.value || 0;
                    }
                });
                this.observer.observe({ type: "layout-shift", buffered: true });
            } catch (_) {
                 this.observer = null;
            }
        }

        stop() {
            if (this.observer) this.observer.disconnect();
        }

        snapshot(el) {
            const blocker = el ? document.elementFromPoint(
                el.getBoundingClientRect().left + Math.min(10, el.getBoundingClientRect().width / 2),
                el.getBoundingClientRect().top + Math.min(10, el.getBoundingClientRect().height / 2)
            ) : null;
            return {
                selector: makeSelector(el),
                rect: rectToJSON(el && el.getBoundingClientRect()),
                style: getStyleSummary(el),
                blockerSelector: blocker && blocker !== el ? makeSelector(blocker) : "",
                blockerRect: rectToJSON(blocker && blocker.getBoundingClientRect()),
                blockerStyle: getStyleSummary(blocker),
                scrollContainerSelector: makeSelector(findScrollableAncestor(el)),
                viewport: {
                    width: global.innerWidth,
                    height: global.innerHeight,
                    visualWidth: global.visualViewport ? global.visualViewport.width : global.innerWidth,
                    visualHeight: global.visualViewport ? global.visualViewport.height : global.innerHeight,
                    offsetTop: global.visualViewport ? global.visualViewport.offsetTop : 0,
                },
                layoutShift: this.layoutShift,
            };
        }
    }

    class EvidenceBuilder {
        constructor(sdk) {
            this.sdk = sdk;
        }

        fromClick(event, pointer) {
            if (!pointer) return null;
            const pointStack = findActionableUnderPoint(pointer.x, pointer.y);
            const hit = pointStack.top || document.elementFromPoint(pointer.x, pointer.y);
            const pointerTarget = getElement(pointer.intendedSelector);
            const intended = isActionableElement(pointerTarget)
              ? pointerTarget
              : pointStack.target;
            if (!intended || !hit) return null;
      
            const intendedRect = intended.getBoundingClientRect();
            const hitIsIntended = hit === intended || intended.contains(hit);
            const area = intendedRect.width * intendedRect.height;
            const isTinyTarget = area > 0 && area < this.sdk.options.minTargetArea;
            const isBlocked =
              !hitIsIntended &&
              intendedRect.width > 0 &&
              intendedRect.height > 0 &&
              (isLikelyTransparentBlocker(hit) || pointStack.stack.includes(intended));
            const failureType = isBlocked ? "click-occlusion" : isTinyTarget ? "small-hit-area" : "none";
            if (failureType === "none") return { failureType: "none" };
      
            const blocker = isBlocked ? hit : null;
            return {
                id: `ev_${Date.now()}_${Math.random().toString(16).slice(2)}`,
                createdAt: new Date().toISOString(),
                failureType,
                userIntent: {
                    action: "click",
                    x: pointer.x,
                    y: pointer.y,
                    intendedSelector: pointer.intendedSelector,
                    hitSelector: makeSelector(hit),
                },
                target: {
                    selector: makeSelector(intended),
                    rect: rectToJSON(intendedRect),
                    style: getStyleSummary(intended),
                    a11y: accessibleSummary(intended),
                },
                blocker: blocker ? {
                    selector: makeSelector(blocker),
                    rect: rectToJSON(blocker.getBoundingClientRect()),
                    style: getStyleSummary(blocker),
                    a11y: accessibleSummary(blocker),
                } : null,
                propagationPath: pointer.propagationPath,
                render: this.sdk.renderProbe.snapshot(intended),
                evidenceChain: [
                    { kind: "user-intent", value: pointer },
                    { kind: "target-element", value: makeSelector(intended) },
                    blocker ? { kind: "blocking-element", value: makeSelector(blocker) } : null,
                    { kind: "style-source", value: { target: getStyleSummary(intended), blocker: getStyleSummary(blocker) } },
                    { kind: "event-propagation", value: pointer.propagationPath },
                    { kind: "accessibility", value: accessibleSummary(intended) },
                ].filter(Boolean),
            };
        }



        fromViewportResize(activeElement) {
            if (!activeElement || !/^(input|textarea|select)$/i.test(activeElement.localName)) return null;
            const rect = activeElement.getBoundingClientRect();
            const visualHeight = global.visualViewport ? global.visualViewport.height : global.innerHeight;
            const covered = rect.bottom > visualHeight - 8;
            if (!covered) return { failureType: "none" };
            const scrollContainer = findScrollableAncestor(activeElement);
            return {
                id: `ev_${Date.now()}_${Math.random().toString(16).slice(2)}`,
                createdAt: new Date().toISOString(),
                failureType: "keyboard-occlusion",
                userIntent: {
                    action: "focus",
                    intendedSelector: makeSelector(activeElement),
                },
                target: {
                    selector: makeSelector(activeElement),
                    rect: rectToJSON(rect),
                    style: getStyleSummary(activeElement),
                    a11y: accessibleSummary(activeElement),
                },
                blocker: {
                    selector: "visualViewport",
                    rect: { top: Math.round(visualHeight), bottom: global.innerHeight },
                    style: null,
                    a11y: null,
                },
            render: this.sdk.renderProbe.snapshot(activeElement),
            scrollContainer: makeSelector(scrollContainer),
            evidenceChain: [
                { kind: "user-intent", value: "focus-input" },
                { kind: "target-element", value: makeSelector(activeElement) },
                { kind: "blocking-element", value: "visualViewport" },
                { kind: "layout-constraint", value: { visualHeight, rect: rectToJSON(rect) } },
                { kind: "accessibility", value: accessibleSummary(activeElement) },
            ],};
        }
    }


    class PatchPlanner {
        constructor(options) {
          this.options = options;
        }
        plan(evidence) {
            if (!evidence || evidence.failureType === "none") return [];
            if (evidence.failureType === "click-occlusion") return this.planClickOcclusion(evidence);
            if (evidence.failureType === "small-hit-area") return this.planSmallHitArea(evidence);
            if (evidence.failureType === "keyboard-occlusion") return this.planKeyboardOcclusion(evidence);
            return [];
        }
        planClickOcclusion(evidence) {
            const patches = [];
            if (evidence.blocker && evidence.blocker.selector) {
                patches.push({
                    id: `patch_${evidence.id}_pe_none`,
                    type: "style-rule",
                    scope: this.options.patchScope,
                    reason: "click-occlusion",
                    selector: evidence.blocker.selector,
                    cssText: "pointer-events: none !important;",
                    rollbackIndex: { selector: evidence.blocker.selector, property: "pointer-events" },
                    score: 0,
                });
            }
      
            patches.push({
                id: `patch_${evidence.id}_z_raise`,
                type: "style-rule",
                scope: this.options.patchScope,
                reason: "click-occlusion",
                selector: evidence.target.selector,
                cssText: "position: relative !important; z-index: 2147483646 !important;",
                rollbackIndex: { selector: evidence.target.selector, property: "z-index" },
                score: 0,
            });
      
            patches.push({
                id: `patch_${evidence.id}_hit_area`,
                type: "style-rule",
                scope: this.options.patchScope,
                reason: "click-occlusion",
                selector: evidence.target.selector,
                cssText: "position: relative !important; isolation: isolate !important;",
                extraCssText: `${evidence.target.selector}::after{content:"";position:absolute;inset:-8px;}`,
                rollbackIndex: { selector: evidence.target.selector, property: "pseudo-hit-area" },
                score: 0,
            });
      
            return patches;
        }

        planSmallHitArea(evidence) {
            return [{
                id: `patch_${evidence.id}_min_hit_area`,
                type: "style-rule",
                scope: this.options.patchScope,
                reason: "small-hit-area",
                selector: evidence.target.selector,
                cssText: "min-width: 44px !important; min-height: 44px !important;",
                rollbackIndex: { selector: evidence.target.selector, property: "min-hit-area" },
                score: 0,
            }];
        }

        planKeyboardOcclusion(evidence) {
            const selector = evidence.scrollContainer || evidence.render.scrollContainerSelector || "html";
            return [{
                id: `patch_${evidence.id}_keyboard_padding`,
                type: "style-rule",
                scope: this.options.patchScope,
                reason: "keyboard-occlusion",
                selector,
                cssText: "scroll-padding-bottom: max(24px, env(safe-area-inset-bottom)) !important;",
                rollbackIndex: { selector, property: "scroll-padding-bottom" },
                afterApply: () => {
                    const target = getElement(evidence.target.selector);
                    if (target) target.scrollIntoView({ block: "center", inline: "nearest", behavior: "smooth" });
                },
                score: 0,
            }];
        }
    }

    class ReplaySandbox {
        constructor(options) {
          this.options = options;
        }

        async verify(evidence, patches) {
            const results = [];
            for (const patch of patches) {
                const beforeShift = window.__frontendSelfHeal && window.__frontendSelfHeal.renderProbe.layoutShift || 0;
                const disposable = PatchRuntime.injectStyle(patch, true);
                await new Promise((resolve) => setTimeout(resolve, this.options.replayTimeoutMs));
                const result = this.scorePatch(evidence, patch, beforeShift);
                disposable();
                results.push(result);
            }
            return results.sort((a, b) => b.score - a.score);
        }

        scorePatch(evidence, patch, beforeShift) {
            const target = getElement(evidence.target.selector);
            const intendedPoint = evidence.userIntent || {};
            let hitSuccess = false;
            if (target && typeof intendedPoint.x === "number") {
                const hit = document.elementFromPoint(intendedPoint.x, intendedPoint.y);
                hitSuccess = hit === target || target.contains(hit);
            } else {
                hitSuccess = Boolean(target);
            }
      
            const afterShift = window.__frontendSelfHeal && window.__frontendSelfHeal.renderProbe.layoutShift || 0;
            const shiftDelta = Math.max(0, afterShift - beforeShift);
            const a11yOk = target ? target.getAttribute("aria-hidden") !== "true" : false;
            const perfOk = true;
            const score =
              (hitSuccess ? 60 : 0) +
              (a11yOk ? 20 : 0) +
              (shiftDelta <= this.options.maxLayoutShift ? 15 : -30) +
              (perfOk ? 5 : 0);
      
            return {
                patch,
                score,
                metrics: {
                    hitSuccess,
                    layoutShiftDelta: shiftDelta,
                    a11yOk,
                    perfOk,
                },
            };
        }
    }

    class PatchRuntime {
        constructor(options) {
          this.options = options;
          this.applied = new Map();
        }

        static cssForPatch(patch) {
            const selector = patch.selector || "html";
            return `${selector}{${patch.cssText}}\n${patch.extraCssText || ""}`;
        }
      
        static injectStyle(patch, disposableOnly) {
            const style = document.createElement("style");
            style.dataset.selfHealPatch = patch.id;
            style.textContent = PatchRuntime.cssForPatch(patch);
            document.head.appendChild(style);
            if (typeof patch.afterApply === "function" && !disposableOnly) patch.afterApply();
            return () => style.remove();
        }

        apply(patch) {
            if (this.applied.has(patch.id)) return;
            const dispose = PatchRuntime.injectStyle(patch, false);
            this.applied.set(patch.id, { patch, dispose, appliedAt: new Date().toISOString() });
            this.persist();
        }
      
        rollback(patchId) {
            const entry = this.applied.get(patchId);
            if (!entry) return;
            entry.dispose();
            this.applied.delete(patchId);
            this.persist();
        }

        rollbackAll(reason) {
            for (const patchId of Array.from(this.applied.keys())) {
                this.rollback(patchId);
            }
            if (this.options.debug) console.info("[self-heal] rollback all", reason);
        }
      
        persist() {
            if (this.options.patchScope !== "session") return;
            const data = Array.from(this.applied.values()).map(({ patch, appliedAt }) => ({ patch, appliedAt }));
            try {
                sessionStorage.setItem(this.options.sessionStorageKey, JSON.stringify(data));
            } catch (_) {
                // Storage can be disabled in private browsing.
            }
        }

        restore() {
            if (this.options.patchScope !== "session") return;
            try {
                const raw = sessionStorage.getItem(this.options.sessionStorageKey);
                const data = raw ? JSON.parse(raw) : [];
                for (const entry of data) {
                    if (entry && entry.patch && entry.patch.id) this.apply(entry.patch);
                }
            } catch (_) {
                sessionStorage.removeItem(this.options.sessionStorageKey);
            }
        }
    }

    class FrontendSelfHeal {
        constructor(options) {
          this.options = Object.assign({}, DEFAULTS, options);
          this.renderProbe = new RenderProbe();
          this.evidenceBuilder = new EvidenceBuilder(this);
          this.patchPlanner = new PatchPlanner(this.options);
          this.replaySandbox = new ReplaySandbox(this.options);
          this.patchRuntime = new PatchRuntime(this.options);
          this.eventProbe = new EventProbe(this);
          this.evidenceLog = [];
        }

        start() {
            this.renderProbe.start();
            this.patchRuntime.restore();
            this.eventProbe.start();
            global.__frontendSelfHeal = this;
            if (this.options.debug) console.info("[self-heal] started");
            return this;
        }
      
        stop() {
            this.eventProbe.stop();
            this.renderProbe.stop();
            if (global.__frontendSelfHeal === this) delete global.__frontendSelfHeal;
        }

        async handleEvidence(evidence) {
            this.evidenceLog.push(evidence);
            if (this.options.debug) console.info("[self-heal] evidence", evidence);
            const candidates = this.patchPlanner.plan(evidence);
            if (!candidates.length) return null;
      
            const results = await this.replaySandbox.verify(evidence, candidates);
            const best = results[0];
            if (!best || best.score < 70) {
                if (this.options.debug) console.warn("[self-heal] no safe patch", results);
                return null;
            }
      
            this.patchRuntime.apply(best.patch);
            if (this.options.debug) console.info("[self-heal] applied", best);
            return best;
        }
    }

    global.FrontendSelfHeal = FrontendSelfHeal;
})(window);