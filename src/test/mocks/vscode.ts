export const Uri = {
    file: (path: string) => ({
        fsPath: path,
        toString: () => path
    })
};

export const DiagnosticSeverity = {
    Error: 0,
    Warning: 1,
    Information: 2,
    Hint: 3
};

export const languages = {
    getDiagnostics: () => []
};
