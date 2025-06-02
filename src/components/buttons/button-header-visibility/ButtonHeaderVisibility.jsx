import styles from "./ButtonHeaderVisibility.module.css"


const ButtonHeaderVisibility = ( {buttonText, onClick} ) => {
    return (
        <div className={styles.buttonHeader} onClick={onClick}>
            {buttonText}
        </div>
    );
};

export default ButtonHeaderVisibility;