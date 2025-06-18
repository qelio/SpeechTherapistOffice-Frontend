import styles from './Exercises.module.css';
import {useEffect, useState} from "react";
import {getFilteredExercises} from "../../../../api/education-materials/getFilteredExercises";
import {deleteExercise} from "../../../../api/education-materials/deleteExercise";
import ButtonHeader from "../../../../components/buttons/button-header/ButtonHeader";
import ButtonHeaderVisibility from "../../../../components/buttons/button-header-visibility/ButtonHeaderVisibility";
import {getEducationModules} from "../../../../api/education-materials/getEducationModules";
import {getClassifiersByDiscipline} from "../../../../api/education-materials/getClassifiersByDiscipline";
import {getTeacherDisciplines} from "../../../../api/education-materials/getTeacherDisciplines";
import {getModulesByClassifier} from "../../../../api/education-materials/getModulesByClassifier";
import {createExercise} from "../../../../api/education-materials/createExercise";

export default function Exercises( {showNotification} ) {

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [formErrors, setFormErrors] = useState([]);

    // Набор состояний для модального окна создания
    const [disciplines, setDisciplines] = useState([]);
    const [formDisciplineId, setFormDisciplineId] = useState(null);
    const [classifiers, setClassifiers] = useState([]);
    const [formClassifierId, setFormClassifierId] = useState(null);
    const [modules, setModules] = useState([]);
    const [formModuleId, setFormModuleId] = useState(null);
    const [formVerificationType, setFromVerificationType] = useState('auto');
    const [formMaxScore, setFormMaxScore] = useState(null);
    const [formName, setFormName] = useState(null);
    const [formDescription, setFormDescription] = useState(null);
    const [formRightAnswer, setFormRightAnswer] = useState(null);

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

    const [exercises, setExercises] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        per_page: 10,
        total: 0,
        total_pages: 1
    });

    function checkHandleCreateModal() {
        const newErrors = {
            discipline_id: "",
            classifier_id: "",
            module_id: "",
            max_score: "",
            name: "",
            description: "",
            right_answer: ""
        }

        let check = true;
        if (!formDisciplineId) {
            newErrors.discipline_id = "Пожалуйста, выберите дисциплину";
            check = false;
        }
        if (!formClassifierId) {
            newErrors.classifier_id= "Пожалуйста, выберите классификатор";
            check = false;
        }
        if (!formModuleId) {
            newErrors.module_id= "Пожалуйста, выберите модуль";
            check = false;
        }
        if (!formMaxScore) {
            newErrors.max_score= "Пожалуйста, выберите максимальный балл";
            check = false;
        }
        if (!formName) {
            newErrors.name= "Пожалуйста, укажите название задачи";
            check = false;
        }
        if (!formDescription) {
            newErrors.description= "Пожалуйста, укажите описание задачи";
            check = false;
        }
        if (!formRightAnswer) {
            newErrors.right_answer= "Пожалуйста, укажите правильный ответ";
            check = false;
        }
        setFormErrors(newErrors);
        return check;
    }

    function handleCreateExercise() {
        if (checkHandleCreateModal()) {
            createExercise({name: formName,
                description: formDescription,
                verification_type: formVerificationType,
                max_score: formMaxScore,
                module_id: formModuleId,
                right_answer: formRightAnswer}).then(async (response) => {
                const data = await response.json();
                if (response.ok) {
                    setShowCreateModal(false);
                    fetchExercises();
                    showNotification(`Задание успешно создано!`, 3000, 'success');
                } else {
                    showNotification(`Ошибка при создании задания: ${data.message}`, 3000, 'error');
                }
            });
        }
    }


    function handleShowCreateModal() {
        setShowCreateModal(true);
        updateDisciplines();
    }

    function updateEducationModules(classifier_id) {
        getModulesByClassifier(classifier_id).then(async (response) => {
            const data = await response.json();
            if (response.ok) {
                setModules(data);
            } else {
                showNotification(`Ошибка при получении списка классификаторов: ${data.message}`, 3000, 'error');
            }
        });
    }

    function updateDisciplines() {
        getTeacherDisciplines().then(async (response) => {
            const data = await response.json();
            if (response.ok) {
                setDisciplines(data);
            } else {
                showNotification(`Ошибка при получении списка дисциплин: ${data.message}`, 3000, 'error');
            }
        });
    }

    function updateClassifiers(discipline_id) {
        if (discipline_id) {
            getClassifiersByDiscipline(discipline_id).then(async (response) => {
                const data = await response.json();
                if (response.ok) {
                    setClassifiers(data);
                } else {
                    showNotification(`Ошибка при загрузке классификаторов: ${data.message}`, 3000, 'error');
                }
            });
        }
    }

    function handleDeleteExercise(exercise_id) {
        deleteExercise(exercise_id).then(async (response) => {
            const data = await response.json();
            if (response.ok) {
                fetchExercises();
                showNotification(`Задание успешно удалено`, 3000, 'access');
            } else {
                showNotification(`Ошибка при удалении задания: ${data.message}`, 3000, 'error');
            }
        });
    }

    function handleEditExercise(exercise_id) {
        showNotification(`Функция находится в разработке...`, 3000, 'warning');
    }

    function fetchExercises(page = 1) {
        getFilteredExercises(page, pagination.per_page).then(async (response) => {
            const data = await response.json();
            if (response.ok) {
                setExercises(data.data);
                setPagination(data.pagination);
            } else {
                showNotification(`Ошибка при получении списка заданий: ${data.message}`, 3000, 'error');
            }
        });
    }

    useEffect(() => {
        fetchExercises();
    }, []);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.total_pages) {
            fetchExercises(newPage);
        }
    };

    return (
        <main className="col-lg-9 pt-3 ps-5">
            <div className="d-flex justify-content-between align-items-center">
                <h1>Все доступные задания</h1>
                <ButtonHeader buttonText="Создать новое задание" onClick={() => handleShowCreateModal()}/>
            </div>
            <p className="mb-4">Вы можете просматривать задания и создавать собственные задания.</p>
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
                        {exercise.to_edit === '1' && (
                            <div className="d-flex justify-content-end">
                                <button type="button"
                                        className="btn btn-outline-warning me-2"
                                        onClick={() => handleEditExercise(exercise.exercise_id)}
                                >Изменить</button>
                                <button type="button"
                                        className="btn btn-outline-danger"
                                        onClick={() => handleDeleteExercise(exercise.exercise_id)}
                                >Удалить</button>
                            </div>
                        )}
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

            {showCreateModal &&
                <div className="modal fade show d-block" id="passwordModal" tabIndex="-1" aria-labelledby="passwordModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="passwordModalLabel">Создание нового задания</h5>
                                <button type="button"
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                        onClick={() => setShowCreateModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="discipline" className="form-label">Выберите дисциплину:</label>
                                    <select
                                        id="discipline"
                                        className={`form-select ${formErrors.discipline_id && 'is-invalid'}`}

                                        required
                                        onChange={(e) => {
                                            setFormDisciplineId(e.target.value);
                                            updateClassifiers(e.target.value);
                                        }}
                                    >
                                        <option value="">-- Выберите дисциплину --</option>
                                        {disciplines.map(discipline => (
                                            <option key={discipline.discipline_id}
                                                    value={discipline.discipline_id}>{discipline.name}</option>
                                        ))}
                                    </select>
                                    {formErrors.discipline_id &&
                                        <div className="invalid-feedback">{formErrors.discipline_id}</div>}
                                </div>
                                <div className="row w-100 mb-3">
                                    <div className="col">
                                        <label htmlFor="classifier" className="form-label">Выберите
                                            классификатор:</label>
                                        <select
                                            id="classifier"
                                            className={`form-select ${formErrors.classifier_id && 'is-invalid'}`}

                                            required
                                            onChange={(e) => {
                                                setFormClassifierId(e.target.value);
                                                updateEducationModules(e.target.value);
                                            }}
                                        >
                                            <option value="">-- Выберите классификатор --</option>
                                            {classifiers.map(classifier => (
                                                <option key={classifier.classifier_id}
                                                        value={classifier.classifier_id}>{classifier.name}</option>
                                            ))}
                                        </select>
                                        {formErrors.classifier_id &&
                                            <div className="invalid-feedback">{formErrors.classifier_id}</div>}
                                    </div>
                                    <div className="col">
                                        <label htmlFor="module" className="form-label">Выберите модуль:</label>
                                        <select
                                            id="module"
                                            className={`form-select ${formErrors.module_id && 'is-invalid'}`}

                                            required
                                            onChange={(e) => setFormModuleId(e.target.value)}
                                        >
                                            <option value="">-- Выберите модуль --</option>
                                            {modules.map(modules => (
                                                <option key={modules.module_id}
                                                        value={modules.module_id}>{modules.description}</option>
                                            ))}
                                        </select>
                                        {formErrors.module_id &&
                                            <div className="invalid-feedback">{formErrors.module_id}</div>}
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col">
                                        <label htmlFor="typeClass" className="form-label mb-2">Выберите тип
                                            проверки:</label><br/>
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="radio" name="verificationType"
                                                   id="auto"
                                                   value="auto"
                                                   onChange={(e) => setFromVerificationType(e.target.value)}
                                                   checked={formVerificationType === 'auto'}
                                            />
                                            <label className="form-check-label me-4"
                                                   htmlFor="auto">автоматическая</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="radio" name="verificationType"
                                                   id="manual"
                                                   value="manual"
                                                   onChange={(e) => setFromVerificationType(e.target.value)}
                                                   checked={formVerificationType === 'manual'}
                                                   disabled={true}
                                            />
                                            <label className="form-check-label" htmlFor="manual">ручная</label>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <label htmlFor="maxScore" className="form-label mb-2">Выберите максимальный
                                            балл:</label><br/>
                                        <select
                                            id="maxScore"
                                            className={`form-select ${formErrors.module_id && 'is-invalid'}`}

                                            required
                                            onChange={(e) => setFormMaxScore(e.target.value)}
                                        >
                                            <option value="">-- Выберите максимальный балл --</option>
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(score => (
                                                <option key={score} value={score}>{score}</option>
                                            ))}
                                        </select>
                                        {formErrors.max_score &&
                                            <div className="invalid-feedback">{formErrors.max_score}</div>}
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Введите название задания:</label>
                                    <input
                                        type="text"
                                        className={`form-control ${formErrors.name && 'is-invalid'}`}
                                        onChange={(e) => setFormName(e.target.value)}
                                    />
                                    {formErrors.name &&
                                        <div className="invalid-feedback">{formErrors.name}</div>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Введите условия задачи:</label>
                                    <textarea id="description"
                                              rows="4"
                                              className={`form-control ${formErrors.description && 'is-invalid'}`}
                                              onChange={(e) => setFormDescription(e.target.value)}
                                    ></textarea>
                                    {formErrors.description &&
                                        <div className="invalid-feedback">{formErrors.description}</div>}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Введите правильный ответ:</label>
                                    <input
                                        type="text"
                                        className={`form-control ${formErrors.right_answer && 'is-invalid'}`}
                                        onChange={(e) => setFormRightAnswer(e.target.value)}
                                    />
                                    {formErrors.right_answer &&
                                        <div className="invalid-feedback">{formErrors.right_answer}</div>}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <ButtonHeaderVisibility
                                    buttonText="Отмена"
                                    onClick={() => setShowCreateModal(false)}/>
                                <ButtonHeader
                                    buttonText="Создать задание"
                                    onClick={() => handleCreateExercise()}/>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </main>
    );
}