import styles from './HomeWorkPage.module.css';
import useNotification from "../../hooks/useNotificationNeutral";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {authFlow} from "../../api/auth/authFlow";
import NotificationNeutral from "../../components/notifications/notification-neutral/NotificationNeutral";
import ActiveTests from "./chapters/active-tests/ActiveTests";
import ResolvedTests from "./chapters/resolved-tests/ResolvedTests";
import {getCookie} from "../../utils/cookies";

export default function HomeWorkPage() {
    const [activeTestId, setActiveTestId] = useState(null);
    const [currentExercise, setCurrentExercise] = useState(null);
    const [testData, setTestData] = useState(null);
    const [studentAnswer, setStudentAnswer] = useState('');
    const { notification, showNotification, closeNotification } = useNotification();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [chapter, setChapter] = useState(1);

    async function startTest(activeId) {
        try {
            const response = await fetch(`http://80.249.151.3/api/active_tests/start/${activeId}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRF-TOKEN': getCookie('csrf_access_token')
                }
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to start test');
            return data;
        } catch (error) {
            console.error('Error starting test:', error);
            throw error;
        }
    }

    async function fetchTestWithAnswers(activeId) {
        try {
            const response = await fetch(`http://80.249.151.3/api/active_tests/${activeId}/exercises`, {
                credentials: 'include'
            });
            const data = await response.json();
            console.log(data);
            if (!response.ok) throw new Error(data.message || 'Failed to fetch test');
            return data;
        } catch (error) {
            console.error('Error fetching test:', error);
            throw error;
        }
    }

    async function submitAnswer(activeId, exerciseId, answer) {
        try {
            const response = await fetch(`http://80.249.151.3/api/active_tests/${activeId}/add-package`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': getCookie('csrf_access_token'),
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    exercise_id: exerciseId,
                    student_answer: answer
                })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to submit answer');
            return data;
        } catch (error) {
            console.error('Error submitting answer:', error);
            throw error;
        }
    }

    async function completeTest(activeId) {
        try {
            const response = await fetch(`http://80.249.151.3/api/active_tests/complete/${activeId}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRF-TOKEN': getCookie('csrf_access_token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to complete test');
            return data;
        } catch (error) {
            console.error('Error completing test:', error);
            throw error;
        }
    }

    useEffect(() => {
        if (activeTestId) {
            const loadTest = async () => {
                try {
                    await startTest(activeTestId);

                    const data = await fetchTestWithAnswers(activeTestId);
                    setTestData(data);

                    if (data.exercises.length > 0 && !currentExercise) {
                        setCurrentExercise(data.exercises[0]);
                        setChapter(3);
                    }
                } catch (error) {
                    showNotification(error.message, 3000, 'error');
                    setChapter(1);
                    setActiveTestId(null);
                }
            };
            loadTest();
        }
    }, [activeTestId]);

    const handleSubmitAnswer = async () => {
        if (!studentAnswer.trim()) {
            showNotification('Введите ответ', 3000, 'error');
            return;
        }

        try {
            await submitAnswer(activeTestId, currentExercise.exercise_id, studentAnswer);
            const updatedData = await fetchTestWithAnswers(activeTestId);
            setTestData(updatedData);
            const updatedExercise = updatedData.exercises.find(
                ex => ex.exercise_id === currentExercise.exercise_id
            );
            setCurrentExercise(updatedExercise);
            setStudentAnswer('');
            showNotification('Ответ отправлен', 3000, 'success');
        } catch (error) {
            showNotification(error.message, 3000, 'error');
        }
    };

    const handleCompleteTest = async () => {
        try {
            if (testData) {
                const unanswered = testData.exercises.filter(
                    ex => !ex.student_answer && ex.status_verification === 'not_attempted'
                );

                for (const exercise of unanswered) {
                    await submitAnswer(activeTestId, exercise.exercise_id, '');
                }
            }

            await completeTest(activeTestId);
            showNotification('Тест завершен', 3000, 'success');
            setChapter(2);
            setActiveTestId(null);
            setTestData(null);
            setCurrentExercise(null);
        } catch (error) {
            showNotification(error.message, 3000, 'error');
        }
    };

    // Проверка аутентификации
    useEffect(() => {
        const verifyAuth = async () => {
            const userId = await authFlow();
            if (!userId) {
                navigate('/sign-in');
            } else {
                setIsLoading(false);
            }
        };
        verifyAuth();
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
                            <h3>Домашние задания</h3>
                            <hr />
                            <ul className="nav flex-column">
                                <li className="nav-item">
                                    <button className="nav-link btn btn-link text-start"
                                            onClick={() => {
                                                setChapter(1);
                                                setActiveTestId(null);
                                                setTestData(null);
                                                setCurrentExercise(null);
                                            }}>Активные тесты</button>
                                </li>
                                <li className="nav-item">
                                    <button className="nav-link btn btn-link text-start"
                                            onClick={() => {
                                                setChapter(2);
                                                setActiveTestId(null);
                                                setTestData(null);
                                                setCurrentExercise(null);
                                            }}>Решенные тесты</button>
                                </li>
                            </ul>
                        </div>
                    </aside>

                    {chapter === 1 && (
                        <ActiveTests showNotification={showNotification} setActiveTestId={setActiveTestId} />
                    )}

                    {chapter === 2 && (
                        <ResolvedTests showNotification={showNotification} />
                    )}

                    {chapter === 3 && testData && currentExercise && (
                        <main className="col-lg-9 pt-3 ps-5">
                            <div className="card mb-4">
                                <div className="card-header">
                                    <b>Название теста: </b>{testData.test_name}
                                </div>
                                <div className="card-body">
                                    <div className="d-flex flex-wrap gap-2 justify-content-center mt-2">
                                        {testData.exercises.map((exercise, index) => (
                                            <button
                                                key={exercise.exercise_id}
                                                className={`btn fs-6 p-3 ${
                                                    exercise.student_answer === exercise.right_answer
                                                        ? 'btn-success'
                                                        : exercise.student_answer === null
                                                            ? 'btn-secondary'
                                                            : 'btn-danger'
                                                }`}
                                                onClick={() => {
                                                    setCurrentExercise(exercise);
                                                    setStudentAnswer(exercise.student_answer || '');
                                                }}
                                            >
                                                {index + 1}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="card mb-4">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <h4 className="card-title">{currentExercise.name}</h4>
                                        <p className="card-text text-muted"><small>
                                            Тип проверки: {currentExercise.verification_type}<br/>
                                            Максимальный балл: {currentExercise.max_score}
                                        </small></p>
                                    </div>
                                    <hr/>
                                    <p className="card-text">{currentExercise.description}</p>
                                    <hr/>

                                    {currentExercise.student_answer ? (
                                        <div className="mb-3">
                                            <p>Ваш ответ: {currentExercise.student_answer}</p>
                                            {currentExercise.right_answer && (
                                                <>
                                                    <p>Правильный ответ: {currentExercise.right_answer}</p>
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="mb-3">
                                            <label htmlFor="answerInput" className="form-label">Ваш ответ:</label>
                                            <textarea
                                                id="answerInput"
                                                className="form-control"
                                                rows="3"
                                                value={studentAnswer}
                                                onChange={(e) => setStudentAnswer(e.target.value)}
                                            ></textarea>
                                            <button
                                                className="btn btn-primary mt-3"
                                                onClick={handleSubmitAnswer}
                                            >
                                                Отправить ответ
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="d-flex justify-content-between mb-3">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setChapter(1);
                                        setActiveTestId(null);
                                        setTestData(null);
                                        setCurrentExercise(null);
                                    }}
                                >
                                    Назад к списку тестов
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={handleCompleteTest}
                                    disabled={!testData || testData.exercises.some(
                                        ex => !ex.student_answer && ex.status_verification === 'not_attempted'
                                    )}
                                >
                                    Завершить тест
                                </button>
                            </div>
                        </main>
                    )}
                </div>
            </div>
        </div>
    )
}