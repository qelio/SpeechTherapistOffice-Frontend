import styles from './TeachingPage.module.css';
import {useEffect, useState} from "react";
import userAv from "../../assets/profile/user.png";
import {authFlow} from "../../api/auth/authFlow";
import {useNavigate} from "react-router-dom";
import {getSelf} from "../../api/users/getSelf";
import ButtonHeader from "../../components/buttons/button-header/ButtonHeader";
import {getUserByUniqueCode} from "../../api/teaching/getUserByUniqueCode";
import NotificationNeutral from "../../components/notifications/notification-neutral/NotificationNeutral";
import useNotification from "../../hooks/useNotificationNeutral";
import ButtonHeaderVisibility from "../../components/buttons/button-header-visibility/ButtonHeaderVisibility";
import StudentCard from "../../components/cards/student-card/StudentCard";
import {attachStudentFetch} from "../../api/teaching/attachStudentFetch";
import {getStudentsForTeacher} from "../../api/teaching/getStudentsForTeacher";
import {disconnectStudentFetch} from "../../api/teaching/disconnectStudentFetch";
import {createSubscriptionFetch} from "../../api/teaching/createSubscriptionFetch";
import SubscriptionCard from "../../components/cards/subscription-card/SubscriptionCard";
import {getSubscriptionsFetch} from "../../api/teaching/getSubscriptionsFetch";

