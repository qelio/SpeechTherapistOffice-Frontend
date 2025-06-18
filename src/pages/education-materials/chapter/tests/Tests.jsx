import styles from './Tests.module.css';
import {useEffect, useState} from "react";
import ButtonHeader from "../../../../components/buttons/button-header/ButtonHeader";
import {getTests} from "../../../../api/tests/getTests";
import {deleteTest} from "../../../../api/tests/deleteTest";
import {getExercisesByTest} from "../../../../api/tests/getExercisesByTest";
import ButtonHeaderVisibility from "../../../../components/buttons/button-header-visibility/ButtonHeaderVisibility";
import {getStudentsForTeacher} from "../../../../api/teaching/getStudentsForTeacher";
import {createActiveTest} from "../../../../api/tests/createActiveTest";

export default function Tests( {showNotification, setChapter} ) {

    const [formAppointErrors, setFormAppointErrors] = useState([]);

    const [exercises, setExercises] = useState([]);
    const [showShowModal, setShowShowModal] = useState(false);
    const [showAppointModal, setShowAppointModal] = useState(false);
    const [appointStudentId, setAppointStudentId] = useState(null);
    const [appointTestId, setAppointTestId] = useState(null);
    const [students, setStudents] = useState([]);

    const [tests, setTests] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        per_page: 10,
        total: 0,
        total_pages: 1
    });

    function handleAppointModal(test_id) {
        setShowAppointModal(true);
        setAppointTestId(test_id);
        getStudentsForTeacher().then(async (response) => {
            const data = await response.json();
            if (response.ok) {
                setStudents(data);
            } else {
                showNotification(`Ошибка при получении списка студентов: ${data.message}`, 3000, 'error');
            }
        });
    }

    function handleAppointTest() {
        createActiveTest({test_id: appointTestId, student_id: appointStudentId}).then(async (response) => {
            const data = await response.json();
            if (response.ok) {
                setShowAppointModal(false);
                showNotification(`Тест успешно назначен!`, 3000, 'success');
            } else {
                showNotification(`Ошибка при назначении теста: ${data.message}`, 3000, 'error');
            }
        })
    }

    function formatDate(dateString) {
        const date = new Date(dateString);

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
    }

    function handleShowModalShowTest(testId) {
        setShowShowModal(true);
        getExercisesByTest(testId).then(async (response) => {
            const data = await response.json();
            if (response.ok) {
                setExercises(data);
            } else {
                showNotification(`Ошибка при получении списка заданий для теста: ${data.message}`, 3000, 'error');
            }
        });
    }

    function handleCreateTest() {
        setChapter(6);
    }

    function handleEditTest(test_id) {
        showNotification(`Функция находится в разработке...`, 3000, 'warning');
    }

    function handleDeleteTest(test_id) {
        deleteTest(test_id).then(async (response) => {
            const data = await response.json();
            if (response.ok) {
                fetchTests();
                showNotification(`Тест успешно удален!`, 3000, 'success');
            } else {
                showNotification(`Ошибка при получении списка тестов: ${data.message}`, 3000, 'error');
            }
        });
    }

    function fetchTests(page = 1) {
        getTests(page, pagination.per_page).then(async (response) => {
            const data = await response.json();
            if (response.ok) {
                setTests(data.data);
                setPagination(data.pagination);
            } else {
                showNotification(`Ошибка при получении списка тестов: ${data.message}`, 3000, 'error');
            }
        });
    }

    useEffect(() => {
        fetchTests();
    }, []);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.total_pages) {
            fetchTests(newPage);
        }
    };

    return (
        <main className="col-lg-9 pt-3 ps-5">
            <div className="d-flex justify-content-between align-items-center">
                <h1>Все тестирования</h1>
                <ButtonHeader buttonText="Создать новое тестирование" onClick={() => handleCreateTest()} />
            </div>
            <p className="mb-4">Вы можете просматривать тестирования и создавать собственные тестирования.</p>
            {tests.map((test) => (
                <div className="card mb-3">
                    <h6 className="card-header">Автор: 👤{test.teacher_full_name}</h6>
                    <div className="card-body">
                        <div className="d-flex justify-content-between">
                            <h4 className="card-title">{test.name}</h4>
                            <p className="card-text text-muted"><small>
                                Тип проверки: автоматическая<br/>
                            </small></p>
                        </div>
                        <p className="card-text text-muted"><small>
                            Описание: {test.description}<br/>
                            Дисциплина: {test.discipline_name}<br/>
                        </small></p>
                        <hr/>
                        <div className="d-flex justify-content-between">
                            <div className="d-flex justify-content-end">
                                <button type="button"
                                        className="btn btn-secondary me-2"
                                        onClick={() => handleAppointModal(test.test_id)}
                                >Назначить тест</button>
                                <button type="button"
                                        className="btn btn-secondary"
                                        onClick={() => handleShowModalShowTest(test.test_id)}
                                >Просмотр теста</button>
                            </div>
                            {test.to_edit === '1' && (
                                <div className="d-flex justify-content-end">
                                    <button type="button"
                                            className="btn btn-outline-danger me-2"
                                            onClick={() => handleDeleteTest(test.test_id)}
                                    >Удалить</button>
                                    <button type="button"
                                            className="btn btn-outline-warning"
                                            onClick={() => handleEditTest(test.test_id)}
                                    >Изменить</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
            {pagination.total_pages > 1 && (
                <nav aria-label="Page navigation">
                    <ul className="pagination justify-content-center">
                        <li className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => handlePageChange(pagination.page - 1)}
                            >
                                Назад
                            </button>
                        </li>

                        {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map(num => (
                            <li key={num} className={`page-item ${pagination.page === num ? 'active' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => handlePageChange(num)}
                                >
                                    {num}
                                </button>
                            </li>
                        ))}

                        <li className={`page-item ${pagination.page === pagination.total_pages ? 'disabled' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => handlePageChange(pagination.page + 1)}
                            >
                                Вперед
                            </button>
                        </li>
                    </ul>
                </nav>
            )}

            {showShowModal &&
                <div className="modal fade show d-block" id="passwordModal" tabIndex="-1" aria-labelledby="passwordModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="passwordModalLabel">Просмотр заданий теста</h5>
                                <button type="button"
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                        onClick={() => setShowShowModal(false)}></button>
                            </div>
                            <div className="modal-body" style={{
                                maxHeight: "70vh",
                                overflowY: "auto",
                                paddingRight: "15px"
                            }}>
                                {exercises.length === 0 && (
                                    <p className="text-center mt-3">Заданий пока нет</p>
                                )}
                                {exercises.map((exercise) => (
                                    <div className="card mb-3">
                                        <h6 className="card-header">Создано: {formatDate(exercise.created_at)}, 👤{exercise.teacher_full_name}</h6>
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between">
                                                <h4 className="card-title">{exercise.name}</h4>
                                                <p className="card-text text-muted"><small>
                                                    Тип проверки: автоматическая<br/>
                                                    Максимальный балл: {exercise.max_score}
                                                </small></p>
                                            </div>
                                            <p className="card-text text-muted"><small>
                                                Дисциплина: {exercise.discipline_name}<br/>
                                                Классификатор: {exercise.classifier_name}<br/>
                                                Модуль: {exercise.module_name}<br/>
                                            </small></p>
                                            <hr/>
                                            <p className="card-text">{exercise.description}</p>
                                            <hr/>
                                            <p className="card-text">Правильный ответ: {exercise.right_answer}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            }

            {showAppointModal &&
                <div className="modal fade show d-block" id="passwordModal" tabIndex="-1" aria-labelledby="passwordModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="passwordModalLabel">Назначение теста</h5>
                                <button type="button"
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                        onClick={() => setShowAppointModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="studentSelect" className="form-label">Выберите студента:</label>
                                    <select
                                        id="studentSelect"
                                        className={`form-select ${formAppointErrors.studentId && 'is-invalid'}`}
                                        required
                                        onChange={(e) => setAppointStudentId(e.target.value)}
                                    >
                                        <option value="">-- Выберите студента --</option>
                                        {students.map(student => (
                                            <option key={student.user_id} value={student.user_id}>
                                                {student.user_id} - {student.full_name}
                                            </option>
                                        ))}
                                    </select>
                                    {formAppointErrors.studentId && <div className="invalid-feedback">{formAppointErrors.studentId}</div>}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <ButtonHeaderVisibility
                                    buttonText="Отмена"
                                    onClick={() => showAppointModal(false)}/>
                                <ButtonHeader
                                    buttonText="Назначить тест"
                                    onClick={() => handleAppointTest()}/>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </main>
    );
}