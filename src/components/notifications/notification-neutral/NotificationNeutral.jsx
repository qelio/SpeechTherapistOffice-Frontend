import React, { useEffect } from 'react';
import styles from './NotificationNeutral.module.css';

const NotificationNeutral = ({ message, onClose, duration = 3000, type = 'success' }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    let styleBackground = {};
    if (type === 'success') {
        styleBackground = { backgroundColor: '#4CAF50' };
    } else if (type === 'error') {
        styleBackground = { backgroundColor: '#f44336' };
    } else if (type === 'warning') {
        styleBackground = { backgroundColor: '#ff9800' };
    } else {
        styleBackground = { backgroundColor: '#2196F3' };
    }

    return (
        <div className={styles.notification} style={styleBackground}>
            <div className={styles.content}>
                <span>{message}</span>
                <button className={styles.closeButton} onClick={onClose}>
                    &times;
                </button>
            </div>
        </div>
    );
};

export default NotificationNeutral;