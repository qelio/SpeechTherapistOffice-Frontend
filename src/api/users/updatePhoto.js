import {getCookie} from "../../utils/cookies";

export async function updatePhoto (formData) {
    try {
        const response = await fetch('http://localhost:5000/users/upload_profile_picture', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'X-CSRF-TOKEN': getCookie('csrf_access_token')
            },
            body: formData
        });

        return await response;

    } catch (error) {
        console.log(error);
    }
}