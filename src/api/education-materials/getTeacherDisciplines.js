export async function getTeacherDisciplines () {
    try {
        const response = await fetch(`http://80.249.151.3/api/disciplines/teacher`, {
            method: 'GET',
            credentials: 'include'
        });

        return await response;

    } catch (error) {
        console.log(error);
    }
}