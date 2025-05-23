import styles from "./ButtonHeader.module.css"


const ButtonHeader = ( {buttonText, onClick} ) => {
    return (
        <div className={styles.buttonHeader} onClick={onClick}>
            {buttonText}
        </div>
    );
};

export default ButtonHeader;