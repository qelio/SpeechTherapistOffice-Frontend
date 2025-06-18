export async function getExercisesByDisciplineId(disciplineId) {
    try {
        const response = await fetch(`http://localhost:5000/education_exercises/discipline/${disciplineId}`, {
            method: 'GET',
            credentials: 'include'
        });

        return await response;

    } catch (error) {
        console.log(error);
    }
}