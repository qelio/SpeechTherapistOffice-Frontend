import styles from './SignUpPage.module.css';
import logopediaPng from "../../assets/sign-in-page/logopedia.jpg"
import FirstStepSignUp from "./FirstStepSignUp";
import SecondStepSignUp from "./SecondStepSignUp";
import { useState } from "react";

function SignUpPage() {
    const [step, setStep] = useState(1);
    const [role, setRole] = useState("");

    const handleNextStep = (selectedRole) => {
        setRole(selectedRole);
        setStep(2);
    };

    return (
        <div className={styles.RegisterConatiner}>
            <div className={styles.RegisterImage}>
                <img src={logopediaPng} alt="Регистрация" />
            </div>

            {step === 1 && <FirstStepSignUp onNextStep={handleNextStep} />}
            {step === 2 && <SecondStepSignUp roleUser={role} />}
        </div>
    );
}

export default SignUpPage;
