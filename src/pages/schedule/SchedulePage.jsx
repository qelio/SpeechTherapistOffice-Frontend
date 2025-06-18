import styles from './SchedulePage.module.css';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import ruLocale from '@fullcalendar/core/locales/ru'
import useNotification from "../../hooks/useNotificationNeutral";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {authFlow} from "../../api/auth/authFlow";
import NotificationNeutral from "../../components/notifications/notification-neutral/NotificationNeutral";
import ModularCalendarStudent from "./chapters/modular-calendar-student/ModularCalendarStudent";
import UpcomingClassesStudent from "./chapters/upcomig-classes-student/UpcomingClassesStudent";
import PastClassesStudent from "./chapters/past-classes-student/PastClassesStudent";

export default function SchedulePage() {

    const { notification, showNotification, closeNotification } = useNotification();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [chapter, setChapter] = useState(1);

    useEffect(() => {
        const verifyAuth = async () => {
            const userId = await authFlow();
            if (!userId) {
                navigate('/sign-in');
            } else {
                setIsLoading(false);
            }
        };
        verifyAuth().then();
    }, [navigate]);

    if (isLoading) {
        return (
            <div className="container d-flex justify-content-center align-items-center p-4">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

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

            <div className="container-fluid">
                <div className="row">
                    <aside className="col-lg-3 py-4 bg-light p-4 rounded-3">
                        <div className="sticky-top" style={{top: '20px'}}>
                            <h3>Расписание</h3>
                            <hr />
                            <ul className="nav flex-column">
                                <li className="nav-item">
                                    <a className="nav-link"
                                       href="#"
                                       onClick={() => setChapter(1)}>Модульный календарь</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link"
                                       href="#"
                                       onClick={() => {
                                           setChapter(2);
                                       }}>Предстоящие занятия</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link"
                                       href="#"
                                       onClick={() => {
                                           setChapter(3);
                                       }}>Прошедшие занятия</a>
                                </li>
                            </ul>
                        </div>
                    </aside>
                    {chapter === 1 && (
                        <ModularCalendarStudent showNotification={showNotification} />
                    )}
                    {chapter === 2 && (
                        <UpcomingClassesStudent showNotification={showNotification} />
                    )}
                    {chapter === 3 && (
                        <PastClassesStudent showNotification={showNotification} />
                    )}
                </div>
            </div>
        </div>
    )
}
