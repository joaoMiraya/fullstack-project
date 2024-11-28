

export const setCookie = (name: string, value: string, maxAge = 604800) => {
    document.cookie = `${name}=${encodeURIComponent(value)}; SameSite=Strict; Max-Age=${maxAge}`;
};

export const getCookie = (name: string) => {
    const cookies = document.cookie.split('; ');
    const cookie = cookies.find(c => c.startsWith(`${name}=`));
    return cookie ? decodeURIComponent(cookie.split('=')[1]) : undefined;
};

export const deleteCookie = (name: string) => {
    const path = "/";
    const domain = "";
    const secure = ""; 
    document.cookie = `${name}=; path=${path}; domain=${domain}; Max-Age=0; SameSite=Strict; ${secure}`;
};
