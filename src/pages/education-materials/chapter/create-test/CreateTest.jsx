import styles from './CreateTest.module.css';
import {useEffect, useState} from "react";
import {getTeacherDisciplines} from "../../../../api/education-materials/getTeacherDisciplines";
import ButtonFullWidth from "../../../../components/buttons/button-full-width/ButtonFullWidth";
import {createTest} from "../../../../api/tests/createTest";
import {getExercisesByTest} from "../../../../api/tests/getExercisesByTest";
import {getExercisesByDisciplineId} from "../../../../api/tests/getExercisesByDisciplineId";
import {addExerciseToTest} from "../../../../api/tests/addExerciseToTest";
import {deleteExerciseFromTest} from "../../../../api/tests/deleteExerciseFromTest";

export default function CreateTest( {showNotification, setChapter} ) {

    // Набор состояний для формы создания нового теста
    const [formErrors, setFormErrors] = useState([]);
    const [formDisciplineId, setFormDisciplineId] = useState(null);
    const [formComplexity, setFormComplexity] = useState("easy");
    const [formName, setFormName] = useState(null);
    const [formDescription, setFormDescription] = useState(null);
    const [disciplines, setDisciplines] = useState([]);
    const [stage, setStage] = useState(1);
    const [testId, setTestId] = useState(null);

    const [exercises, setExercises] = useState([]);
    const [addedExercises, setAddedExercises] = useState([]);


    function handleAddExerciseToTest(exercise_id) {
        addExerciseToTest(testId, exercise_id).then(async (response) => {
            const data = await response.json();
            if (response.ok) {
                showNotification(`Задание успешно добавлено к тесту!`, 3000, 'success');
                fetchAddedExercises(testId);
            } else {
                showNotification(`Ошибка при добавлении задания к тесту: ${data.message}`, 3000, 'error');
            }
        });
    }

    function handleDeleteExerciseToTest(exercise_id) {
        deleteExerciseFromTest(testId, exercise_id).then(async (response) => {
            const data = await response.json();
            if (response.ok) {
                showNotification(`Задание успешно удалено из теста!`, 3000, 'success');
                fetchAddedExercises(testId);
            } else {
                showNotification(`Ошибка при добавлении задания к тесту: ${data.message}`, 3000, 'error');
            }
        });
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


    function fetchAddedExercises(test_id) {
        getExercisesByTest(test_id).then(async (response) => {
            const data = await response.json();
            if (response.ok) {
                setAddedExercises(data);
                fetchAllExercises(formDisciplineId, data);
            } else {
                showNotification(`Ошибка при получении списка добавленных заданий: ${data.message}`, 3000, 'error');
            }
        });
    }

    function fetchAllExercises(discipline_id, addedExercises) {
        getExercisesByDisciplineId(discipline_id).then(async (response) => {
            const data = await response.json();
            if (response.ok) {
                console.log(data);
                const filteredExercises = data.filter(exercise =>
                    !addedExercises.some(added => added.exercise_id === exercise.exercise_id)
                );
                setExercises(filteredExercises);
            } else {
                showNotification(`Ошибка при получении списка заданий: ${data.message}`, 3000, 'error');
            }
        });
    }

    function checkHandleClickNextStage () {
        const newErrors = {
            discipline_id: "",
            name: "",
            description: ""
        };

        let check = true;
        if (!formDisciplineId) {
            newErrors.discipline_id = "Пожалуйста, выберите дисциплину";
            check = false;
        }
        if (!formName) {
            newErrors.name = "Пожалуйста, укажите название тестирования";
            check = false;
        }
        if (!formDescription) {
            newErrors.description = "Пожалуйста, укажите описание тестирования";
            check = false;
        }
        setFormErrors(newErrors);
        return check;
    }

    function handleClickNextStage() {
        if (checkHandleClickNextStage()){
            createTest({
                name: formName,
                complexity: formComplexity,
                discipline_id: formDisciplineId,
                description: formDescription}).then(async (response) => {
                const data = await response.json();
                if (response.ok) {
                    setTestId(data.test_id);
                    showNotification(`Тестирование успешно создано!`, 3000, 'success');
                    setStage(2);
                    fetchAddedExercises(data.test_id);
                } else {
                    showNotification(`Ошибка при создании тестирования: ${data.message}`, 3000, 'error');
                }
            });
        }
    }

    function fetchDisciplines() {
        getTeacherDisciplines().then(async (response) => {
            const data = await response.json();
            if (response.ok) {
                setDisciplines(data);
            } else {
                showNotification(`Ошибка при получении списка дисциплин: ${data.message}`, 3000, 'error');
            }
        });
    }

    useEffect(() => {
        fetchDisciplines();
    }, []);


    return (
        <main className="col-lg-9 pt-3 ps-5">
            <h1>Создание нового тестирования</h1>
            <p className="mb-4">Укажите все необходимые параметры для создания нового тестирования.</p>
            {stage === 1 && (
                <>
                    <p className="fw-bold">Основные параметры тестирования</p>
                    <hr/>
                    <div className="row mb-4">
                        <div className="col">
                            <label htmlFor="discipline" className="form-label">Выберите дисциплину:</label>
                            <select
                                id="discipline"
                                className={`form-select ${formErrors.discipline_id && 'is-invalid'}`}

                                required
                                onChange={(e) => {
                                    setFormDisciplineId(e.target.value);
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
                        <div className="col">
                            <label htmlFor="typeClass" className="form-label mb-2">Выберите сложность:</label><br/>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="formComplexity"
                                       id="easy"
                                       value="easy"
                                       onChange={(e) => setFormComplexity(e.target.value)}
                                       checked={formComplexity === 'easy'}
                                />
                                <label className="form-check-label me-4"
                                       htmlFor="easy">легкая</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="formComplexity"
                                       id="medium"
                                       value="medium"
                                       onChange={(e) => setFormComplexity(e.target.value)}
                                       checked={formComplexity === 'medium'}
                                />
                                <label className="form-check-label me-4" htmlFor="medium">средняя</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="formComplexity"
                                       id="difficult"
                                       value="difficult"
                                       onChange={(e) => setFormComplexity(e.target.value)}
                                       checked={formComplexity === 'difficult'}
                                />
                                <label className="form-check-label" htmlFor="difficult">сложная</label>
                            </div>
                        </div>
                    </div>
                    <p className="fw-bold">Наименование тестирования</p>
                    <hr/>
                    <div className="mb-3">
                        <label className="form-label">Введите название тестирования:</label>
                        <input
                            type="text"
                            className={`form-control ${formErrors.name && 'is-invalid'}`}
                            onChange={(e) => setFormName(e.target.value)}
                        />
                        {formErrors.name &&
                            <div className="invalid-feedback">{formErrors.name}</div>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="form-label">Введите описание тестирования:</label>
                        <textarea id="description"
                                  rows="4"
                                  className={`form-control ${formErrors.description && 'is-invalid'}`}
                                  onChange={(e) => setFormDescription(e.target.value)}
                        ></textarea>
                        {formErrors.description &&
                            <div className="invalid-feedback">{formErrors.description}</div>}
                    </div>
                    <div className="mb-3">
                        <ButtonFullWidth buttonText="Перейти к добавлению заданий" onClick={handleClickNextStage}/>
                    </div>
                </>
            )}
            {stage === 2 && (
                <>
                    <p className="fw-bold">Добавленные задания</p>
                    <hr/>
                    {addedExercises.length === 0 && (
                        <p className="text-center mt-3">В тесте пока нет заданий</p>
                    )}
                    {addedExercises.map((exercise) => (
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
                                <div className="d-flex justify-content-end">
                                    <button type="button"
                                            className="btn btn-outline-danger me-2"
                                            onClick={() => handleDeleteExerciseToTest(exercise.exercise_id)}
                                    >Удалить из теста</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    <p className="fw-bold">Добавить задание</p>
                    <hr/>
                    {exercises.length === 0 && (
                        <p className="text-center mt-3">Заданий по данной дисциплине больше нет</p>
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
                                <div className="d-flex justify-content-end">
                                    <button type="button"
                                            className="btn btn-outline-success me-2"
                                            onClick={() => handleAddExerciseToTest(exercise.exercise_id)}
                                    >Добавить к тесту</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="mb-3">
                        <ButtonFullWidth buttonText="Сохранить тест" onClick={() => {
                            setChapter(5);
                        }}/>
                    </div>
                </>
            )}

        </main>
    );
}