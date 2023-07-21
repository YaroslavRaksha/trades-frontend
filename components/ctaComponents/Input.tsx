import styles from '../../styles/CtaComponents.module.css';
import {ChangeEvent} from "react";

type InputType = {
    type?: string,
    name: string,
    label?: string,
    placeholder?: string,
    value: any,
    onChange: (event: ChangeEvent<HTMLInputElement>) => void,
    additionalProps?: Object,
}

export default function Input({ type = 'text', name, label, placeholder, value, onChange, additionalProps }: InputType) {

    return (
        <div>
            {label && ( <div className={styles.inputLabel}>{label}</div> )}
            <input
                className={styles.input}
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                {...additionalProps}
            />
        </div>
    )
}