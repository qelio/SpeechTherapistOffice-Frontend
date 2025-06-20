export async function getExercisesByTest(testId) {
    try {
        const response = await fetch(`http://80.249.151.3/api/tests/${testId}/exercises`, {
            method: 'GET',
            credentials: 'include'
        });

        return await response;

    } catch (error) {
        console.log(error);
    }
}