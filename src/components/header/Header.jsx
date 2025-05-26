import styles from "./Header.module.css"
import headerLogo from "../../assets/logo/header_logo.png"
import ButtonHeader from "../buttons/button-header/ButtonHeader";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {authFlow} from "../../api/auth/authFlow";
import {logoutUser} from "../../api/auth/logoutUser";

const AppHeader = () => {

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const logoutUserFunc = async () => {
        logoutUser().then(() => {
            setIsAuthenticated(false);
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
        <div className="container w-100">
            <header
                className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
                <a href="/" className="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none">
                    <img className="img-logo" src={headerLogo} alt="Логотип магазина" height="60"/>
                </a>
                {isAuthenticated &&
                    <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
                        <li><a href="#" className="nav-link px-2 link-secondary">Абонементы</a></li>
                        <li><a href="#" className="nav-link px-2 link-dark">Расписание</a></li>
                        <li><a href="#" className="nav-link px-2 link-dark">Домашние задания</a></li>
                        <li><a href="#" className="nav-link px-2 link-dark">Мой профиль</a></li>
                    </ul>
                }
                {!isAuthenticated &&
                    <div className="col-md-3 text-end">
                        <button type="button" className="btn btn-outline-primary me-2" onClick={navigateToSignIn}>Войти</button>
                        <button type="button" className="btn btn-primary" onClick={navigateToSignUp}>Регистрация</button>
                    </div>
                }
                {isAuthenticated &&
                    <>
                        <button type="button" className="btn btn-outline-primary me-2" onClick={logoutUserFunc}>Выйти</button>
                    </>
                }
            </header>
        </div>
    );
};

export default AppHeader;