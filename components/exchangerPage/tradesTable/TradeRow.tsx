import styles from "../../../styles/Exchanger.module.css";
import {useState} from "react";
import Input from "../../ctaComponents/Input";
import nextApiInstance from "../../../utils/nextApiInstance";
import getErrorMessage from "../../../helpers/getErrorMessage";

type Props = {
    id: number,
    amount: string | number,
    course: string | number,
    onTradeUpdate: Function,
    onTradeDelete: Function,
    editRowAvailable: boolean | undefined,
}

const updatedInputStyles: any = {
    style: {
        height: '32px',
        width: '180px',
    }
}

const TradeRow = ({ id, amount, course, onTradeUpdate, onTradeDelete, editRowAvailable, }: Props) => {

    const [inputTypeVisible, setInputTypeVisible] = useState<any>({
        amount: false,
        course: false,
    })

    const [tradeDataState, setTradeDataState] = useState<any>({
        amount: amount,
        course: course,
    })

    const [newTradeData, setNewTradeData] = useState<any>({
        amount: amount,
        course: course,
    });

    const handleInputChange = (event: any) => {
        const { name, value } = event.target;
        setNewTradeData({ ...newTradeData, [name]: value });
    }

    const handleInputKeyDown = async (event: any, key: any) => {
        if(event.keyCode !== 13) {
            return
        }

        if(newTradeData[key] === tradeDataState[key]) {
            return setInputTypeVisible((prev: any) => ({ ...prev, [key]: false }))
        }

        if(newTradeData[key]?.length > 0) {
            try {
                const { data } = await nextApiInstance.put('/trades/' + id, {
                    key: key,
                    value: newTradeData[key]
                });

                const { ok } = data;

                if(ok) {
                    onTradeUpdate({
                        id: id,
                        key: key,
                        value: newTradeData[key],
                    });
                    setTradeDataState((prev: any) => ({ ...prev, [key]: newTradeData[key] }));
                    setInputTypeVisible((prev: any) => ({ ...prev, [key]: false }))
                }

            }
            catch (err) {
                const errorMessage = getErrorMessage(err);
                alert(errorMessage);
            }
        }
    }

    const handleTradeDelete = async () => {
        const confirmDelete = confirm('Вы уверены что хотите удалить ряд?');

        if(confirmDelete) {
            try {
                const { data } = await nextApiInstance.delete('/trades/' + id);

                const { ok } = data;

                if(ok) {
                    onTradeDelete({ id: id, });
                }

            }
            catch (err) {
                const errorMessage = getErrorMessage(err);
                alert(errorMessage);
            }
        }
    }

    return (
        <div className={styles.rowWrapper}>
            {['amount', 'course'].map((key: any) => (
                <div
                    key={key}
                    onDoubleClick={() =>
                        editRowAvailable ?
                            setInputTypeVisible((prev: any) => ({ ...prev, [key]: true }))
                            : null
                    }
                >
                    {!inputTypeVisible[key] && tradeDataState[key]}
                    {inputTypeVisible[key] &&
                    <Input
                        name={key}
                        value={newTradeData[key]}
                        onChange={handleInputChange}
                        additionalProps={{
                            ...updatedInputStyles,
                            onBlur: () => {
                                setInputTypeVisible((prev: any) => ({ ...prev, [key]: false }));
                                setNewTradeData({ ...newTradeData, [key]: tradeDataState[key] });
                            },
                            onKeyDown: (event: any) => handleInputKeyDown(event, key),
                        }}
                    />
                    }
                </div>
            ))}

            <div className={styles.rowAmount}>
                <span>
                    {(tradeDataState.amount * tradeDataState.course).toFixed(2)}
                </span>
                {(editRowAvailable &&
                    <svg onClick={handleTradeDelete}
                         xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M10 15L10 12" stroke="#E90000" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M14 15L14 12" stroke="#E90000" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M3 7H21V7C20.0681 7 19.6022 7 19.2346 7.15224C18.7446 7.35523 18.3552 7.74458 18.1522 8.23463C18 8.60218 18 9.06812 18 10V16C18 17.8856 18 18.8284 17.4142 19.4142C16.8284 20 15.8856 20 14 20H10C8.11438 20 7.17157 20 6.58579 19.4142C6 18.8284 6 17.8856 6 16V10C6 9.06812 6 8.60218 5.84776 8.23463C5.64477 7.74458 5.25542 7.35523 4.76537 7.15224C4.39782 7 3.93188 7 3 7V7Z" stroke="#E90000" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M10.0681 3.37059C10.1821 3.26427 10.4332 3.17033 10.7825 3.10332C11.1318 3.03632 11.5597 3 12 3C12.4403 3 12.8682 3.03632 13.2175 3.10332C13.5668 3.17033 13.8179 3.26427 13.9319 3.37059" stroke="#E90000" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                )}
            </div>
        </div>
    )
}

export default TradeRow;