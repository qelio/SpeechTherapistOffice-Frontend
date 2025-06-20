export async function getCurrentStudentSubscriptions () {
    try {
        const response = await fetch(`http://80.249.151.3/api/subscriptions/student`, {
            method: 'GET',
            credentials: 'include'
        });

        return await response;

    } catch (error) {
        console.log(error);
    }
}