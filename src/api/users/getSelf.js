export async function getSelf() {
    try {
        const response = await fetch('http://80.249.151.3/api/users/get_self', {
            method: 'GET',
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            return null;
        }
    } catch (error) {
        console.log('Request failed:', error);
        return null;
    }
}
