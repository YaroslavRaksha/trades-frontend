import styles from '../../../styles/Exchanger.module.css';
import Input from "../../ctaComponents/Input";
import {useEffect, useState} from "react";
import getErrorMessage from "../../../helpers/getErrorMessage";

type Props = {
    currency: string,
    amount: string,
    dataLength: number,
    onMorningExistenceUpdate?: Function,
}

const updatedInputStyles = {
    style: {
        height: '32px',
        width: '180px',
    }
}

const Column = ({ currency, amount, dataLength, onMorningExistenceUpdate }: Props) => {

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        if(typeof window?.innerWidth !== 'undefined') {
            setIsMobile(window.innerWidth < 600);
        }
    }, []);

    const [amountState, setAmountState] = useState(amount);

    useEffect(() => {
        setAmountState(amount);
    }, [amount]);

    const [inputVisible, setInputVisible] = useState(false);
    const [inputAmount, setInputAmount] = useState(amount);

    const onInputChange = (event: any) => {
        setInputAmount(event.target.value);
    };

    const onInputBlur = () => {
        setInputVisible(false);
        setInputAmount(amount);
    }

    const handleInputKeyDown = (event: any) => {
        if (event.keyCode !== 13) {
            return;
        }

        if (amountState === inputAmount) {
            setInputVisible(false);
            return;
        }

        const updateAmount = async () => {
            if(onMorningExistenceUpdate) {
                try {
                    await onMorningExistenceUpdate({ currency: currency, amount: inputAmount });
                    setAmountState(inputAmount)
                } catch (err) {
                    const errorMessage = getErrorMessage(err);
                    alert(errorMessage);
                } finally {
                    setInputVisible(false);
                }
            }
        };

        updateAmount();
    };

    return (
        <div className={styles.existenceColumn} style={{
            flexBasis: isMobile ? '33.333%' : (dataLength > 4 ? '20%' : `${100 / dataLength}%`)
        }}>
            <div className={styles.existenceCurrency}>
                {currency}
            </div>
            <div
                className={styles.existenceValue}
                onDoubleClick={() => onMorningExistenceUpdate ? setInputVisible(true) : null}
            >
                {!inputVisible && amountState}
                {inputVisible && (
                    <Input
                        name='amount'
                        value={inputAmount}
                        onChange={onInputChange}
                        additionalProps={{
                            ...updatedInputStyles,
                            onBlur: onInputBlur,
                            onKeyDown: handleInputKeyDown,
                            type: 'number',
                        }}
                    />
                )}
            </div>
        </div>
    )
}

export default Column;