import {getCookie} from "../../utils/cookies";

export async function missLesson (lessonId) {
    try {
        const response = await fetch(`http://localhost:5000/lessons/missed/${lessonId}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'X-CSRF-TOKEN': getCookie('csrf_access_token'),
            }
        });

        return await response;

    } catch (error) {
        console.log(error);
    }
}