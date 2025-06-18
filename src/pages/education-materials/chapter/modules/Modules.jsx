import styles from './Modules.module.css';
import {useEffect, useState} from "react";
import disciplineImg from "../../../../assets/logo/university-college.jpg";
import {getEducationModules} from "../../../../api/education-materials/getEducationModules";
import ButtonHeader from "../../../../components/buttons/button-header/ButtonHeader";
import {deleteModule} from "../../../../api/education-materials/deleteModule";
import ButtonHeaderVisibility from "../../../../components/buttons/button-header-visibility/ButtonHeaderVisibility";
import {getTeacherDisciplines} from "../../../../api/schedule/getTeacherDisciplines";
import {getClassifiersByDiscipline} from "../../../../api/education-materials/getClassifiersByDiscipline";
import {createModule} from "../../../../api/education-materials/createModule";

export default function Modules( {showNotification} ) {

    const [educationModules, setEducationModules] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [formErrors, setFormErrors] = useState([]);

    // Набор состояний для модального окна создания
    const [disciplines, setDisciplines] = useState([]);
    const [formDisciplineId, setFormDisciplineId] = useState(null);
    const [classifiers, setClassifiers] = useState([]);
    const [formClassifierId, setFormClassifierId] = useState(null);
    const [formDescription, setFormDescription] = useState(null);


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

    function checkHandleCreateModal() {
        const newErrors = {
            discipline_id: "",
            classifier_id: "",
            description: ""
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
        if (!formDescription) {
            newErrors.description = "Пожалуйста, введите название";
            check = false;
        }

        setFormErrors(newErrors);
        return check;
    }

    function handleCreateModal() {
        if (checkHandleCreateModal()) {
            createModule({
                description: formDescription,
                classifier_id: formClassifierId })
                .then(async (response) => {
                    const data = await response.json();
                    if (response.ok) {
                        updateEducationModules();
                        showNotification(`Образовательный модуль успешно создан!`, 3000, 'success');
                        setShowCreateModal(false);
                    } else {
                        showNotification(`Ошибка при создании модуля: ${data.message}`, 3000, 'error');
                    }
            });
        }
    }

    function handleDeleteModule(module_id) {
        deleteModule(module_id).then(async (response) => {
            const data = await response.json();
            if (response.ok) {
                updateEducationModules();
                showNotification(`Образовательный модуль успешно удален!`, 3000, 'success');
            } else {
                showNotification(`Ошибка при удалении модуля: ${data.message}`, 3000, 'error');
            }
        })
    }

    function updateEducationModules() {
        getEducationModules().then(async (response) => {
            const data = await response.json();
            if (response.ok) {
                setEducationModules(data);
            } else {
                showNotification(`Ошибка при получении списка классификаторов: ${data.message}`, 3000, 'error');
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

    useEffect(() => {
        updateEducationModules();
        getTeacherDisciplines().then(async (response) => {
            const data = await response.json();
            if (response.ok) {
                setDisciplines(data);
            } else {
                showNotification(`Ошибка получения списка дисциплин: ${data.message}`, 3000, 'error');
            }
        });
    }, []);

    return (
        <main className="col-lg-9 pt-3 ps-5">
            <h1>Образовательные модули</h1>
            <p className="mb-4">Вы можете создать собственный образовательный модуль.</p>
            {educationModules.map((educationModule) => (
                <div className="card mb-3">
                    <div className="row g-0">
                        <div className="col-md-3">
                            <img src={disciplineImg} className="img-fluid rounded-start" alt="..."/>
                        </div>
                        <div className="col-md-9">
                            <div className="card-body">
                                <div className="d-flex justify-content-between">
                                    <h5 className="card-title">{educationModule.description}</h5>
                                    {educationModule.to_edit === '1' && (
                                        <button type="button"
                                                className="btn btn-outline-danger"
                                                onClick={() => handleDeleteModule(educationModule.module_id)}
                                        >Удалить</button>
                                    )}
                                </div>
                                <p className="card-text text-muted">Дисциплина: {educationModule.discipline_name}<br/>Классификатор: {educationModule.classifier_name}</p>
                                <p className="card-text"><small className="text-muted">Последнее обновление: {formatDate(educationModule.created_at)}, 👤{educationModule.teacher_full_name}</small></p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            <div className="d-flex justify-content-end">
                <ButtonHeader buttonText="Добавить новый модуль" onClick={() => {setShowCreateModal(true)}}/>
            </div><br/>

            {showCreateModal &&
                <div className="modal fade show d-block" id="passwordModal" tabIndex="-1" aria-labelledby="passwordModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="passwordModalLabel">Создание нового образовательного модуля</h5>
                                <button type="button"
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                        onClick={() => setShowCreateModal(false)}></button>
                            </div>
                            <div className="modal-body d-flex justify-content-center align-items-center">
                                <div className="row w-100">
                                    <div className="col">
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
                                                <option key={discipline.discipline_id} value={discipline.discipline_id}>{discipline.name}</option>
                                            ))}
                                        </select>
                                        {formErrors.discipline_id && <div className="invalid-feedback">{formErrors.discipline_id}</div>}
                                    </div>
                                    <div className="col mb-3">
                                        <label htmlFor="classifier" className="form-label">Выберите классификатор:</label>
                                        <select
                                            id="classifier"
                                            className={`form-select ${formErrors.classifier_id && 'is-invalid'}`}

                                            required
                                            onChange={(e) => setFormClassifierId(e.target.value)}
                                        >
                                            <option value="">-- Выберите классификатор --</option>
                                            {classifiers.map(classifier => (
                                                <option key={classifier.classifier_id} value={classifier.classifier_id}>{classifier.name}</option>
                                            ))}
                                        </select>
                                        {formErrors.classifier_id && <div className="invalid-feedback">{formErrors.classifier_id}</div>}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Введите название образовательного модуля</label>
                                        <input
                                            type="text"
                                            className={`form-control ${formErrors.description && 'is-invalid'}`}
                                            onChange={(e) => setFormDescription(e.target.value)}
                                        />
                                        {formErrors.description && <div className="invalid-feedback">{formErrors.description}</div>}
                                    </div>
                                </div>

                            </div>
                            <div className="modal-footer">
                                <ButtonHeaderVisibility
                                    buttonText="Отмена"
                                    onClick={() => setShowCreateModal(false)}/>
                                <ButtonHeader
                                    buttonText="Создать модуль"
                                    onClick={() => handleCreateModal()}/>
                            </div>
                        </div>
                    </div>
                </div>
            }

        </main>
    );
}