import styles from './CreateNewClass.module.css';

export default function CreateNewClass( {showNotification} ) {

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
                            className={`form-select`}
                            required
                        >
                        <option value="">-- Выберите дисциплину --</option>
                        {[2, 3, 4, 5, 6, 7, 8].map(num => (
                            <option key={num} value={num}>{num} занятий</option>
                        ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="typeClass" className="form-label mb-2">Выберите тип занятия:</label><br/>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="typeClass" id="face-to-face"
                                   value="face-to-face"/>
                            <label className="form-check-label me-4" htmlFor="face-to-face">Очное занятие</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="typeClass" id="online"
                                   value="online"/>
                            <label className="form-check-label" htmlFor="online">Дистанционное занятие</label>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label htmlFor="online_url" class="form-label">Укажите ссылку на онлайн-занятие:</label>
                        <input type="text" class="form-control" id="online_url"
                               placeholder="https://meet.google.com/exj-pzro-gcw"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="branch" className="form-label">Выберите место проведения занятия:</label>
                        <select
                            id="branch"
                            className={`form-select`}
                            required
                        >
                            <option value="">-- Выберите место проведения занятия --</option>
                            {[2, 3, 4, 5, 6, 7, 8].map(num => (
                                <option key={num} value={num}>{num} занятий</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="classroom" className="form-label">Выберите аудиторию:</label>
                        <select
                            id="classroom"
                            className={`form-select`}
                            required
                        >
                            <option value="">-- Выберите аудиторию --</option>
                            {[2, 3, 4, 5, 6, 7, 8].map(num => (
                                <option key={num} value={num}>{num} занятий</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="student" className="form-label">Выберите обучающегося:</label>
                        <select
                            id="student"
                            className={`form-select`}
                            required
                        >
                            <option value="">-- Выберите обучающегося --</option>
                            {[2, 3, 4, 5, 6, 7, 8].map(num => (
                                <option key={num} value={num}>{num} занятий</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="subscription" className="form-label">Выберите абонемент обучающегося:</label>
                        <select
                            id="subscription"
                            className={`form-select`}
                            required
                        >
                            <option value="">-- Выберите абонемент обучающегося --</option>
                            {[2, 3, 4, 5, 6, 7, 8].map(num => (
                                <option key={num} value={num}>{num} занятий</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <div className="card">
                <div className="card-header">
                    <b>Настройка параметров времени проведения</b>
                </div>
                <div className="card-body">
                    <div className="mb-3">
                        <label htmlFor="typeTimeClass" className="form-label mb-2">Выберите тип занятия:</label><br/>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="typeTimeClass" id="single"
                                   value="single"/>
                            <label className="form-check-label me-4" htmlFor="single">Одиночное</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="typeTimeClass" id="regular"
                                   value="regular"/>
                            <label className="form-check-label" htmlFor="regular">Регулярное</label>
                        </div>
                    </div>
                    <div className="mb-3">
                        <div className="row">
                            <div className="col">
                                <label className="form-label">Укажите дату проведения:</label>
                                <input
                                    type="date"
                                    className={`form-control`}
                                />
                            </div>
                            <div className="col">
                                <label className="form-label">Время начала:</label>
                                <input
                                    type="time"
                                    className={`form-control`}
                                />
                            </div>
                            <div className="col">
                                <label className="form-label">Время окончания:</label>
                                <input
                                    type="time"
                                    className={`form-control`}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mb-3">
                        <p className="text-secondary">Продолжительность занятия: 0 минут</p>
                    </div>
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
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="monday" id="monday"/>
                                    <label class="form-check-label" htmlFor="monday">
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
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="tuesday" id="tuesday"/>
                                    <label class="form-check-label" htmlFor="tuesday">
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
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="wednesday" id="wednesday"/>
                                    <label class="form-check-label" htmlFor="wednesday">
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
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="thursday" id="thursday"/>
                                    <label class="form-check-label" htmlFor="thursday">
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
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="friday" id="friday"/>
                                    <label class="form-check-label" htmlFor="friday">
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
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="saturday" id="saturday"/>
                                    <label class="form-check-label" htmlFor="saturday">
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
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="sunday" id="sunday"/>
                                    <label class="form-check-label" htmlFor="sunday">
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
                </div>
            </div>
        </main>
    );
}