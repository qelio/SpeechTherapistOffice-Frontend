export async function checkAuth() {
    try {
        const response = await fetch('http://localhost:5000/auth/check_auth', {
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