export default function TeachingPage() {
    // Набор состояний для карточки студента
    const [studentCardFullName, setStudentCardFullName] = useState("");
    const [studentCardEmail, setStudentCardEmail] = useState("");
    const [studentCardBirthday, setStudentCardBirthday] = useState("");
    const [studentCardGender, setStudentCardGender] = useState("");
    const [studentCardCity, setStudentCardCity] = useState("");
    const [studentCardPhoneNumber, setStudentCardPhoneNumber] = useState("");
    const [studentCardUniqueCode, setStudentCardUniqueCode] = useState("");
    const [studentCardProfilePictureUrl, setStudentCardProfilePictureUrl] = useState("");

    const { notification, showNotification, closeNotification } = useNotification();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    // Набор состояний для прикрепления ученика
    const [teacherId, setTeacherId] = useState(0);
    const [studentId, setStudentId] = useState(0);

    // Состояние для отображения всех учеников
    const [students, setStudents] = useState([]);

    // Состояния для создания абонемента
    const [subscriptionStudentId, setSubscriptionStudentId] = useState("");
    const [subscriptionNumberOfClasses, setSubscriptionNumberOfClasses] = useState("");
    const [subscriptionDateStart, setSubscriptionDateStart] = useState("");
    const [subscriptionDateEnd, setSubscriptionDateEnd] = useState("");
    const [subscriptionErrors, setSubscriptionErrors] = useState([]);

    // Состояние для всех полученных абонементов
    const[subscriptions, setSubscriptions] = useState([]);

    const [chapter, setChapter] = useState(1);
    const [uniqueCode, setUniqueCode] = useState(null);
    const [showStudentModal, setShowStudentModal] = useState(false);

    function getSubscriptions() {
        getSubscriptionsFetch().then(async (response) => {
            const data = await response.json();
            setSubscriptions(data);
        });
    }

    function checkCreateSubscription() {
        const newErrors = {
            studentId: '',
            numberOfClasses: '',
            dateStart: '',
            dateEnd: ''
        };
        let continueForm = true;
        if (!subscriptionStudentId) {
            newErrors.studentId = 'Необходимо выбрать студента';
            continueForm = false;
        }
        if (!subscriptionNumberOfClasses) {
            newErrors.numberOfClasses = 'Необходимо указать количество занятий';
            continueForm = false;
        }
        if (!subscriptionDateStart) {
            newErrors.dateStart = 'Необходимо указать дату начала действия абонемента';
            continueForm = false;
        }
        if (!subscriptionDateEnd) {
            newErrors.dateEnd = 'Необходимо указать дату окончания действия абонемента';
            continueForm = false;
        }
        if (continueForm) {
            return true;
        } else {
            setSubscriptionErrors(newErrors);
            return false;
        }
    }

    function createSubscription() {
        if (checkCreateSubscription()) {
            createSubscriptionFetch({
                total_lessons: subscriptionNumberOfClasses,
                student_id: subscriptionStudentId,
                start_date: subscriptionDateStart,
                end_date: subscriptionDateEnd
            }).then(async (response) => {
                const data = await response.json();
                if (response.ok) {
                    showNotification(`Создание нового абонемента прошло успешно!`, 3000, 'success');
                    setChapter(4);
                    getSubscriptions();
                } else {
                    showNotification(`Ошибка: ${data.message}`, 3000, 'error');
                }
            });
        }
    }

    function allowDisconnectStudent(user_id) {
        disconnectStudentFetch({student_id: user_id}).then(async (response) => {
            const data = await response.json();
            if (response.ok) {
                showNotification(`Пользователь с типом "Student" успешно отвязан от вашего аккаунта!`, 3000, 'success');
                showStudentsForTeacher();
            } else {
                showNotification(`Ошибка: ${data.message}`, 3000, 'error');
            }
        });
    }

    function showStudentsForTeacher() {
        getStudentsForTeacher().then(async (response) => {
            const data = await response.json();
            const formattedData = data.map(item => {
                let profile_picture_url = '';
                if (item.profile_picture_url) {
                    profile_picture_url = `http://80.249.151.3/api/users/get_profile_picture_by_url?url=${item.profile_picture_url}&t=${Date.now()}`;
                } else {
                    profile_picture_url = userAv;
                }
                return ({
                    user_id: item.user_id,
                    fullName: item.full_name,
                    email: item.email,
                    birthday: item.birthday,
                    gender: item.gender,
                    city: item.city,
                    phoneNumber: item.phone_number,
                    uniqueCode: item.unique_code,
                    profilePictureUrl: profile_picture_url,
                });
            });
            setStudents(formattedData);
            console.log(data);
        })
    }

    async function allowAttachStudent() {
        console.log(teacherId, studentId);
        attachStudentFetch({student_id: studentId}).then(async (response) => {
            setShowStudentModal(false);
            if (response.ok) {
                showNotification(`Привязка пользователя типа "Student" прошла успешно!`, 3000, 'access');
            } else {
                const data = await response.json();
                console.log(data);
                showNotification(`Ошибка: ${data.message}`, 3000, 'error');
            }
        });
    }

    function attachStudent() {
        getUserByUniqueCode(uniqueCode).then(data => {
            if (data) {
                setStudentCardFullName(data.full_name);
                setStudentCardEmail(data.email);
                setStudentCardBirthday(data.birthday);
                setStudentCardGender(data.gender);
                setStudentCardCity(data.city);
                setStudentCardPhoneNumber(data.phone_number);
                setStudentCardUniqueCode(data.unique_code);
                setStudentId(data.student_id);
                if (data.profile_picture_url) {
                    setStudentCardProfilePictureUrl(`http://80.249.151.3/api/users/get_profile_picture_by_url?url=${data.profile_picture_url}&t=${Date.now()}`);
                } else {
                    setStudentCardProfilePictureUrl(userAv);
                }
                setShowStudentModal(true);
            } else {
                showNotification(`Пользователь типа "Student" с таким уникальным кодом не найден!`, 3000, 'warning');
            }
        });
    }

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
                            <h3>Учительская</h3>
                            <hr />
                            <ul className="nav flex-column">
                                <li className="nav-item">
                                    <a className="nav-link"
                                        href="#"
                                        onClick={() => setChapter(1)}>Прикрепление учеников</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link"
                                        href="#"
                                        onClick={() => {
                                            setChapter(2);
                                            showStudentsForTeacher();
                                        }}>Мои ученики</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link"
                                        href="#"
                                        onClick={() => {
                                            setChapter(3);
                                            showStudentsForTeacher();
                                        }}>Создание абонементов</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link"
                                        href="#"
                                        onClick={() => {
                                            setChapter(4);
                                            getSubscriptions();
                                        }}>Мои абонементы</a>
                                </li>
                            </ul>
                        </div>
                    </aside>
                    {chapter === 1 && (
                        <main className="col-lg-9 pt-3 ps-5">
                            <h1>Прикрепление учеников</h1>
                            <p>В данном разделе вы можете прикрепить ученика к своему аккаунту, воспользовавшись поиском, либо уникальным кодом ученика.</p>
                            <div className="d-flex align-items-center mt-4">
                                <div className="flex-grow-1 me-2">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Введите уникальный код ученика"
                                        id="studentUniqueCode"
                                        onChange={(e) => setUniqueCode(e.target.value)}
                                    />
                                </div>
                                <ButtonHeader buttonText="Прикрепить ученика"
                                              onClick={() => attachStudent()} />
                            </div>
                        </main>
                    )}
                    {chapter === 2 && (
                        <main className="col-lg-9 pt-3 ps-5">
                            <h1>Мои ученики</h1>
                            <p className="mb-4">В данном разделе вы можете видеть всех прикрепленных к вашему аккаунту учеников.</p>
                            {students.length === 0 ? (
                                <p>Нет учеников</p>
                            ) : (
                                <div className="row">
                                    {students.map((student) => (
                                        <div key={student.user_id} className="col-12 mb-4">
                                            <StudentCard
                                                userId={student.user_id}
                                                fullName={student.fullName}
                                                email={student.email}
                                                gender={student.gender}
                                                birthday={student.birthday}
                                                city={student.city}
                                                phoneNumber={student.phoneNumber}
                                                uniqueCode={student.uniqueCode}
                                                profilePictureUrl={student.profilePictureUrl}
                                                onClick={allowDisconnectStudent}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </main>
                    )}
                    {chapter === 3 && (
                        <main className="col-lg-9 pt-3 ps-5">
                            <h1>Создание абонементов</h1>
                            <p>В данном разделе вы можете создавать новые абонементы, закрепляя их за учениками.</p>
                            <div className="mb-3">
                                <label htmlFor="studentSelect" className="form-label">Выберите студента:</label>
                                <select
                                    id="studentSelect"
                                    className={`form-select ${subscriptionErrors.studentId && 'is-invalid'}`}
                                    required
                                    onChange={(e) => setSubscriptionStudentId(e.target.value)}
                                    disabled={isLoading}
                                >
                                    <option value="">-- Выберите студента --</option>
                                    {students.map(student => (
                                        <option key={student.user_id} value={student.user_id}>
                                            {student.user_id} - {student.fullName}
                                        </option>
                                    ))}
                                </select>
                                {subscriptionErrors.studentId && <div className="invalid-feedback">{subscriptionErrors.studentId}</div>}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="lessonCount" className="form-label">Количество занятий:</label>
                                <select
                                    id="lessonCount"
                                    className={`form-select ${subscriptionErrors.numberOfClasses && 'is-invalid'}`}
                                    required
                                    onChange={(e) => setSubscriptionNumberOfClasses(e.target.value)}
                                    disabled={isLoading}
                                >
                                <option value="">-- Выберите количество занятий --</option>
                                    {[2, 3, 4, 5, 6, 7, 8].map(num => (
                                        <option key={num} value={num}>{num} занятий</option>
                                    ))}
                                </select>
                                {subscriptionErrors.numberOfClasses && <div className="invalid-feedback">{subscriptionErrors.numberOfClasses}</div>}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Дата начала:</label>
                                <input
                                    type="date"
                                    className={`form-control ${subscriptionErrors.dateStart && 'is-invalid'}`}
                                    onChange={(e) => setSubscriptionDateStart(e.target.value)}
                                />
                                {subscriptionErrors.dateStart && <div className="invalid-feedback">{subscriptionErrors.dateStart}</div>}
                            </div>

                            <div className="mb-4">
                                <label className="form-label">Дата окончания:</label>
                                <input
                                    type="date"
                                    className={`form-control ${subscriptionErrors.dateEnd && 'is-invalid'}`}
                                    onChange={(e) => setSubscriptionDateEnd(e.target.value)}
                                />
                                {subscriptionErrors.dateEnd && <div className="invalid-feedback">{subscriptionErrors.dateEnd}</div>}
                            </div>

                            <ButtonHeader buttonText="Создать абонемент" onClick={createSubscription}/>
                        </main>
                    )}
                    {chapter === 4 && (
                        <main className="col-lg-9 pt-3 ps-5">
                            <h1>Мои абонементы</h1>
                            <p>В данном разделе вы можете просматривать созданные абонементы и редактировать их.</p>
                            {subscriptions.map(subscription => (
                                subscription.in_archive === false && (
                                    <SubscriptionCard
                                        subscription={subscription}
                                        updateSubscriptions={getSubscriptions}
                                        showNotification={showNotification}
                                    />
                                )
                            ))}
                            {subscriptions.map(subscription => (
                                subscription.in_archive === true && (
                                    <SubscriptionCard
                                        subscription={subscription}
                                        updateSubscriptions={getSubscriptions}
                                        showNotification={showNotification}
                                    />
                                )
                            ))}
                        </main>
                    )}
                </div>
            </div>
            {showStudentModal &&
                <div className="modal fade show d-block" id="passwordModal" tabIndex="-1" aria-labelledby="passwordModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="passwordModalLabel">Вы действительно хотите прикрепить данного ученика?</h5>
                                <button type="button"
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                        onClick={() => setShowStudentModal(false)}></button>
                            </div>
                            <div className="modal-body d-flex justify-content-center align-items-center">
                                <StudentCard fullName={studentCardFullName}
                                             email={studentCardEmail}
                                             gender={studentCardGender}
                                             birthday={studentCardBirthday}
                                             city={studentCardCity}
                                             phoneNumber={studentCardPhoneNumber}
                                             uniqueCode={studentCardUniqueCode}
                                             profilePictureUrl={studentCardProfilePictureUrl}/>
                            </div>
                            <div className="modal-footer">
                                <ButtonHeaderVisibility
                                    buttonText="Отмена"
                                    onClick={() => setShowStudentModal(false)}/>
                                <ButtonHeader
                                    buttonText="Прикрепить ученика"
                                    onClick={() => allowAttachStudent()}/>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}
