export async function getUserByUniqueCode(uniqueCode) {
    try {
        const response = await fetch(`http://80.249.151.3/api/users/get_by_unique_code/${uniqueCode}`, {
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
