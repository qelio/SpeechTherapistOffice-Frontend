export async function checkEmail(data) {
    try {
        const response = await fetch('http://localhost:5000/auth/check_email', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();
        return responseData.msg;

    } catch (error) {
        console.log('Request failed:', error);
    }
}