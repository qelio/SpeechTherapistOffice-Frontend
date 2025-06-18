import styles from './CreateNewClass.module.css';
import {useEffect, useState} from "react";
import {authFlow} from "../../../../api/auth/authFlow";
import {getTeacherDisciplines} from "../../../../api/schedule/getTeacherDisciplines";
import {getStudentsForTeacher} from "../../../../api/teaching/getStudentsForTeacher";
import {getStudentSubscriptions} from "../../../../api/schedule/getStudentSubscriptions";
import {getBranches} from "../../../../api/schedule/getBranches";
import {getClassrooms} from "../../../../api/schedule/getClassrooms";
import ButtonHeader from "../../../../components/buttons/button-header/ButtonHeader";
import {getSubscriptionById} from "../../../../api/schedule/getSubscriptionById";
import {createLesson} from "../../../../api/schedule/createLesson";

export default function CreateNewClass( {showNotification, onSuccessCreate} ) {

    // Состояния для выбора формы
    const [formStudentId, setFormStudentId] = useState(null);
    const [formStudentSubscriptions, setFormStudentSubscriptions] = useState([]);
    const [formTypeClass, setFormTypeClass] = useState('face-to-face');
    const [formBranchId, setFormBranchId] = useState(null);
    const [formBranches, setFormBranches] = useState([]);
    const [formClassrooms, setFormClassrooms] = useState([]);
    const [formClassroomId, setFormClassroomId] = useState(null);
    const [formDisciplineId, setFormDisciplineId] = useState(null);
    const [formOnlineUrl, setFormOnlineUrl] = useState(null);
    const [formSubscriptionId, setFormSubscriptionId] = useState(null);
    const [formTypeTimeClass, setFormTypeTimeClass] = useState('single');
    const [formDateClass, setFormDateClass] = useState(null);
    const [formTimeStartClass, setFormTimeStartClass] = useState(null);
    const [formTimeEndClass, setFormTimeEndClass] = useState(null);
    const [formDurationClass, setFormDurationClass] = useState(0);

    // Состояние для ошибок формы
    const [formErrors, setFormErrors] = useState({
        discipline_id: '',
        type_class: '',
        branch_id: '',
        classroom_id: '',
        online_url: '',
        student_id: '',
        subscription_id: '',
        type_time_class: '',
        date_class: '',
        time_start_class: '',
        time_end_class: ''
    });

    const [disciplines, setDisciplines] = useState([]);
    const [students, setStudents] = useState([]);

    // Состояния для сведений об абонементе
    const [infoTotalLessons, setInfoTotalLessons] = useState(null);
    const [infoRemainingLessons, setInfoRemainingLessons] = useState(null);
    const [infoRemainingLessonsWithoutCurrent, setInfoRemainingLessonsWithoutCurrent] = useState(null);

    function checkHandleCreateSubscription() {
        const newErrors = {
            discipline_id: '',
            type_class: '',
            branch_id: '',
            classroom_id: '',
            online_url: '',
            student_id: '',
            subscription_id: '',
            type_time_class: '',
            date_class: '',
            time_start_class: '',
            time_end_class: ''
        }
        let isCreateSubscription = true;
        if (!formDisciplineId) {
            newErrors.discipline_id = 'Пожалуйста, выберите дисциплину';
            isCreateSubscription = false;
        }
        if (!formStudentId) {
            newErrors.student_id = 'Пожалуйста, выберите студента';
            isCreateSubscription = false;
        }
        if (!formSubscriptionId) {
            newErrors.subscription_id = 'Пожалуйста, выберите абонемент';
            isCreateSubscription = false;
        }
        if (formTypeClass === 'face-to-face') {
            if (!formBranchId) {
                newErrors.branch_id = 'Пожалуйста, выберите место проведения';
                isCreateSubscription = false;
            }
            if (!formClassroomId) {
                newErrors.classroom_id = 'Пожалуйста, выберите аудиторию';
                isCreateSubscription = false;
            }
        } else if (formTypeClass === 'online') {
            if (!formOnlineUrl) {
                newErrors.online_url = 'Пожалуйста, укажите ссылку на онлайн занятие';
                isCreateSubscription = false;
            }
        }

        if (formTypeTimeClass === 'single') {
            if (!formTimeStartClass) {
                newErrors.time_start_class = 'Пожалуйста, укажите время начала занятия';
                isCreateSubscription = false;
            }
            if (!formTimeEndClass) {
                newErrors.time_end_class = 'Пожалуйста, укажите время окончания занятия';
                isCreateSubscription = false;
            }
            if (!formDateClass) {
                newErrors.date_class = 'Пожалуйста, укажите дату проведения занятия';
                isCreateSubscription = false;
            }
        }

        setFormErrors(newErrors);
        return isCreateSubscription;
    }

    function handleCreateSubscription() {
        if (checkHandleCreateSubscription()) {
            if (infoRemainingLessons !== 0) {
                const lessonData = {
                    lesson_date_time: `${formDateClass}T${formTimeStartClass}`,
                    duration: formDurationClass,
                    status: `scheduled`,
                    student_id: formStudentId,
                    subscription_id: formSubscriptionId,
                    discipline_id: formDisciplineId
                }
                if (formTypeClass === 'face-to-face') {
                    lessonData.classroom_id = formClassroomId;
                } else if (formTypeClass === 'online') {
                    lessonData.online_call_url = formOnlineUrl;
                }

                createLesson(lessonData).then(async (response) => {
                    const data = await response.json();
                    if (response.ok) {
                        showNotification(`Новое занятие успешно добавлено!`, 3000, 'success');
                        onSuccessCreate();
                    } else {
                        showNotification(`Ошибка создания нового занятия: ${data.message}`, 3000, 'error');
                    }
                });
            } else {
                showNotification(`В рамках данного абонемента больше нельзя создавать занятия`, 3000, 'error');
            }
        }
    }

    useEffect(() => {
        if (formSubscriptionId) {
            getSubscriptionById(formSubscriptionId).then(async (response) => {
                const data = await response.json();
                if (response.ok) {
                    setInfoTotalLessons(data.total_lessons);
                    setInfoRemainingLessons(data.total_lessons - data.lessons.length);
                    setInfoRemainingLessonsWithoutCurrent(data.total_lessons - data.lessons.length - 1);
                } else {
                    showNotification(`Ошибка получения доп. сведений об абонементе: ${data.message}`, 3000, 'error');
                }
            });
        }
    }, [formSubscriptionId]);


    useEffect(() => {
        if (formTimeStartClass && formTimeEndClass) {
            const [hoursStart, minutesStart] = formTimeStartClass.split(':').map(Number);
            const [hoursEnd, minutesEnd] = formTimeEndClass.split(':').map(Number);

            const dateStart = new Date(2025, 0, 1, hoursStart, minutesStart);
            const dateEnd = new Date(2025, 0, 1, hoursEnd, minutesEnd);

            const diffMs = dateEnd - dateStart;
            const diffMinutes = Math.round(diffMs / (1000 * 60));

            setFormDurationClass(diffMinutes);
        }
    }, [formTimeStartClass, formTimeEndClass]);


    function updateClassrooms(branchId) {
        if (branchId) {
            getClassrooms(branchId).then(async (response) => {
                const data = await response.json();
                if (response.ok) {
                    console.log(data);
                    setFormClassrooms(data);
                } else {
                    showNotification(`Ошибка получения аудиторий для выбранного офиса: ${data.message}`, 3000, 'error');
                }
            })
        } else {
            setFormClassroomId(null);
            setFormClassrooms([]);
        }
    }

    function updateStudentSubscriptions(studentId) {
        if (studentId) {
            getStudentSubscriptions(studentId).then(async (response) => {
                const data = await response.json();
                if (response.ok) {
                    setFormStudentSubscriptions(data);
                } else {
                    showNotification(`Ошибка получения абонементов для выбранного студента: ${data.message}`, 3000, 'error');
                }
            });
        } else {
            setFormStudentSubscriptions([]);
            setFormStudentId(null);
            setFormSubscriptionId(null);
        }
    }

    useEffect(() => {
        getTeacherDisciplines().then(async (response) => {
            const data = await response.json();
            if (response.ok) {
                setDisciplines(data);
            } else {
                showNotification(`Ошибка получения списка дисциплин: ${data.message}`, 3000, 'error');
            }
        });
        getStudentsForTeacher().then(async (response) => {
            const data = await response.json();
            if (response.ok) {
                setStudents(data);
            } else {
                showNotification(`Ошибка получения списка студентов: ${data.message}`, 3000, 'error');
            }
        });
        getBranches().then(async (response) => {
            const data = await response.json();
            if (response.ok) {
                setFormBranches(data);
            } else {
                showNotification(`Ошибка получения списка офисов: ${data.message}`, 3000, 'error');
            }
        });

    }, []);

    return (
        <main className="col-lg-9 pt-3 ps-5 mb-5">
            <h1>Создание нового занятия</h1>
            <p>В данном разделе вы можете создавать новые новые занятия.</p>
            <div className="card mb-3">
                <div className="card-header">
                    <b>Основные параметры занятия</b>
                </div>
                <div className="card-body">
                    <div className="mb-3">
                        <label htmlFor="discipline" className="form-label">Выберите дисциплину:</label>
                        <select
                            id="discipline"
                            className={`form-select ${formErrors.discipline_id && 'is-invalid'}`}

                            required
                            onChange={(e) => setFormDisciplineId(e.target.value)}
                        >
                        <option value="">-- Выберите дисциплину --</option>
                        {disciplines.map(discipline => (
                            <option key={discipline.discipline_id} value={discipline.discipline_id}>{discipline.name}</option>
                        ))}
                        </select>
                        {formErrors.discipline_id && <div className="invalid-feedback">{formErrors.discipline_id}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="typeClass" className="form-label mb-2">Выберите тип занятия:</label><br/>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="typeClass" id="face-to-face"
                                   value="face-to-face"
                                   onChange={(e) => {setFormTypeClass(e.target.value)}}
                                   checked={formTypeClass === 'face-to-face'}
                            />
                            <label className="form-check-label me-4" htmlFor="face-to-face">Очное занятие</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="typeClass" id="online"
                                   value="online"
                                   onChange={(e) => {setFormTypeClass(e.target.value)}}
                                   checked={formTypeClass === 'online'}
                            />
                            <label className="form-check-label" htmlFor="online">Дистанционное занятие</label>
                        </div>
                    </div>
                    {formTypeClass === 'online' && (
                        <div className="mb-3">
                            <label htmlFor="online_url" className="form-label">Укажите ссылку на онлайн-занятие:</label>
                            <input type="text"
                                   className={`form-control ${formErrors.online_url && 'is-invalid'}`}
                                   id="online_url"
                                   placeholder="https://meet.google.com/exj-pzro-gcw"
                                   onChange={(e) => {setFormOnlineUrl(e.target.value)}}
                            />
                            {formErrors.online_url && <div className="invalid-feedback">{formErrors.online_url}</div>}
                        </div>
                    )}
                    {formTypeClass === 'face-to-face' && (
                        <>
                            <div className="mb-3">
                                <label htmlFor="branch" className="form-label">Выберите место проведения занятия:</label>
                                <select
                                    id="branch"
                                    className={`form-select ${formErrors.branch_id && 'is-invalid'}`}
                                    required
                                    onChange={(e) => {
                                        setFormBranchId(e.target.value);
                                        updateClassrooms(e.target.value);
                                    }}
                                >
                                    <option value="">-- Выберите место проведения занятия --</option>
                                    {formBranches.map(branch => (
                                        <option key={branch.branch_id} value={branch.branch_id}>{branch.address}</option>
                                    ))}
                                </select>
                                {formErrors.branch_id && <div className="invalid-feedback">{formErrors.branch_id}</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="classroom" className="form-label">Выберите аудиторию:</label>
                                <select
                                    id="classroom"
                                    className={`form-select ${formErrors.classroom_id && 'is-invalid'}`}
                                    required
                                    onChange={(e) => {setFormClassroomId(e.target.value)}}
                                >
                                    <option value="">-- Выберите аудиторию --</option>
                                    {formClassrooms.map(classroom => (
                                        <option key={classroom.classroom_id} value={classroom.classroom_id}>{classroom.name}</option>
                                    ))}
                                </select>
                                {formErrors.classroom_id && <div className="invalid-feedback">{formErrors.classroom_id}</div>}
                            </div>
                        </>
                    )}
                    <div className="mb-3">
                        <label htmlFor="student" className="form-label">Выберите обучающегося:</label>
                        <select
                            id="student"
                            className={`form-select ${formErrors.student_id && 'is-invalid'}`}
                            required
                            onChange={(e) => {
                                setFormStudentId(e.target.value);
                                updateStudentSubscriptions(e.target.value);
                            }}
                        >
                            <option value="">-- Выберите обучающегося --</option>
                            {students.map(student => (
                                <option key={student.user_id} value={student.user_id}>{student.full_name}</option>
                            ))}
                        </select>
                        {formErrors.student_id && <div className="invalid-feedback">{formErrors.student_id}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="subscription" className="form-label">Выберите абонемент обучающегося:</label>
                        <select
                            id="subscription"
                            className={`form-select ${formErrors.subscription_id && 'is-invalid'}`}
                            required
                            onChange={(e) => {setFormSubscriptionId(e.target.value)}}
                        >
                            <option value="">-- Выберите абонемент обучающегося --</option>
                            {formStudentSubscriptions
                                .filter(subscription => !subscription.in_archive)
                                .map(subscription => (
                                    <option
                                        key={subscription.subscription_id}
                                        value={subscription.subscription_id}
                                    >
                                        Абонемент #{String(subscription.subscription_id).padStart(6, '0')}
                                        ({subscription.start_date} - {subscription.end_date})
                                    </option>
                                ))
                            }
                        </select>
                        {formErrors.subscription_id && <div className="invalid-feedback">{formErrors.subscription_id}</div>}
                    </div>
                    {formSubscriptionId && (
                        <>
                            <hr className="mb-3 mt-4"/>
                            <div className="mb-3">
                                <p className="text-secondary">Сведение об абонементе:<br/>
                                    &nbsp;• всего занятий: {infoTotalLessons}<br/>
                                    &nbsp;• текущее количество оставшихся занятий: {infoRemainingLessons}
                                    {infoRemainingLessonsWithoutCurrent !== -1 && (
                                        <>
                                            <br/>&nbsp;• оставшееся количество занятий после данного: {infoRemainingLessonsWithoutCurrent}
                                        </>
                                    )}</p>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <div className="card mb-3">
                <div className="card-header">
                    <b>Настройка параметров времени проведения</b>
                </div>
                <div className="card-body">
                    <div className="mb-3">
                        <label htmlFor="typeTimeClass" className="form-label mb-2">Выберите тип занятия:</label><br/>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="typeTimeClass" id="single"
                                   value="single"
                                   onChange={(e) => {setFormTypeTimeClass(e.target.value)}}
                                   checked={formTypeTimeClass === 'single'}
                            />
                            <label className="form-check-label me-4" htmlFor="single">Одиночное</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="typeTimeClass" id="regular"
                                   value="regular"
                                   onChange={(e) => {setFormTypeTimeClass(e.target.value)}}
                                   checked={formTypeTimeClass === 'regular'}
                                   disabled
                            />
                            <label className="form-check-label" htmlFor="regular">Регулярное</label>
                        </div>
                    </div>
                    {formTypeTimeClass === 'single' && (
                        <>
                            <div className="mb-3">
                                <div className="row">
                                    <div className="col">
                                        <label className="form-label">Укажите дату проведения:</label>
                                        <input
                                            type="date"
                                            className={`form-control ${formErrors.date_class && 'is-invalid'}`}
                                            onChange={(e) => {setFormDateClass(e.target.value)}}
                                        />
                                        {formErrors.date_class && <div className="invalid-feedback">{formErrors.date_class}</div>}
                                    </div>
                                    <div className="col">
                                        <label className="form-label">Время начала:</label>
                                        <input
                                            type="time"
                                            className={`form-control ${formErrors.time_start_class && 'is-invalid'}`}
                                            onChange={(e) => {setFormTimeStartClass(e.target.value)}}
                                        />
                                        {formErrors.time_start_class && <div className="invalid-feedback">{formErrors.time_start_class}</div>}
                                    </div>
                                    <div className="col">
                                        <label className="form-label">Время окончания:</label>
                                        <input
                                            type="time"
                                            className={`form-control ${formErrors.time_end_class && 'is-invalid'}`}
                                            onChange={(e) => {setFormTimeEndClass(e.target.value)}}
                                        />
                                        {formErrors.time_end_class && <div className="invalid-feedback">{formErrors.time_end_class}</div>}
                                    </div>
                                </div>
                            </div>
                            <div className="mb-3">
                                <p className="text-secondary">Продолжительность занятия: {formDurationClass} минут</p>
                            </div>
                        </>
                    )}
                    {formTypeTimeClass === 'regular' && (
                        <>
                            <div className="mb-4">
                                <label className="form-label">Укажите дату начала регулярных занятий:</label>
                                <input
                                    type="date"
                                    className={`form-control`}
                                />
                            </div>
                            <div className="mb-3">
                                <div className="row d-flex align-items-center mb-2">
                                    <div className="col">
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" value="monday" id="monday"/>
                                            <label className="form-check-label" htmlFor="monday">
                                                Понедельник
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <input
                                            type="time"
                                            className={`form-control`}
                                        />
                                    </div>
                                    <div className="col">
                                        <input
                                            type="time"
                                            className={`form-control`}
                                        />
                                    </div>
                                    <div className="col text-secondary">
                                        0 минут
                                    </div>
                                </div>
                                <div className="row d-flex align-items-center mb-2">
                                    <div className="col">
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" value="tuesday" id="tuesday"/>
                                            <label className="form-check-label" htmlFor="tuesday">
                                                Вторник
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <input
                                            type="time"
                                            className={`form-control`}
                                        />
                                    </div>
                                    <div className="col">
                                        <input
                                            type="time"
                                            className={`form-control`}
                                        />
                                    </div>
                                    <div className="col text-secondary">
                                        0 минут
                                    </div>
                                </div>
                                <div className="row d-flex align-items-center mb-2">
                                    <div className="col">
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" value="wednesday" id="wednesday"/>
                                            <label className="form-check-label" htmlFor="wednesday">
                                                Среда
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <input
                                            type="time"
                                            className={`form-control`}
                                        />
                                    </div>
                                    <div className="col">
                                        <input
                                            type="time"
                                            className={`form-control`}
                                        />
                                    </div>
                                    <div className="col text-secondary">
                                        0 минут
                                    </div>
                                </div>
                                <div className="row d-flex align-items-center mb-2">
                                    <div className="col">
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" value="thursday" id="thursday"/>
                                            <label className="form-check-label" htmlFor="thursday">
                                                Четверг
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <input
                                            type="time"
                                            className={`form-control`}
                                        />
                                    </div>
                                    <div className="col">
                                        <input
                                            type="time"
                                            className={`form-control`}
                                        />
                                    </div>
                                    <div className="col text-secondary">
                                        0 минут
                                    </div>
                                </div>
                                <div className="row d-flex align-items-center mb-2">
                                    <div className="col">
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" value="friday" id="friday"/>
                                            <label className="form-check-label" htmlFor="friday">
                                                Пятница
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <input
                                            type="time"
                                            className={`form-control`}
                                        />
                                    </div>
                                    <div className="col">
                                        <input
                                            type="time"
                                            className={`form-control`}
                                        />
                                    </div>
                                    <div className="col text-secondary">
                                        0 минут
                                    </div>
                                </div>
                                <div className="row d-flex align-items-center mb-2">
                                    <div className="col">
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" value="saturday" id="saturday"/>
                                            <label className="form-check-label" htmlFor="saturday">
                                                Суббота
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <input
                                            type="time"
                                            className={`form-control`}
                                        />
                                    </div>
                                    <div className="col">
                                        <input
                                            type="time"
                                            className={`form-control`}
                                        />
                                    </div>
                                    <div className="col text-secondary">
                                        0 минут
                                    </div>
                                </div>
                                <div className="row d-flex align-items-center mb-2">
                                    <div className="col">
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" value="sunday" id="sunday"/>
                                            <label className="form-check-label" htmlFor="sunday">
                                                Воскресенье
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <input
                                            type="time"
                                            className={`form-control`}
                                        />
                                    </div>
                                    <div className="col">
                                        <input
                                            type="time"
                                            className={`form-control`}
                                        />
                                    </div>
                                    <div className="col text-secondary">
                                        0 минут
                                    </div>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="typeTimeClass" className="form-label mb-2">Выберите тип окончания регулярных занятий:</label><br/>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="typeTimeEndClass" id="for_end_subscription"
                                           value="for_end_subscription"/>
                                    <label className="form-check-label me-4" htmlFor="for_end_subscription">До окончания абонемента</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="typeTimeEndClass" id="for_end_date"
                                           value="for_end_date"/>
                                    <label className="form-check-label" htmlFor="for_end_date">До заданной даты, учитывая окончание абонемента</label>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <div className="d-flex justify-content-end">
                <ButtonHeader buttonText="Создать новое занятие" onClick={handleCreateSubscription}/>
            </div>
        </main>
    );
}