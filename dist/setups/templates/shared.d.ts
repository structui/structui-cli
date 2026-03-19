import type { SetupOptions, SetupFile } from "../types";
export declare function rootLayout(options: SetupOptions): SetupFile;
export declare function globalsCss(): SetupFile;
export declare function authLayout(options: SetupOptions): SetupFile;
export declare function signInPage(options: SetupOptions): SetupFile;
export declare function signUpPage(options: SetupOptions): SetupFile;
export interface NavItem {
    name: string;
    href: string;
    icon: string;
}
export declare function sidebar(options: SetupOptions, navItems: NavItem[]): SetupFile;
export declare function header(options: SetupOptions, pageTitle: string): SetupFile;
export declare function footer(options: SetupOptions): SetupFile;
export declare function profilePage(options: SetupOptions, layoutPrefix: string): SetupFile;
export declare function sharedFiles(options: SetupOptions): SetupFile[];
