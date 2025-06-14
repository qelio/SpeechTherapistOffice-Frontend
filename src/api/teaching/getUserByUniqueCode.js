export async function getUserByUniqueCode(uniqueCode) {
    try {
        const response = await fetch(`http://localhost:5000/users/get_by_unique_code/${uniqueCode}`, {
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
