export async function getExercisesByTest(testId) {
    try {
        const response = await fetch(`http://localhost:5000/tests/${testId}/exercises`, {
            method: 'GET',
            credentials: 'include'
        });

        return await response;

    } catch (error) {
        console.log(error);
    }
}