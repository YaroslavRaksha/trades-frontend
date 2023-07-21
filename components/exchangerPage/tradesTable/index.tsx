import styles from '../../../styles/Exchanger.module.css';
import Input from "../../ctaComponents/Input";
import {useState} from "react";
import Button from "../../ctaComponents/Button";
import nextApiInstance from "../../../utils/nextApiInstance";
import getErrorMessage from "../../../helpers/getErrorMessage";
import {TradesDataType} from "../../../helpers/customTypings";
import TradeRow from "./TradeRow";

type Props = {
    exchangerId: string | number,
    type: 'buy' | 'sale',
    title: string,
    currency?: any,
    data: TradesDataType[],
    onTradeAdd: Function,
    onTradeUpdate: Function,
    onTradeDelete: Function,
    editRowAvailable: boolean | undefined,
}

type newCurrencyRow = {
    amount: string,
    course: string,
}

const updatedInputStyles: any = {
    style: {
        paddingLeft: '20px',
        borderRadius: '0',
        borderTop: 'none',
        borderLeft: 'none',
        borderColor: 'var(--gray-50)',
    }
}

const updatedButtonStyles: any = {
    style: {
        backgroundColor: 'var(--green-300)',
        color: 'var(--light)',
        borderBottom: '1px solid var(--gray-50)'
    }
}

const TradesTable = ({ exchangerId, type, title, currency, data, onTradeAdd, onTradeUpdate, onTradeDelete, editRowAvailable }: Props) => {

    const [newCurrencyRow, setNewCurrencyRow] = useState<newCurrencyRow>({
        amount: '',
        course: '',
    });

    const handleInputChange = (event: any) => {
        const { name, value } = event.target;
        setNewCurrencyRow({ ...newCurrencyRow, [name]: value });
    }

    const handleSubmit = async () => {
        const { course, amount } = newCurrencyRow;
        if(course?.length > 0 && amount?.length > 0) {
            try {
                const { data } = await nextApiInstance.post('/api/trades', {
                    exchangerId: exchangerId,
                    type: type,
                    currency: currency,
                    course: course,
                    amount: amount,
                });

                const { ok, id, time } = data;

                if(ok && time) {
                    onTradeAdd({
                        tradeId: id,
                        time: time,
                        type: type,
                        amount: amount,
                        course: course,
                    })
                }

            }
            catch (err) {
                const errorMessage = getErrorMessage(err);
                alert(errorMessage);
            }
            finally {
                setNewCurrencyRow({
                    amount: '',
                    course: '',
                })
            }
        }
        else {
            alert('Поля введены некорректно')
        }
    }

    return (
        <div className={styles.tradesTable}>
            <h4>{title}</h4>
            {data?.length > 0 && data.map(({ id, amount, course }, index) => (
                <TradeRow
                    id={id}
                    key={index}
                    amount={amount}
                    course={course}
                    onTradeUpdate={onTradeUpdate}
                    onTradeDelete={onTradeDelete}
                    editRowAvailable={editRowAvailable}
                />
            ))}

            {(editRowAvailable &&
                <div className={styles.addCurrencyRow}>
                    <div>
                        <Input
                            name='amount'
                            placeholder={`Кол-во ${currency}`}
                            value={newCurrencyRow.amount}
                            onChange={handleInputChange}
                            additionalProps={{
                                ...updatedInputStyles,
                                type: 'number'
                            }}
                        />
                    </div>
                    <div>
                        <Input
                            name='course'
                            placeholder={`Курс ${currency}`}
                            value={newCurrencyRow.course}
                            onChange={handleInputChange}
                            additionalProps={{
                                ...updatedInputStyles,
                                type: 'number'
                            }}
                        />
                    </div>
                    <div>
                        <Button
                            text='Добавить'
                            onClick={handleSubmit}
                            additionalProps={...updatedButtonStyles}
                        />
                    </div>
                </div>)
            }
        </div>
    )
}

export default TradesTable;