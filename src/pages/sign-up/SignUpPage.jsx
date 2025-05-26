import styles from './SignUpPage.module.css';
import logopediaPng from "../../assets/sign-in-page/logopedia.jpg"
import FirstStepSignUp from "./FirstStepSignUp";
import SecondStepSignUp from "./SecondStepSignUp";
import { useState } from "react";

function SignUpPage() {
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [password, setPassword] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [selectedGender, setSelectedGender] = useState("");

    const [step, setStep] = useState(1);

    const handleNextStep = (email, fullName, birthDate, password, selectedRole, selectedGender) => {
        setEmail(email);
        setFullName(fullName);
        setBirthDate(birthDate);
        setPassword(password);
        setSelectedRole(selectedRole);
        setSelectedGender(selectedGender);
        setStep(2);
    };

    const onClickSubmit = () => {
        //
    }

    return (
        <div className={styles.RegisterConatiner}>
            {step === 1 && <FirstStepSignUp onNextStep={handleNextStep} />}
            {step === 2 && <SecondStepSignUp email={email} fullName={fullName} birthDate={birthDate}
                                             password={password} selectedRole={selectedRole} selectedGender={selectedGender} />}
        </div>
    );
}

export default SignUpPage;
