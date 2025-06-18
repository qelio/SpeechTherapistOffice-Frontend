import {getCookie} from "../../utils/cookies";

export async function deleteSaveLesson (lessonId) {
    try {
        const response = await fetch(`http://localhost:5000/lessons/save_delete/${lessonId}`, {
            method: 'DELETE',
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