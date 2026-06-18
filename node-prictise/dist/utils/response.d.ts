export declare function ok<T>(data: T, message?: string): {
    code: 0;
    message: string;
    data: T;
};
export declare function fail(code: number, message: string, data?: unknown): {
    code: number;
    message: string;
    data: unknown;
};
//# sourceMappingURL=response.d.ts.map