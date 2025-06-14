import {getCookie} from "../../utils/cookies";

export async function archiveSubscriptionFetch(subscription_id) {
    try {
        const response = await fetch(`http://localhost:5000/subscriptions/archive/${subscription_id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'X-CSRF-TOKEN': getCookie('csrf_access_token')
            }
        });

        return await response;

    } catch (error) {
        console.log(error);
    }
}