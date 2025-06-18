import styles from "./Header.module.css"
import headerLogo from "../../assets/logo/header_logo.png"
import ButtonHeader from "../buttons/button-header/ButtonHeader";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {authFlow} from "../../api/auth/authFlow";
import {logoutUser} from "../../api/auth/logoutUser";
import ButtonHeaderVisibility from "../buttons/button-header-visibility/ButtonHeaderVisibility";
import {getSelf} from "../../api/users/getSelf";

const AppHeader = () => {

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [roleStudent, setRoleStudent] = useState(0);
    const [roleParent, setRoleParent] = useState(0);
    const [roleTeacher, setRoleTeacher] = useState(0);
    const [roleAdministrator, setRoleAdministrator] = useState(0);

    const logoutUserFunc = async () => {
        logoutUser().then(() => {
            setIsAuthenticated(false);
            setRoleStudent(0);
            setRoleTeacher(0);
            setRoleAdministrator(0);
            setRoleParent(0);
            navigate("/");
        });
    }

    const navigateToSignIn = () => {
        navigate('/sign-in');
    };

    const navigateToSignUp = () => {
        navigate('/sign-up');
    };

    useEffect(() => {
        const verifyAuth = async () => {
            const userId = await authFlow();
            if (userId) {
                setIsLoading(false);
                setIsAuthenticated(true);
                getSelf().then((data) => {
                    setRoleStudent(data.role_student);
                    setRoleParent(data.role_parent);
                    setRoleTeacher(data.role_teacher);
                    setRoleAdministrator(data.role_administrator);
                });
            } else {
                setIsLoading(false);
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
        <div className={styles.headerContainer}>
            <header
                className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-2">
                <a href="/" className="d-flex align-items-center col-md-3 mb-md-0 text-dark text-decoration-none">
                    <img className="img-logo" src={headerLogo} alt="Логотип магазина" height="60"/>
                </a>
                {roleStudent === 1 &&
                    <ul className="nav col-12 col-md-auto justify-content-center mb-md-0">
                        <li><a href="/subscriptions" className="nav-link px-2 link-dark">Абонементы</a></li>
                        <li><a href="/schedule" className="nav-link px-2 link-dark">Расписание</a></li>
                        <li><a href="/home-works" className="nav-link px-2 link-dark">Домашние задания</a></li>
                        <li><a href="/profile" className="nav-link px-2 link-dark">Мой профиль</a></li>
                    </ul>
                }
                {roleTeacher === 1 &&
                    <ul className="nav col-12 col-md-auto justify-content-center mb-md-0">
                        <li><a href="/education-materials" className="nav-link px-2 link-dark">Учебные материалы</a></li>
                        <li><a href="/schedule-teacher" className="nav-link px-2 link-dark">Моё расписание</a></li>
                        <li><a href="/teaching" className="nav-link px-2 link-dark">Учительская</a></li>
                        <li><a href="/profile" className="nav-link px-2 link-dark">Мой профиль</a></li>
                    </ul>
                }
                {!isAuthenticated &&
                    <div className="col-md-3 text-end">
                        <ButtonHeader buttonText="Войти" onClick={navigateToSignIn}/>
                        <ButtonHeader buttonText="Регистрация" onClick={navigateToSignUp}/>
                    </div>
                }
                {isAuthenticated &&
                    <>
                        <ButtonHeaderVisibility buttonText="Выйти" onClick={logoutUserFunc}/>
                    </>
                }
            </header>
        </div>
    );
};

export default AppHeader;