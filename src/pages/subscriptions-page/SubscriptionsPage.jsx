import styles from './SubscriptionsPage.module.css';
import useNotification from "../../hooks/useNotificationNeutral";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {authFlow} from "../../api/auth/authFlow";
import NotificationNeutral from "../../components/notifications/notification-neutral/NotificationNeutral";
import SubscriptionCard from "../../components/cards/subscription-card/SubscriptionCard";
import {getCurrentStudentSubscriptions} from "../../api/schedule/getCurrentStudentSubscriptions";

function SubscriptionsPage() {

    const { notification, showNotification, closeNotification } = useNotification();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    // Состояние для всех полученных абонементов
    const[subscriptions, setSubscriptions] = useState([]);

    function getSubscriptions() {
        getCurrentStudentSubscriptions().then(async (response) => {
            const data = await response.json();
            if (response.ok) {
                console.log(data);
                setSubscriptions(data);
            } else {
                showNotification(`Ошибка при получении списка абонементов: ${data.message}`, 3000, 'error');
            }
        });
    }

    useEffect(() => {
        const verifyAuth = async () => {
            const userId = await authFlow();
            if (!userId) {
                navigate('/sign-in');
            } else {
                setIsLoading(false);
                getSubscriptions();
            }
        };
        verifyAuth().then();
    }, [navigate]);

    return (
        <div className={styles.mainContainer}>
            {notification && (
                <NotificationNeutral
                    message={notification.message}
                    onClose={closeNotification}
                    duration={notification.duration}
                    type={notification.type}
                />
            )}

            <h1>Мои абонементы</h1>
            <p className="mb-4">В данном разделе вы можете просматривать созданные абонементы и редактировать их.</p>
            {subscriptions.map(subscription => (
                subscription.in_archive === false && (
                    <SubscriptionCard
                        subscription={subscription}
                        updateSubscriptions={getSubscriptions}
                        showNotification={showNotification}
                        isStudent={true}
                    />
                )
            ))}
            {subscriptions.map(subscription => (
                subscription.in_archive === true && (
                    <SubscriptionCard
                        subscription={subscription}
                        updateSubscriptions={getSubscriptions}
                        showNotification={showNotification}
                        isStudent={true}
                    />
                )
            ))}
        </div>
    );
}

export default SubscriptionsPage;