
export async function getStudentsForTeacher (data) {
    try {
        const response = await fetch('http://80.249.151.3/api/associations/students_for_current_teacher', {
            method: 'GET',
            credentials: 'include',
            body: JSON.stringify(data)
        });

        return await response;

    } catch (error) {
        console.log(error);
    }
}