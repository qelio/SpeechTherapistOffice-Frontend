import { useState } from 'react';

const useNotification = () => {
    const [notification, setNotification] = useState(null);

    const showNotification = (message, duration = 3000, type = 'success') => {
        setNotification({ message, duration, type });
    };

    const closeNotification = () => {
        setNotification(null);
    };

    return { notification, showNotification, closeNotification };
};

export default useNotification;