

export function isProduction() {
    return process.env.NODE_ENV === 'production';
}

export enum Languages {
    da, en, fo
}