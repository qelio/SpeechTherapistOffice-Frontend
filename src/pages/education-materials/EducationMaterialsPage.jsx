import styles from './EducationMaterialsPage.module.css';
import {useEffect, useState} from "react";
import {authFlow} from "../../api/auth/authFlow";
import {useNavigate} from "react-router-dom";
import {getSelf} from "../../api/users/getSelf";

export default function EducationMaterialsPage() {

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [teacher, setTeacher] = useState(0);

    function updateTeacherStates() {
        getSelf().then((data) => {
            if (data.role_teacher === 1) {
                setTeacher(1);
            } else {
                setTeacher(0);
                navigate('/');
            }
        });
    }

    useEffect(() => {
        const verifyAuth = async () => {
            const userId = await authFlow();
            if (!userId) {
                navigate('/sign-in');
            } else {
                setIsLoading(false);
                updateTeacherStates();
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

        </div>
    )
}
