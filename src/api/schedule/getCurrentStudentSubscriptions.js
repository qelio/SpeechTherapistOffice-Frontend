export async function getCurrentStudentSubscriptions () {
    try {
        const response = await fetch(`http://localhost:5000/subscriptions/student`, {
            method: 'GET',
            credentials: 'include'
        });

        return await response;

    } catch (error) {
        console.log(error);
    }
}