export async function getSubscriptionsFetch () {
    try {
        const response = await fetch('http://localhost:5000/subscriptions/teacher', {
            method: 'GET',
            credentials: 'include'
        });

        return await response;

    } catch (error) {
        console.log(error);
    }
}