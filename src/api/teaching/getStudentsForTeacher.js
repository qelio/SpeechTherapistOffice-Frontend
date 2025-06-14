
export async function getStudentsForTeacher (data) {
    try {
        const response = await fetch('http://localhost:5000/associations/students_for_current_teacher', {
            method: 'GET',
            credentials: 'include',
            body: JSON.stringify(data)
        });

        return await response;

    } catch (error) {
        console.log(error);
    }
}