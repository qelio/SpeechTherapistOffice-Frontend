import styles from './HomePage.module.css';
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {authFlow} from "../../api/auth/authFlow";

function HomePage() {
    const navigate = useNavigate();
    useEffect(() => {
        const verifyAuth = async () => {
            navigate('/profile');
        };
        verifyAuth();
    }, [navigate]);
    
    return (
        <div className={styles.HomePage}>
            <h1>Главная страница</h1>
        </div>
    );
}

export default HomePage;