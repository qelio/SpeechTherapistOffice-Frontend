import {getCookie} from "../../utils/cookies";

export async function deleteExerciseFromTest (testId, exerciseId) {
    try {
        const response = await fetch(`http://localhost:5000/tests/${testId}/remove-exercise/${exerciseId}`, {
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