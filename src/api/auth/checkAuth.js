export async function checkAuth() {
    try {
        const response = await fetch('http://80.249.151.3/api/auth/check_auth', {
            method: 'GET',
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            return data.user_id;
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
}
