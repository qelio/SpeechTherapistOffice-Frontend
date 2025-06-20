import {getCookie} from "../../utils/cookies";

export async function refreshToken () {
    try {
        const response = await fetch('http://80.249.151.3/api/auth/refresh', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'X-CSRF-TOKEN': getCookie('csrf_refresh_token')
            }
        });

        return response.ok;

    } catch (error) {
        return null;
    }
}
