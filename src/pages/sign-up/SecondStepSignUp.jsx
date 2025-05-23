import styles from './SignUpPage.module.css';
import ButtonFullWidth from "../../components/buttons/button-full-width/ButtonFullWidth";
import {useState} from "react";
import {validatePhoneNumber} from "../../utils/validation";

function SecondStepSignUp( {roleUser}) {
    const [errors, setErrors] = useState({});

    const [city, setCity] = useState("");
    const [phone, setPhone] = useState("");
    const [school, setSchool] = useState("");
    const [work, setWork] = useState("");
    const [workPhone, setWorkPhone] = useState("");

    const finalForm = () => {
        const newErrors = {};
        if (!validatePhoneNumber(phone)) newErrors.phone = "Введите корректный номер телефона.";
        if (!city) newErrors.city = "Введите корректное название города."
        if (roleUser === "parent") {
            if (workPhone) {
                if (!validatePhoneNumber(workPhone)) newErrors.workPhone = "Введите корректный рабочий номер телефона.";
            }
        }
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            alert('Можно приступать к регистрации!');
        }
    }

    return (
        <div className={styles.RegisterForm}>
            <h1>Укажите контактные данные</h1>
            <p>Вы можете создать учетную запись, если еще не зарегистрировались.<br />Поля со * обязательны для заполенения!</p>

            <form>
                <label>Город проживания*</label>
                <input
                    type="text"
                    placeholder="Введите название города…"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                />
                {errors.city && <div className={styles.Error}>{errors.city}</div>}

                <label>Контактный номер телефона*</label>
                <input
                    type="tel"
                    placeholder="+7 (999) 999-99-99"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                />
                {errors.phone && <div className={styles.Error}>{errors.phone}</div>}

                {roleUser === 'parent' && (
                    <>
                        <label>Рабочий номер телефона</label>
                        <input
                            type="tel"
                            placeholder="+7 (999) 999-99-99"
                            value={workPhone}
                            onChange={e => setWorkPhone(e.target.value)}
                        />
                        {errors.workPhone && <div className={styles.Error}>{errors.workPhone}</div>}

                        <label>Место работы</label>
                        <input
                            type="text"
                            placeholder="Московский политехнический университет"
                            value={work}
                            onChange={e => setWork(e.target.value)}
                        />
                    </>
                )}

                {roleUser === 'student' && (
                    <>
                        <label>Место учебы</label>
                        <input
                            type="text"
                            placeholder="МАОУ &quot;СОШ №13 г. Челябинска&quot;"
                            value={school}
                            onChange={e => setSchool(e.target.value)}
                        />
                    </>
                )}
                <div onClick={finalForm}>
                    <ButtonFullWidth buttonText="Завершить регистрацию"/>
                </div>
            </form>
        </div>
    );
}

export default SecondStepSignUp;