import styles from './HomePage.module.css';
import AppHeader from "../../components/header/Header";

function HomePage() {
    return (
        <div className={styles.HomePage}>
            <AppHeader />
            <h1>Главная страница</h1>
            <p>Добро пожаловать на наш сайт!</p>
        </div>
    );
}

export default HomePage;