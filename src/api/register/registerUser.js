export async function registerUser(data) {
    try {
        const response = await fetch('http://80.249.151.3/api/auth/register', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();

        if (response.ok) {
            return responseData.msg;
        } else {
            console.log('Server error:', responseData.msg);
            return responseData.msg;
        }
    } catch (error) {
        console.log('Request failed:', error);
    }
}