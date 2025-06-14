import styles from './ProfilePage.module.css';
import userAv from "../../assets/profile/user.png";
import {useEffect, useRef, useState} from "react";
import {authFlow} from "../../api/auth/authFlow";
import {useNavigate} from "react-router-dom";
import {getSelf} from "../../api/users/getSelf";
import ButtonFullWidth from "../../components/buttons/button-full-width/ButtonFullWidth";
import ButtonHeader from "../../components/buttons/button-header/ButtonHeader";
import ButtonHeaderVisibility from "../../components/buttons/button-header-visibility/ButtonHeaderVisibility";
import {updateSelf} from "../../api/users/updateSelf";
import useNotification from "../../hooks/useNotificationNeutral";
import NotificationNeutral from "../../components/notifications/notification-neutral/NotificationNeutral";
import {checkEmail} from "../../api/register/checkEmail";
import {passwordsMatch, validatePassword} from "../../utils/validation";
import {updatePassword} from "../../api/users/updatePassword";
import Cropper from "react-cropper";
import {updatePhoto} from "../../api/users/updatePhoto";

function ProfilePage() {

    const { notification, showNotification, closeNotification } = useNotification();
    // Состояния для формы
    const [formFullName, setFormFullName] = useState('Самохвалов Вячеслав Дмитриевич');
    const [formEmail, setFormEmail] = useState('vyacheslav@samokhvaloff.ru');
    const [formBirthday, setFormBirthday] = useState('2004-11-28');
    const [formGender, setFormGender] = useState('Male');
    const [formCity, setFormCity] = useState('Chelyabinsk');
    const [formPhoneNumber, setFormPhoneNumber] = useState('+7 (932) 015-40-22');
    const [errors, setErrors] = useState({
        fullName: '',
        email: '',
        birthday: '',
        city: '',
        phoneNumber: ''
    });
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordErrors, setPasswordErrors] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [fullName, setFullName] = useState('Самохвалов Вячеслав Дмитриевич');
    const [email, setEmail] = useState('vyacheslav@samokhvaloff.ru');
    const [birthday, setBirthday] = useState('2004-11-28');
    const [gender, setGender] = useState('Male');
    const [city, setCity] = useState('Chelyabinsk');
    const [profilePictureUrl, setProfilePictureUrl] = useState(userAv);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('+7 (932) 015-40-22');

    const [uniqueCode, setUniqueCode] = useState('stud-wr9s6df5g');
    const [status, setStatus] = useState('student');

    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
    const [avatarError, setAvatarError] = useState('');
    const cropperRef = useRef(null);

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            setAvatarError('Файл слишком большой (максимум 5MB)');
            return;
        }

        if (!['image/jpeg', 'image/png'].includes(file.type)) {
            setAvatarError('Только JPG/PNG изображения');
            return;
        }

        setAvatarError('');
        const reader = new FileReader();
        reader.onload = () => setSelectedImage(reader.result);
        reader.readAsDataURL(file);
    };

    const handleCrop = () => {
        if (cropperRef.current) {
            const cropper = cropperRef.current.cropper;
            setCroppedImage(cropper.getCroppedCanvas().toDataURL('image/jpeg', 0.9));
        }
    };

    const handleRotate = () => {
        if (cropperRef.current) {
            cropperRef.current.cropper.rotate(90);
        }
    };

    const handleAvatarSubmit = async (e) => {
        e.preventDefault();
        if (!croppedImage) return;

        try {
            const blob = await (await fetch(croppedImage)).blob();
            const formData = new FormData();
            formData.append('file', blob, 'avatar.jpg');
            const response = await updatePhoto(formData);

            if (!response.ok) throw new Error('Ошибка загрузки');

            const data = await response.json();
            setShowAvatarModal(false);
            updateAllStates();
            setSelectedImage(null);
            setCroppedImage(null);
        } catch (error) {
            setAvatarError('Ошибка при сохранении: ' + error.message);
        }
    };

    async function handlePasswordSubmit(e) {
        e.preventDefault();

        setPasswordErrors({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });

        let isValid = true;
        const newErrors = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        };

        if (!currentPassword) {
            newErrors.currentPassword = 'Введите текущий пароль';
            isValid = false;
        }

        if (!newPassword) {
            newErrors.newPassword = 'Введите новый пароль';
            isValid = false;
        } else if (!validatePassword(newPassword)) {
            newErrors.newPassword = 'Пароль должен содержать 8-128 символов, включая заглавные и строчные буквы, цифры и разрешённые спецсимволы';
            isValid = false;
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Подтвердите новый пароль';
            isValid = false;
        } else if (!passwordsMatch(newPassword, confirmPassword)) {
            newErrors.confirmPassword = 'Пароли не совпадают';
            isValid = false;
        }

        if (!isValid) {
            setPasswordErrors(newErrors);
            showNotification('Проверьте правильность введённых данных', 3000, 'warning');
            return;
        }

        try {
            const response = await updatePassword({current_password: currentPassword, new_password: newPassword});
            if (response.ok) {
                showNotification("Пароль успешно изменен!", 3000, 'success');
            } else {
                showNotification("При обновлении пароля произошла ошибка, вероятно, вы ввели неверный пароль!", 3000, 'error');
            }
            setShowPasswordModal(false);
            updateAllStates();
        } catch (error) {
            showNotification("Ошибка при отправке данных", 3000, 'error');
            console.error('Ошибка:', error);
        }

    }

    const validateForm = async () => {
        const newErrors = {
            fullName: '',
            email: '',
            birthday: '',
            city: '',
            phoneNumber: ''
        };
        let isValid = true;

        if (!formFullName || formFullName.split(' ').length < 2) {
            newErrors.fullName = 'Введите полное имя и фамилию';
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formEmail || !emailRegex.test(formEmail)) {
            newErrors.email = 'Введите корректный email';
            isValid = false;
        }

        if (!formBirthday || new Date(formBirthday) >= new Date()) {
            newErrors.birthday = 'Введите корректную дату рождения';
            isValid = false;
        }

        if (!formCity) {
            newErrors.city = 'Введите город';
            isValid = false;
        }

        const phoneRegex = /^\+?[0-9\s\-\(\)]{10,}$/;
        if (!formPhoneNumber || !phoneRegex.test(formPhoneNumber)) {
            newErrors.phoneNumber = 'Введите корректный номер телефона';
            isValid = false;
        }

        if (isValid && emailRegex.test(formEmail) && email !== formEmail) {
            try {
                const result = await checkEmail({ email: formEmail });
                if (result === "Данный email занят") {
                    newErrors.email = 'Данный email уже занят';
                    isValid = false;
                }
            } catch (error) {
                console.error('Ошибка при проверке email:', error);
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    async function editFormSubmit(e) {
        e.preventDefault();
        const requestData = {
            full_name: formFullName,
            email: formEmail,
            birthday: formBirthday,
            gender: formGender,
            phoneNumber: formPhoneNumber,
            city: formCity
        };

        const isValid = await validateForm();

        if (isValid) {
            try {
                const response = await updateSelf(requestData);
                if (response.ok) {
                    showNotification("Данные успешно обновлены!", 3000, 'success');
                } else {
                    showNotification("При обновлении данных произошла ошибка!", 3000, 'error');
                }
                setShowModalEdit(false);
                updateAllStates();
            } catch (error) {
                showNotification("Ошибка при отправке данных", 3000, 'error');
                console.error('Ошибка:', error);
            }
        } else {
            showNotification("Проверьте корректность заполненных полей!", 3000, 'warning');
        }
    }


    function updateAllStates() {
        getSelf().then(data => {
            setFullName(data.full_name);
            setEmail(data.email);
            setBirthday(data.birthday);
            setGender(data.gender);
            setCity(data.city);
            setPhoneNumber(data.phone_number);
            setUniqueCode(data.unique_code);
            if (data.profile_picture_url) {
                setProfilePictureUrl(`http://localhost:5000/users/get_profile_picture?t=${Date.now()}`);
                console.log('update');
            } else {
                setProfilePictureUrl(userAv);
                console.log('no update');
            }
            if (data.role_student === 1) {
                setStatus('student');
            } else if (data.role_teacher === 1) {
                setStatus('teacher');
            }
            // Установка состояний для формы
            setFormFullName(data.full_name);
            setFormEmail(data.email);
            setFormBirthday(data.birthday);
            setFormGender(data.gender);
            setFormCity(data.city);
            setFormPhoneNumber(data.phone_number);
        });
    }

    useEffect(() => {
        const verifyAuth = async () => {
            const userId = await authFlow();
            if (!userId) {
                navigate('/sign-in');
            } else {
                setIsLoading(false);
               updateAllStates();
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
            {notification && (
                <NotificationNeutral
                    message={notification.message}
                    onClose={closeNotification}
                    duration={notification.duration}
                    type={notification.type}
                />
            )}
            <div className="container-fluid">
                <div className="row mb-4">
                    <div className="col-md-7">
                        <div className="card p-4 rounded-5 h-100">
                            <div className="d-flex">
                                <div className="me-4 text-center p-3 mt-4">
                                    <img className="img-logo mb-3 rounded-circle" src={profilePictureUrl} alt="Логотип магазина" width="150"
                                         height="150"/><br/>
                                    <a href="#"
                                        className="small-link"
                                        onClick={() => setShowAvatarModal(true)}>Изменить фото<br/>профиля</a>
                                </div>
                                <div>
                                    <h3 className="mb-3"><strong>{fullName}</strong></h3>
                                    <p className="mb-1"><strong>Email:</strong> {email}</p>
                                    <p className="mb-1"><strong>Дата рождения:</strong> {birthday}</p>
                                    <p className="mb-1"><strong>Пол:</strong> {gender}</p>
                                    <p className="mb-1"><strong>Город:</strong> {city}</p>
                                    <p className="mb-1"><strong>Номер телефона:</strong> {phoneNumber}</p>
                                    <p className="mb-1"><strong>Уникальный код:</strong> {uniqueCode}</p>
                                    <p className="mb-1"><strong>Статус:</strong>
                                        {status === 'student' && <> обучающийся</>}
                                        {status === 'teacher' && <> учитель</>}
                                    </p>
                                </div>
                            </div>
                            <div className="d-flex justify-content-end flex-column align-items-end mt-3">
                                <a href="#"
                                   className="small-link"
                                   onClick={() => setShowModalEdit(true)}>Редактировать профиль</a>
                                <a href="#"
                                   className="small-link"
                                   onClick={() => setShowPasswordModal(true)}>Изменить пароль</a>
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
                            <ButtonFullWidth buttonText="Показать все"/>
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
                            <ButtonFullWidth buttonText="Показать все"/>
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
                            <ButtonFullWidth buttonText="Показать все"/>
                        </div>
                    </div>
                </div>
            </div>

            {showModalEdit &&
                <div className="modal fade show d-block" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel"
                     aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Редактирование профиля</h5>
                                <button type="button"
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                        onClick={() => setShowModalEdit(false)}></button>
                            </div>
                            <form onSubmit={editFormSubmit}>
                                <div className="modal-body">
                                    <div className="container mt-2">
                                        <div className="row mb-3 align-items-center">
                                            <div className="col-md-3">
                                                <label htmlFor="fullName"
                                                       className="form-label"><strong>ФИО:</strong></label>
                                            </div>
                                            <div className="col-md-9">
                                                <input type="text"
                                                       className={`form-control ${errors.fullName && 'is-invalid'}`}
                                                       id="fullName"
                                                       placeholder="Иванов Иван Иванович"
                                                       value={formFullName}
                                                       onChange={(e) => setFormFullName(e.target.value)}/>
                                                {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                                            </div>
                                        </div>
                                        <div className="row mb-3 align-items-center">
                                            <div className="col-md-3">
                                                <label htmlFor="email"
                                                       className="form-label"><strong>Email:</strong></label>
                                            </div>
                                            <div className="col-md-9">
                                                <input type="email"
                                                       className={`form-control ${errors.email && 'is-invalid'}`}
                                                       id="email"
                                                       placeholder="example@mail.com"
                                                       value={formEmail}
                                                       onChange={(e) => setFormEmail(e.target.value)}/>
                                                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                            </div>
                                        </div>
                                        <div className="row mb-3 align-items-center">
                                            <div className="col-md-3">
                                                <label htmlFor="birthDate" className="form-label"><strong>Дата
                                                    рождения:</strong></label>
                                            </div>
                                            <div className="col-md-9">
                                                <input type="date"
                                                       className={`form-control ${errors.birthday && 'is-invalid'}`}
                                                       id="birthDate"
                                                       value={formBirthday}
                                                       onChange={(e) => setFormBirthday(e.target.value)}/>
                                                {errors.birthday && <div className="invalid-feedback">{errors.birthday}</div>}
                                            </div>
                                        </div>
                                        <div className="row mb-3 align-items-center">
                                            <div className="col-md-3">
                                                <label className="form-label"><strong>Пол:</strong></label>
                                            </div>
                                            <div className="col-md-9">
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio" name="gender" id="male"
                                                           value="Male"
                                                           checked={formGender === 'Male'}
                                                           onChange={(e) => setFormGender(e.target.value)}/>
                                                    <label className="form-check-label" htmlFor="male">Мужской</label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio" name="gender"
                                                           id="female" value="Female"
                                                           checked={formGender === 'Female'}
                                                           onChange={(e) => setFormGender(e.target.value)}/>
                                                    <label className="form-check-label" htmlFor="female">Женский</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row mb-3 align-items-center">
                                            <div className="col-md-3">
                                                <label htmlFor="city" className="form-label"><strong>Город:</strong></label>
                                            </div>
                                            <div className="col-md-9">
                                                <input type="text"
                                                       className={`form-control ${errors.city && 'is-invalid'}`}
                                                       id="city"
                                                       placeholder="Челябинск"
                                                       value={formCity}
                                                       onChange={(e) => setFormCity(e.target.value)}/>
                                                {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                                            </div>
                                        </div>
                                        <div className="row mb-3 align-items-center">
                                            <div className="col-md-3">
                                                <label htmlFor="phone"
                                                       className="form-label"><strong>Телефон:</strong></label>
                                            </div>
                                            <div className="col-md-9">
                                                <input type="tel"
                                                       className={`form-control ${errors.phoneNumber && 'is-invalid'}`}
                                                       id="phone"
                                                       placeholder="+7 (999) 123-45-67"
                                                       value={formPhoneNumber}
                                                       onChange={(e) => setFormPhoneNumber(e.target.value)}/>
                                                {errors.phoneNumber && <div className="invalid-feedback">{errors.phoneNumber}</div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <ButtonHeaderVisibility buttonText="Отмена"
                                                            onClick={() => setShowModalEdit(false)}/>
                                    <ButtonHeader buttonText="Сохранить изменения"
                                                  onClick={editFormSubmit}/>
                                </div>
                            </form>
                            </div>
                        </div>
                    </div>
                    }
                    {showPasswordModal &&
                        <div className="modal fade show d-block" id="passwordModal" tabIndex="-1" aria-labelledby="passwordModalLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="passwordModalLabel">Смена пароля</h5>
                                        <button type="button"
                                                className="btn-close"
                                                data-bs-dismiss="modal"
                                                aria-label="Close"
                                                onClick={() => setShowPasswordModal(false)}></button>
                                    </div>
                                    <form onSubmit={handlePasswordSubmit}>
                                        <div className="modal-body">
                                            <div className="container mt-2">
                                                <div className="row mb-3 align-items-center">
                                                    <div className="col-md-4">
                                                        <label htmlFor="currentPassword" className="form-label"><strong>Текущий пароль:</strong></label>
                                                    </div>
                                                    <div className="col-md-8">
                                                        <input type="password"
                                                               className={`form-control ${passwordErrors.currentPassword && 'is-invalid'}`}
                                                               id="currentPassword"
                                                               value={currentPassword}
                                                               onChange={(e) => setCurrentPassword(e.target.value)}/>
                                                        {passwordErrors.currentPassword &&
                                                            <div className="invalid-feedback">{passwordErrors.currentPassword}</div>}
                                                    </div>
                                                </div>

                                                <div className="row mb-3">
                                                    <div className="col-md-4 mt-1">
                                                        <label htmlFor="newPassword" className="form-label"><strong>Новый пароль:</strong></label>
                                                    </div>
                                                    <div className="col-md-8">
                                                        <input type="password"
                                                               className={`form-control ${passwordErrors.newPassword && 'is-invalid'}`}
                                                               id="newPassword"
                                                               value={newPassword}
                                                               onChange={(e) => setNewPassword(e.target.value)}/>
                                                        {passwordErrors.newPassword &&
                                                            <div className="invalid-feedback">{passwordErrors.newPassword}</div>}
                                                        <div className="form-text">Минимум 8 символов, включая цифры и буквы</div>
                                                    </div>
                                                </div>

                                                <div className="row mb-3 align-items-center">
                                                    <div className="col-md-4">
                                                        <label htmlFor="confirmPassword" className="form-label"><strong>Подтвердите пароль:</strong></label>
                                                    </div>
                                                    <div className="col-md-8">
                                                        <input type="password"
                                                               className={`form-control ${passwordErrors.confirmPassword && 'is-invalid'}`}
                                                               id="confirmPassword"
                                                               value={confirmPassword}
                                                               onChange={(e) => setConfirmPassword(e.target.value)}/>
                                                        {passwordErrors.confirmPassword &&
                                                            <div className="invalid-feedback">{passwordErrors.confirmPassword}</div>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <ButtonHeaderVisibility
                                                buttonText="Отмена"
                                                onClick={() => setShowPasswordModal(false)}/>
                                            <ButtonHeader
                                                buttonText="Изменить пароль"
                                                onClick={handlePasswordSubmit}/>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    }
                    {showAvatarModal && (
                        <div className="modal fade show d-block" id="avatarModal" tabIndex="-1" aria-labelledby="avatarModalLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered modal-lg">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="avatarModalLabel">Смена фото профиля</h5>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            aria-label="Close"
                                            onClick={() => {
                                                setSelectedImage(null);
                                                setCroppedImage(null);
                                                setShowAvatarModal(false);
                                            }}
                                        ></button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="container mt-2">
                                            {!selectedImage ? (
                                                <div className="text-center py-4">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageSelect}
                                                        className="d-none"
                                                        id="avatar-upload"
                                                    />
                                                    <label htmlFor="avatar-upload" className="btn btn-primary">
                                                        <i className="bi bi-upload me-2"></i>Выбрать фото
                                                    </label>
                                                    <div className="form-text mt-2">
                                                        Поддерживаются JPG, PNG (макс. 5MB)
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="row">
                                                        <div className="col-md-8">
                                                            <Cropper
                                                                src={selectedImage}
                                                                style={{ height: 400, width: '100%' }}
                                                                initialAspectRatio={1}
                                                                aspectRatio={1}
                                                                guides={true}
                                                                viewMode={1}
                                                                crop={handleCrop}
                                                                ref={cropperRef}
                                                            />
                                                        </div>
                                                        <div className="col-md-4 d-flex flex-column align-items-center">
                                                            <h6 className="mb-3">Предпросмотр</h6>
                                                            <div
                                                                className="border rounded-circle overflow-hidden mb-3"
                                                                style={{ width: '150px', height: '150px' }}
                                                            >
                                                                {croppedImage && (
                                                                    <img
                                                                        src={croppedImage}
                                                                        alt="Предпросмотр"
                                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                                    />
                                                                )}
                                                            </div>
                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-secondary btn-sm"
                                                                onClick={handleRotate}
                                                            >
                                                                <i className="bi bi-arrow-clockwise me-1"></i>Повернуть
                                                            </button>
                                                        </div>
                                                    </div>
                                                    {avatarError && (
                                                        <div className="alert alert-danger mt-3">{avatarError}</div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <ButtonHeaderVisibility
                                            buttonText="Отмена"
                                            onClick={() => {
                                                setSelectedImage(null);
                                                setCroppedImage(null);
                                                setShowAvatarModal(false);
                                            }}
                                        />
                                        <ButtonHeader
                                            buttonText="Сохранить фото"
                                            onClick={handleAvatarSubmit}
                                            disabled={!croppedImage}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                );
            }

            export default ProfilePage;