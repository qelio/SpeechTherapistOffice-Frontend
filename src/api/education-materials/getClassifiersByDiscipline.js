export async function getClassifiersByDiscipline (discipline_id) {
    try {
        const response = await fetch(`http://localhost:5000/education_classifiers/discipline/${discipline_id}`, {
            method: 'GET',
            credentials: 'include'
        });

        return await response;

    } catch (error) {
        console.log(error);
    }
}