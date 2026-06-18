export function ok<T>(data: T, message = 'success'): { code: 0; message: string; data: T } {
    return {
        code: 0,
        message,
        data,
    };
}
  
export function fail(code: number, message: string, data: unknown = null) {
    return {
        code,
        message,
        data,
    };
}