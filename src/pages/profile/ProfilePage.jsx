import styles from './ProfilePage.module.css';
import userAv from "../../assets/profile/user.png";
import {useEffect, useState} from "react";
import {authFlow} from "../../api/auth/authFlow";
import {useNavigate} from "react-router-dom";
import {getSelf} from "../../api/users/getSelf";
import ButtonFullWidth from "../../components/buttons/button-full-width/ButtonFullWidth";

function ProfilePage() {

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [fullName, setFullName] = useState('Самохвалов Вячеслав Дмитриевич');
    const [email, setEmail] = useState('vyacheslav@samokhvaloff.ru');
    const [birthday, setBirthday] = useState('2004-11-28');
    const [gender, setGender] = useState('Male');
    const [city, setCity] = useState('Chelyabinsk');

    const [phoneNumber, setPhoneNumber] = useState('+7 (932) 015-40-22');

    const [uniqueCode, setUniqueCode] = useState('stud-wr9s6df5g');
    const [status, setStatus] = useState('student');

    useEffect(() => {
        const verifyAuth = async () => {
            const userId = await authFlow();
            if (!userId) {
                navigate('/sign-in');
            } else {
                setIsLoading(false);
                getSelf().then(data => {
                    setFullName(data.full_name);
                    setEmail(data.email);
                    setBirthday(data.birthday);
                    setGender(data.gender);
                    setCity(data.city);
                    setPhoneNumber(data.phone_number);
                    setUniqueCode(data.unique_code);
                });
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
            <div className="container-fluid">
                <div className="row mb-4">
                    <div className="col-md-7">
                        <div className="card p-4 rounded-5 h-100">
                            <div className="d-flex">
                                <div className="me-4 text-center p-3 mt-4">
                                    <img className="img-logo mb-3" src={userAv} alt="Логотип магазина" width="150" height="150" /><br/>
                                    <a href="#" className="small-link ">Изменить фото<br/>профиля</a>
                                </div>
                                <div>
                                    <h3 className="mb-3"><strong>{fullName}</strong></h3>
                                    <p className="mb-1"><strong>Email:</strong> {email}</p>
                                    <p className="mb-1"><strong>Дата рождения:</strong> {birthday}</p>
                                    <p className="mb-1"><strong>Пол:</strong> {gender}</p>
                                    <p className="mb-1"><strong>Город:</strong> {city}</p>
                                    <p className="mb-1"><strong>Номер телефона:</strong> {phoneNumber}</p>
                                    <p className="mb-1"><strong>Уникальный код:</strong> {uniqueCode}</p>
                                    <p className="mb-1"><strong>Статус:</strong> обучающийся</p>
                                </div>
                            </div>
                            <div className="d-flex justify-content-end flex-column align-items-end mt-3">
                                <a href="#" className="small-link">Редактировать профиль</a>
                                <a href="#" className="small-link">Изменить пароль</a>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-5">
                        <div className="card p-4 rounded-5 h-100">
                            <h5 className="mb-3"><strong>Мои домашние задания</strong></h5>
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
                            <ButtonFullWidth buttonText="Показать все" />
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-4">
                        <div className="card p-4 rounded-5 h-100">
                            <h5 className="mb-3"><strong>Мои абонементы</strong></h5>
                            <div className="p-3 bg-light border rounded">
                                <strong>Абонемент №434 (актуален)</strong><br/>
                                Создатель: Нагорная Елена Александровна<br/>
                                Срок действия: 19.11.2024 03:00 – 20.11.2024 04:00<br/>
                                <div className="mt-2">Всего занятий: <strong>10</strong></div>
                                Осталось занятий: <strong>5</strong>
                            </div>
                            <ButtonFullWidth buttonText="Показать все" />
                        </div>
                    </div>

                    <div className="col-md-6 mb-4">
                        <div className="card p-4 rounded-5 h-100">
                            <h5 className="mb-3"><strong>Ближайшие занятия</strong></h5>
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
                            <ButtonFullWidth buttonText="Показать все" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;