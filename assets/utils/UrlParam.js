export const setUrlParam = (key, value) => {
    const url = new URL(window.location.href);
    url.searchParams.set(key, value);
    history.replaceState(null, null, url.href);
}

export const getUrlParam = (key) => {
    const url = new URL(window.location.href);
    return url.searchParams.get(key);
}