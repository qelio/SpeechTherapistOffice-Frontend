import {getCookie} from "../../utils/cookies";

export async function deleteSaveLesson (lessonId) {
    try {
        const response = await fetch(`http://80.249.151.3/api/lessons/save_delete/${lessonId}`, {
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