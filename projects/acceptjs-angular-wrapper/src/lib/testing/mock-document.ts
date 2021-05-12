export class MockDocument {
    public createElement(tag: string): HTMLElement | HTMLScriptElement | HTMLStyleElement {
        return document.createElement(tag);
    }

    public getElementsByTagName(tag: string): HTMLElement[] | HTMLScriptElement[] | HTMLStyleElement[] {
        return null;
    }
}
