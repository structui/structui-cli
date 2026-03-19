export type Theme = {
    name: string;
    light: Record<string, string>;
    dark: Record<string, string>;
};
export declare const themes: Theme[];
export declare function generateThemeCssBlock(theme: Theme): string;
