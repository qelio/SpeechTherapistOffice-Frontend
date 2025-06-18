export async function getStudentSubscriptions (studentId) {
    try {
        const response = await fetch(`http://localhost:5000/subscriptions/student/${studentId}`, {
            method: 'GET',
            credentials: 'include'
        });

        return await response;

    } catch (error) {
        console.log(error);
    }
}