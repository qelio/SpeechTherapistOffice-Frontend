import styles from './ProfilePage.module.css';
import userAv from "../../assets/profile/user.png";

function ProfilePage() {
    return (
        <div className="container">
            <div className="row mb-4">
                <div className="col-md-7">
                    <div className="card p-4 ">
                        <div className="d-flex">
                            <div className="me-4 text-center p-3">
                                <img className="img-logo mb-3" src={userAv} alt="Логотип магазина" width="150" height="150" /><br/>
                                <a href="#" className="small-link ">Изменить фото<br/>профиля</a>
                            </div>
                            <div>
                                <h5 className="mb-3"><strong>Самохвалов Вячеслав Дмитриевич</strong></h5>
                                <p className="mb-1">Email: vyacheslav@samokhvaloff.ru</p>
                                <p className="mb-1">Дата рождения: 28 ноября 2004 года (20 лет)</p>
                                <p className="mb-1">Пол: Мужской</p>
                                <p className="mb-1">Город: Челябинск</p>
                                <p className="mb-1">Номер телефона: +7 (932) 015-40-22</p>
                                <p className="mb-1">Уникальный код: stud-wr9s6df5g</p>
                                <p className="mb-1">Статус: обучающийся</p>
                            </div>
                        </div>
                        <div className="d-flex justify-content-end flex-column align-items-end mt-3">
                            <a href="#" className="small-link">Редактировать профиль</a>
                            <a href="#" className="small-link">Изменить пароль</a>
                        </div>
                    </div>
                </div>

                <div className="col-md-5">
                    <div className="card p-3">
                        <div className="section-title">Мои домашние задания</div>
                        <div className="mb-3 p-2 border rounded">
                            <strong>Вводное тестирование №1</strong><br/>
                            Статус: <em>не решено</em><br/>
                            Срок выполнения: 19.11.2024 03:00 – 20.11.2024 04:00<br/>
                            Оценка: <strong>–</strong>
                        </div>
                        <div className="mb-3 p-2 border rounded">
                            <strong>Вводное тестирование №2</strong><br/>
                            Статус: <em>решено</em><br/>
                            Срок выполнения: 19.11.2024 03:00 – 20.11.2024 04:00<br/>
                            Оценка: <strong>5</strong>
                        </div>
                        <button className="btn btn-dark w-100">Показать все</button>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-6 mb-4">
                    <div className="card p-3">
                        <div className="section-title">Мои абонементы</div>
                        <div className="p-3 bg-light border rounded">
                            <strong>Абонемент №434 (актуален)</strong><br/>
                            Создатель: Нагорная Елена Александровна<br/>
                            Срок действия: 19.11.2024 03:00 – 20.11.2024 04:00<br/>
                            <div className="mt-2">Всего занятий: <strong>10</strong></div>
                            Осталось занятий: <strong>5</strong>
                        </div>
                        <button className="btn btn-dark w-100 mt-3">Показать все</button>
                    </div>
                </div>

                <div className="col-md-6 mb-4">
                    <div className="card p-3">
                        <div className="section-title">Ближайшие занятия</div>
                        <div className="p-2 border rounded mb-2">
                            <strong>13:30 06.11.2024</strong><br/>
                            Логопедическое занятие<br/>
                            Адрес: Комсомольский проспект, 74<br/>
                            Кабинет: 003 (дверь справа от входа)<br/>
                            Преподаватель: Нагорная Е.А.
                        </div>
                        <div className="p-2 border rounded mb-2">
                            <strong>13:30 06.11.2024</strong><br/>
                            Логопедическое занятие<br/>
                            Адрес: Комсомольский проспект, 74<br/>
                            Кабинет: 003 (дверь справа от входа)<br/>
                            Преподаватель: Нагорная Е.А.
                        </div>
                        <button className="btn btn-dark w-100">Показать все</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;