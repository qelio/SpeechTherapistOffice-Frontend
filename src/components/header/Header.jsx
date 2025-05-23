import styles from "./Header.module.css"
import headerLogo from "../../assets/logo/header_logo.png"
import ButtonHeader from "../buttons/button-header/ButtonHeader";

const AppHeader = () => {
    return (
        <header>
            <div className={styles.appHeader}>
                <img className="img-logo" src={headerLogo} alt="Логотип магазина"/>
                <div className={styles.menuHeader}>
                    <a href="#">Абонементы</a>
                    <a href="#">Расписание</a>
                    <a href="#">Домашние задания</a>
                    <a href="#">Мой профиль</a>
                </div>
                <div className={styles.buttonsHeader}>
                    <ButtonHeader buttonText="Войти"/>
                    <ButtonHeader buttonText="Регистрация"/>
                </div>
            </div>
        </header>
    );
};

export default AppHeader;