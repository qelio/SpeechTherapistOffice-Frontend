import styles from "./ButtonFullWidth.module.css"


const ButtonFullWidth = ( {buttonText, onClick} ) => {
    return (
        <div className={styles.buttonFullWidth} onClick={onClick}>
            {buttonText}
        </div>
    );
};

export default ButtonFullWidth;