import styles from '../../styles/CtaComponents.module.css';
import {MouseEventHandler} from "react";

type ButtonType = {
    text: string,
    onClick: MouseEventHandler<HTMLButtonElement>,
    additionalProps?: Object,
}

const Button = ({ text, onClick, additionalProps }: ButtonType) => {
    return (
        <button className={styles.button} onClick={onClick} {...additionalProps}>
            {text}
        </button>
    )
};

export default Button;