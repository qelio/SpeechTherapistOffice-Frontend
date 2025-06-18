import styles from './SubscriptionCard.module.css';
import { useState, useEffect } from "react";
import {deleteSubscriptionFetch} from "../../../api/teaching/deleteSubscriptionFetch";
import {archiveSubscriptionFetch} from "../../../api/teaching/archiveSubscriptionFetch";

export default function SubscriptionCard({ subscription, updateSubscriptions, showNotification, isStudent = false }) {
    const subscriptionId = String(subscription.subscription_id).padStart(6, '0');

    // Состояния для данных абонемента
    const [formattedLessons, setFormattedLessons] = useState([]);

    function handleArchive(subscriptionId) {
        archiveSubscriptionFetch(subscriptionId).then(async (response) => {
            const data = await response.json();
            if (response.ok) {
                showNotification(`Абонемент был принудительно архивирован!`, 3000, 'warning');
                updateSubscriptions();
            } else {
                showNotification(`Ошибка: ${data.message}`, 3000, 'error');
            }
        })
    }

    function handleEdit(subscriptionId) {
        showNotification(`Функционал находится в разработке...`, 3000, 'warning');
        // Реализация редактирования
    }

    function handleDelete(subscriptionId) {
        deleteSubscriptionFetch(subscriptionId).then(async (response) => {
            const data = await response.json();
            if (response.ok) {
                showNotification(`Удаление абонемента прошло успешно!`, 3000, 'success');
                updateSubscriptions();
            } else {
                showNotification(`Ошибка: ${data.message}`, 3000, 'error');
            }
        });
    }

    useEffect(() => {
        const initialLessons = Array.from({ length: subscription.total_lessons }, (_, i) => ({
            number: i + 1,
            status: ''
        }));

        const updatedLessons = [...initialLessons];
        subscription.lessons.forEach((lesson, index) => {
            if (index < updatedLessons.length) {
                updatedLessons[index].status = lesson.status;
            }
        });

        setFormattedLessons(updatedLessons);
    }, [subscription.total_lessons, subscription.lessons]);

    const getBadgeClass = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-success';
            case 'cancelled_in_time':
                return 'bg-primary';
            case 'missed':
                return 'bg-danger';
            case 'scheduled':
            default:
                return 'bg-secondary';
        }
    };

    return (
        <div className={`card ${subscription.in_archive === false ? 'text-dark bg-light' : 'text-dark bg-light'} mb-3 ${styles.card}`}>
            <div className="card-header d-flex justify-content-between align-items-center">
                <span className="fw-bold">Абонемент #{subscriptionId}</span>
                <span className={`badge ${subscription.in_archive ? 'bg-warning text-dark' : 'bg-light text-dark'}`}>
                    {subscription.in_archive ? 'Архивный' : 'Активный'}
                </span>
            </div>

            <div className="card-body position-relative">
                <div className="position-absolute top-0 end-0 me-3 mt-2 small">
                    {subscription.start_date} - {subscription.end_date}
                </div>

                <h4 className="card-title mb-3">
                    <strong>{subscription.student_full_name}</strong>
                </h4>

                <div className="mt-3">
                    <p>
                        Всего занятий: {subscription.total_lessons} <br/>
                        Преподаватель: {subscription.teacher_full_name}
                    </p>

                    <div className="d-flex flex-wrap gap-2 justify-content-center mt-4">
                        {formattedLessons.map(lesson => (
                            <span
                                key={lesson.number}
                                className={`badge fs-6 p-3 ${getBadgeClass(lesson.status)}`}
                            >
                                {lesson.number}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="mt-4 w-100 d-flex justify-content-end gap-2">
                    {(!subscription.in_archive && !isStudent) && (
                        <>
                            {/*<button*/}
                            {/*    type="button"*/}
                            {/*    className="btn btn-light"*/}
                            {/*    onClick={() => handleArchive(subscription.subscription_id)}*/}
                            {/*>*/}
                            {/*    Принудительно архивировать*/}
                            {/*</button>*/}
                            <button
                                type="button"
                                className="btn btn-warning"
                                onClick={() => handleEdit(subscription.subscription_id)}
                            >Редактировать</button>
                        </>
                    )}
                    {!isStudent && (
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => handleDelete(subscription.subscription_id)}
                        >Удалить</button>
                    )}
                </div>
            </div>
        </div>
    );
}
