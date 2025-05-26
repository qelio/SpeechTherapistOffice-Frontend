import styles from './SignUpPage.module.css';
import ButtonFullWidth from "../../components/buttons/button-full-width/ButtonFullWidth";
import {useState} from "react";
import {validatePhoneNumber} from "../../utils/validation";
import {registerUser} from "../../api/register/registerUser";
import {useNavigate} from "react-router-dom";

function SecondStepSignUp( {email, fullName, birthDate, password, selectedRole, selectedGender}) {
    const navigate = useNavigate();

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
        if (selectedRole === "parent") {
            if (workPhone) {
                if (!validatePhoneNumber(workPhone)) newErrors.workPhone = "Введите корректный рабочий номер телефона.";
            }
        }
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            if (selectedRole === "parent") {
                let data = {email, fullName, birthDate, password, selectedRole, selectedGender, city, phone, workPhone, work};
                registerUser(data).then(result => {
                    if (result === "Пользователь успешно зарегистрирован") {
                        navigate("/");
                    } else {
                        navigate("/sign-up");
                    }
                });
            }
            if (selectedRole === "student") {
                let data = {email, fullName, birthDate, password, selectedRole, selectedGender, city, phone, school};
                registerUser(data).then(result => {
                    if (result === "Пользователь успешно зарегистрирован") {
                        navigate("/");
                    } else {
                        alert(result);
                        navigate("/sign-up");
                    }
                });
            }
            // alert('Можно приступать к регистрации!');
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

                {selectedRole === 'parent' && (
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

                {selectedRole === 'student' && (
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