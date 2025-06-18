export async function getSubscriptionById (subscriptionId) {
    try {
        const response = await fetch(`http://localhost:5000/subscriptions/${subscriptionId}`, {
            method: 'GET',
            credentials: 'include'
        });

        return await response;

    } catch (error) {
        console.log(error);
    }
}