import styles from './EducationMaterialsPage.module.css';
import {useEffect, useState} from "react";
import {authFlow} from "../../api/auth/authFlow";
import {useNavigate} from "react-router-dom";
import {getSelf} from "../../api/users/getSelf";
import Disciplines from "./chapter/disciplines/Disciplines";
import Classifiers from "./chapter/classifiers/Classifiers";
import Modules from "./chapter/modules/Modules";
import Exercises from "./chapter/exercises/Exercises";
import Tests from "./chapter/tests/Tests";
import useNotification from "../../hooks/useNotificationNeutral";
import NotificationNeutral from "../../components/notifications/notification-neutral/NotificationNeutral";
import CreateTest from "./chapter/create-test/CreateTest";
import TeacherTestsView from "./chapter/teacher-test-view/TeacherTestView";

export default function EducationMaterialsPage() {

    const { notification, showNotification, closeNotification } = useNotification();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    const [teacher, setTeacher] = useState(0);
    const [chapter, setChapter] = useState(1);

    function updateTeacherStates() {
        getSelf().then((data) => {
            if (data.role_teacher === 1) {
                setTeacher(1);
            } else {
                setTeacher(0);
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
                            <h3>Учебные материалы</h3>
                            <hr />
                            <ul className="nav flex-column">
                                <li className="nav-item">
                                    <a className="nav-link"
                                       href="#"
                                       onClick={() => setChapter(1)}>Дисциплины</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link"
                                       href="#"
                                       onClick={() => {
                                           setChapter(2);
                                       }}>Классификаторы</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link"
                                       href="#"
                                       onClick={() => {
                                           setChapter(3);
                                       }}>Образовательные модули</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link"
                                       href="#"
                                       onClick={() => {
                                           setChapter(4);
                                       }}>Задания</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link"
                                       href="#"
                                       onClick={() => {
                                           setChapter(5);
                                       }}>Тестирования</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link"
                                       href="#"
                                       onClick={() => {
                                           setChapter(6);
                                       }}>Создать тестирование</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link"
                                       href="#"
                                       onClick={() => {
                                           setChapter(7);
                                       }}>Активные тесты</a>
                                </li>
                            </ul>
                        </div>
                    </aside>
                    {chapter === 1 && (
                        <Disciplines showNotification={showNotification} />
                    )}
                    {chapter === 2 && (
                        <Classifiers showNotification={showNotification} />
                    )}
                    {chapter === 3 && (
                        <Modules showNotification={showNotification} />
                    )}
                    {chapter === 4 && (
                        <Exercises showNotification={showNotification} />
                    )}
                    {chapter === 5 && (
                        <Tests showNotification={showNotification} setChapter={setChapter} />
                    )}
                    {chapter === 6 && (
                        <CreateTest showNotification={showNotification} setChapter={setChapter} />
                    )}
                    {chapter === 7 && (
                        <TeacherTestsView showNotification={showNotification} />
                    )}
                </div>
            </div>
        </div>
    )
}
