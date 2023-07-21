import styles from '../../../styles/Exchanger.module.css';
import {ExistenceType} from "../../../helpers/customTypings";
import Column from "../existenceTable/Column";

type Props = {
    title: string,
    data: ExistenceType[],
    onMorningExistenceUpdate?: Function,
}

const ExistenceTable = ({ title, data, onMorningExistenceUpdate }: Props) => {

    const customSort = (a: any, b: any) => {
        if (a.currency === 'uah' && b.currency !== 'uah') {
            return 1; // 'uah' is greater than other currencies
        } else if (a.currency !== 'uah' && b.currency === 'uah') {
            return -1; // Other currencies are less than 'uah'
        } else {
            return 0; // Preserve the order for other currencies
        }
    };

    return (
        <div className={styles.existenceTable}>
            <h4>{title}</h4>
            <div className={styles.existenceWrapper}>
                {data?.sort(customSort)?.map(({ currency, amount }, index) =>
                    <Column
                        key={index}
                        currency={currency}
                        amount={amount}
                        dataLength={data?.length}
                        onMorningExistenceUpdate={onMorningExistenceUpdate}
                    />
                )}
            </div>
        </div>
    )
}

export default ExistenceTable;