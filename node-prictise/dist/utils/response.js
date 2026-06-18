export function ok(data, message = 'success') {
    return {
        code: 0,
        message,
        data,
    };
}
export function fail(code, message, data = null) {
    return {
        code,
        message,
        data,
    };
}
//# sourceMappingURL=response.js.map