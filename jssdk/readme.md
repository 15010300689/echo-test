Frontend Runtime Self-Heal SDK Prototype
This workspace contains a runnable prototype that matches the patent draft in
frontend_patent_draft.md.

Files
sdk/self-heal-sdk.js: browser SDK prototype.
demo/index.html: static demo page with intentional UI failures.
frontend_patent_draft.md: patent disclosure draft.
Module Mapping
EventProbe: click, pointer, focus and viewport event collection.
RenderProbe: DOM geometry, computed style, viewport and layout shift snapshots.
EvidenceBuilder: interaction failure evidence-chain construction.
PatchPlanner: candidate micro-patch generation.
ReplaySandbox: low-risk replay-style verification and patch scoring.
PatchRuntime: patch injection, session persistence and rollback.
Run
Open demo/index.html in a browser, or serve this directory with any static
server and visit /demo/index.html.

The first click on the covered submit button should generate a
click-occlusion evidence chain. After verification, the SDK injects a
session-level micro-patch so the following click reaches the button handler.