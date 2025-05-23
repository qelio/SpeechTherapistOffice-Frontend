import styles from './SignUpPage.module.css';
import ButtonFullWidth from "../../components/buttons/button-full-width/ButtonFullWidth";
import { useState } from "react";
import {
    validateEmail,
    validateFullName,
    validateBirthDate,
    validatePassword,
    passwordsMatch
} from "../../utils/validation";

function FirstStepSignUp({ onNextStep }) {
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [selectedGender, setSelectedGender] = useState("");

    const [errors, setErrors] = useState({});

    const handleContinue = () => {
        const newErrors = {};

        if (!validateEmail(email)) newErrors.email = "Введите корректный адрес электронной почты.";
        if (!validateFullName(fullName)) newErrors.fullName = "Введите корректное ФИО (минимум имя и фамилия).";
        if (!validateBirthDate(birthDate)) newErrors.birthDate = "Дата рождения не может быть в будущем.";
        if (!validatePassword(password)) newErrors.password = "Пароль не соответствует требованиям.";
        if (!passwordsMatch(password, confirmPassword)) newErrors.confirmPassword = "Пароли не совпадают.";
        if (!selectedRole) newErrors.role = "Выберите роль в системе.";
        if (!selectedGender) newErrors.gender = "Выберите пол.";

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            onNextStep(selectedRole);
        }
    };

    return (
        <div className={styles.RegisterForm}>
            <h1>Регистрация</h1>
            <p>Вы можете создать учетную запись, если еще не зарегистрировались.<br />Поля со * обязательны для заполнения!</p>

            <form>
                <label>Адрес электронной почты*</label>
                <input
                    type="email"
                    placeholder="Введите адрес электронной почты…"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <div className={styles.Error}>{errors.email}</div>}

                <label>Фамилия Имя Отчество*</label>
                <input
                    type="text"
                    placeholder="Введите ваше ФИО…"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                />
                {errors.fullName && <div className={styles.Error}>{errors.fullName}</div>}

                <label>Дата рождения*</label>
                <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                />
                {errors.birthDate && <div className={styles.Error}>{errors.birthDate}</div>}

                <label>Укажите ваш пол:*</label>
                <div className={styles.RadioGroup}>
                    <label>
                        <input
                            type="radio"
                            name="gender"
                            value="male"
                            checked={selectedGender === "male"}
                            onChange={(e) => setSelectedGender(e.target.value)}
                        /> Мужской
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="gender"
                            value="female"
                            checked={selectedGender === "female"}
                            onChange={(e) => setSelectedGender(e.target.value)}
                        /> Женский
                    </label>
                </div>
                {errors.gender && <div className={styles.Error}>{errors.gender}</div>}

                <label>Пароль*</label>
                <input
                    type="password"
                    placeholder="Введите пароль…"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <div className={styles.Error}>{errors.password}</div>}

                <input
                    type="password"
                    placeholder="Подтвердите пароль…"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {errors.confirmPassword && <div className={styles.Error}>{errors.confirmPassword}</div>}

                <label>Выберите роль в системе:*</label>
                <div className={styles.RadioGroup}>
                    <label>
                        <input
                            type="radio"
                            name="role"
                            value="student"
                            checked={selectedRole === "student"}
                            onChange={(e) => setSelectedRole(e.target.value)}
                        /> Ученик
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="role"
                            value="parent"
                            checked={selectedRole === "parent"}
                            onChange={(e) => setSelectedRole(e.target.value)}
                        /> Родитель
                    </label>
                </div>
                {errors.role && <div className={styles.Error}>{errors.role}</div>}
            </form>

            <div onClick={handleContinue}>
                <ButtonFullWidth buttonText="Продолжить регистрацию" />
            </div>
        </div>
    );
}

export default FirstStepSignUp;
