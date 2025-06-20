export async function getExercisesByDisciplineId(disciplineId) {
    try {
        const response = await fetch(`http://80.249.151.3/api/education_exercises/discipline/${disciplineId}`, {
            method: 'GET',
            credentials: 'include'
        });

        return await response;

    } catch (error) {
        console.log(error);
    }
}