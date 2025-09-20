export function doesPreferDarkMode() {
    if (window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
}

export function setFavicon() {
    const favicon: HTMLLinkElement | null = document.getElementById("favicon") as HTMLLinkElement;
    if (!favicon) return;

    if (doesPreferDarkMode()) {
        favicon.href = "/favicon-light.svg";
    } else {
        favicon.href = "/favicon-dark.svg";
    }
}