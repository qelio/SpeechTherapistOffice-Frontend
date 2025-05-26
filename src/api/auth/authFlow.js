import {checkAuth} from "./checkAuth.js";
import {refreshToken} from "./refreshToken.js";

export async function authFlow() {
    const userId = await checkAuth();
    if (userId) {
        console.log('Токен в актуальном состоянии!');
        return userId;
    } else {
        console.log('Необходимо обновление токена!');
    }

    const isRefreshed = await refreshToken();
    if (!isRefreshed) return null;

    return await checkAuth();
}