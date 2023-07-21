import React, { MouseEventHandler, CSSProperties } from 'react';
import styles from '../../styles/Exchanger.module.css';

type Props = {
    currency: string;
    selected: boolean;
    onClick: MouseEventHandler<HTMLDivElement>;
};

const CurrencyCard = ({ currency, selected, onClick }: Props) => {
    return (
        <div
            onClick={onClick}
            className={styles.currencyCard}
            style={selected ? { backgroundColor: 'var(--green-300)', color: 'var(--light)' } : undefined}
        >
            {currency}
        </div>
    );
};

export default CurrencyCard;
