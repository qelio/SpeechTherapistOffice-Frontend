export async function getTeacherDisciplines () {
    try {
        const response = await fetch(`http://localhost:5000/disciplines/teacher`, {
            method: 'GET',
            credentials: 'include'
        });

        return await response;

    } catch (error) {
        console.log(error);
    }
}