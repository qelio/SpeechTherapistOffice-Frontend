import styles from "./Footer.module.css"

const AppFooter = () => {
    return (
        <footer>
            <div className={styles.Footer}>
                <p>&copy; 2025 Кабинет Логопеда. Все права защищены.</p>
            </div>
        </footer>
    );
};

export default AppFooter;