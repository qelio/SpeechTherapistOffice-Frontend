import {getCookie} from "../../utils/cookies";

export async function createTest (data) {
    try {
        const response = await fetch('http://80.249.151.3/api/tests/create', {
            method: 'POST',
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