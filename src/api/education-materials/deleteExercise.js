import {getCookie} from "../../utils/cookies";

export async function deleteExercise (exercise_id) {
    try {
        const response = await fetch(`http://80.249.151.3/api/education_exercises/delete/${exercise_id}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'X-CSRF-TOKEN': getCookie('csrf_access_token'),
                'Content-Type': 'application/json'
            }
        });

        return await response;

    } catch (error) {
        console.log(error);
    }
}