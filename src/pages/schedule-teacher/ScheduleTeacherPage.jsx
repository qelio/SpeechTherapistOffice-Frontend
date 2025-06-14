import styles from './ScheduleTeacherPage.module.css';
import useNotification from "../../hooks/useNotificationNeutral";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {getSelf} from "../../api/users/getSelf";
import {authFlow} from "../../api/auth/authFlow";
import NotificationNeutral from "../../components/notifications/notification-neutral/NotificationNeutral";
import ButtonHeader from "../../components/buttons/button-header/ButtonHeader";
import StudentCard from "../../components/cards/student-card/StudentCard";
import SubscriptionCard from "../../components/cards/subscription-card/SubscriptionCard";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import ruLocale from "@fullcalendar/core/locales/ru";
import ModularCalendar from "./chapters/modular-calendar/ModularCalendar";
import UpcomingClasses from "./chapters/upcoming-classes/UpcomingClasses";
import CreateNewClass from "./chapters/create-new-class/CreateNewClass";

export default function ScheduleTeacherPage() {

    const { notification, showNotification, closeNotification } = useNotification();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [chapter, setChapter] = useState(1);
    const [teacherId, setTeacherId] = useState(0);

    function updateTeacherStates() {
        getSelf().then((data) => {
            if (data.role_teacher === 1) {
                setTeacherId(data.teacher_id);
            } else {
                navigate('/');
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
                updateTeacherStates();
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
                            <h3>Моё расписание</h3>
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
                                       }}>Создание нового занятия</a>
                                </li>
                            </ul>
                        </div>
                    </aside>
                    {chapter === 1 && (
                        <ModularCalendar showNotification={showNotification} />
                    )}
                    {chapter === 2 && (
                        <UpcomingClasses showNotification={showNotification} />
                    )}
                    {chapter === 3 && (
                        <CreateNewClass showNotification={showNotification} />
                    )}
                </div>
            </div>
        </div>
    );
}