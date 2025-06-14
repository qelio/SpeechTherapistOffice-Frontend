import {getCookie} from "../../utils/cookies";

export async function updatePassword (data) {
    try {
        const response = await fetch('http://localhost:5000/users/update_password', {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'X-CSRF-TOKEN': getCookie('csrf_access_token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        return await response;

    } catch (error) {
        console.log(error);
    }
}