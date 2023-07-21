import styles from '../styles/SideModal.module.css';
import Button from "./ctaComponents/Button";
import {ReactNode} from "react";


type Props = {
    title: string,
    hideModal: any,
    onSubmit: any,
    modalWidth?: number,
    children?: ReactNode,
}

const SideModal = ({ children, title,  hideModal, onSubmit, modalWidth = 350 }: Props) => {

    return (
        <>
            <div className={styles.backdrop} onClick={hideModal} style={{width: `calc(100% - ${modalWidth}px)`}} />
            <div className={styles.modal} style={{width: `${modalWidth}px`}}>
                <h3>{title}</h3>
                <div className={styles.modalBody}>
                    {children}
                </div>
                <Button
                    text='Подтвердить'
                    onClick={onSubmit}
                />
            </div>
        </>
    )
};

export default SideModal;