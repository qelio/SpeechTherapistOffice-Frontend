import { useEffect, useState } from "react";
import { getCookie } from "../../../../utils/cookies";

export default function TeacherTestsView({ showNotification }) {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedTest, setExpandedTest] = useState(null);

    const fetchTeacherTests = async () => {
        try {
            const response = await fetch('http://80.249.151.3/api/active_tests/student-tests', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'X-CSRF-TOKEN': getCookie('csrf_access_token')
                }
            });

            const data = await response.json();
            if (response.ok) {
                setTests(data);
            } else {
                showNotification(data.message || "Ошибка загрузки тестов", 3000, 'error');
            }
        } catch (error) {
            showNotification("Ошибка сети", 3000, 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeacherTests();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return 'В процессе';
        return new Date(dateString).toLocaleString('ru-RU');
    };

    const toggleExpand = (activeId) => {
        setExpandedTest(expandedTest === activeId ? null : activeId);
    };

    if (loading) {
        return <div className="text-center my-5">Загрузка...</div>;
    }

    return (
        <main className="col-lg-9 pt-3 ps-5">
            <h1>Тесты учеников</h1>

            {tests.length === 0 ? (
                <div className="alert alert-info">Нет тестов для отображения</div>
            ) : (
                <div className="list-group">
                    {tests.map(test => (
                        <div key={test.active_id} className="list-group-item mb-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h5>{test.test_name}</h5>
                                    <div className="text-muted small">
                                        Ученик: {test.student_name} •
                                        Статус: {test.status === 'active_sent' ? 'Завершен' : 'Активен'}
                                    </div>
                                </div>
                                <div className="text-end">
                                    {test.status === 'active_sent' && (
                                        <div className="fw-bold">
                                            {test.correct_answers}/{test.total_exercises} (
                                            {Math.round(test.correct_answers/test.total_exercises*100)}%)
                                        </div>
                                    )}
                                    <div className="text-muted small">
                                        {formatDate(test.time_start)} - {formatDate(test.time_end)}
                                    </div>
                                </div>
                            </div>

                            <button
                                className="btn btn-sm btn-outline-primary mt-2"
                                onClick={() => toggleExpand(test.active_id)}
                            >
                                {expandedTest === test.active_id ? 'Скрыть' : 'Подробнее'}
                            </button>

                            {expandedTest === test.active_id && (
                                <div className="mt-3">
                                    <h6>Детали выполнения:</h6>
                                    <div className="table-responsive">
                                        <table className="table table-sm table-hover">
                                            <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Ответ ученика</th>
                                                <th>Правильный ответ</th>
                                                <th>Результат</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {test.exercises.map((ex, idx) => (
                                                <tr key={ex.exercise_id}>
                                                    <td>{idx + 1}</td>
                                                    <td>{ex.student_answer || 'Нет ответа'}</td>
                                                    <td>{ex.right_answer || '—'}</td>
                                                    <td>
                                                            <span className={`badge ${
                                                                ex.is_correct ? 'bg-success' : 'bg-danger'
                                                            }`}>
                                                                {ex.is_correct ? 'Правильно' : 'Неправильно'}
                                                            </span>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}