import {getCookie} from "../../utils/cookies";

export async function addExerciseToTest (testId, exerciseId) {
    try {
        const response = await fetch(`http://localhost:5000/tests/${testId}/add-exercise/${exerciseId}`, {
            method: 'POST',
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