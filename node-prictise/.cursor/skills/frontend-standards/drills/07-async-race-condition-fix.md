# Drill 07 - Async Race Condition Fix

## Prompt

这个页面有异步请求竞态问题，按前端规范给我一个稳妥的修复方案。

## Checkpoints

- 是否识别请求竞态与过期响应覆盖问题
- 是否给出取消请求或请求标识方案
- 是否补充 loading/error/empty 的状态分支

## Frontend Standards Review

### Scope
- Focus: 异步请求竞态与过期响应覆盖
- Goal: 给出稳妥、可落地、可验证的修复方案
- Files: 当前页面请求逻辑与状态渲染分支（假设）

### Findings
- 🔴 请求竞态风险：用户快速切换筛选条件或路由时，先发出的慢请求后返回，覆盖最新请求结果。
- 🔴 状态更新未校验请求身份：`setState` 未确认“是否仍为当前请求”，导致 UI 出现回退数据。
- 🟡 取消机制缺失：组件卸载或参数变更时未中止 in-flight 请求，产生无效开销和潜在 warning。
- 🟡 状态分支不完整：`loading`/`error`/`empty`/`success` 分支边界不清，异常时体验不稳定。
- 🟢 错误处理可统一：错误对象未标准化，提示策略分散，排查成本高。

### Suggested Fixes
1. 引入请求取消：在 `useEffect` 中使用 `AbortController`，参数变化或卸载时 `abort()`。
2. 增加请求身份校验：使用递增 `requestId`（或时间戳 token），仅允许最新请求回写状态。
3. 原子化状态切换：发起请求前切到 `loading`，返回后进入 `success`/`empty`/`error`。
4. 防止卸载后更新：cleanup 后阻断后续状态更新，避免无效 `setState`。
5. 统一错误模型：将网络错误和业务错误映射为统一结构，保证 UI 文案与日志一致。

### Validation
- Runtime: 快速切换筛选 10 次以上，不出现旧数据覆盖新数据
- Network: 参数变化时旧请求被取消（可在 DevTools 观察 aborted）
- UI State: 覆盖 `loading`/`error`/`empty`/`success` 四态展示
- Test: 增加“慢请求后返回”模拟用例，断言仅最新请求生效

### 参考实现（简化版）

```ts
const requestIdRef = useRef(0);

useEffect(() => {
  const controller = new AbortController();
  const currentId = ++requestIdRef.current;

  setViewState({ status: "loading", data: null, error: null });

  fetchData(params, { signal: controller.signal })
    .then((data) => {
      if (currentId !== requestIdRef.current) return;
      if (!data || data.length === 0) {
        setViewState({ status: "empty", data: [], error: null });
        return;
      }
      setViewState({ status: "success", data, error: null });
    })
    .catch((err) => {
      if (controller.signal.aborted) return;
      if (currentId !== requestIdRef.current) return;
      setViewState({ status: "error", data: null, error: normalizeError(err) });
    });

  return () => controller.abort();
}, [params]);
```
