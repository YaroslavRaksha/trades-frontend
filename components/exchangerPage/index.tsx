import {useState, useEffect} from "react";
import styles from '../../styles/Exchanger.module.css';
import {ExchangerType, ExistenceType, TradesDataType} from "../../helpers/customTypings";
import CurrencyCard from "./CurrencyCard";
import TradesTable from "./tradesTable/index";
import ExistenceTable from "../exchangerPage/existenceTable";
import nextApiInstance from "../../utils/nextApiInstance";
import getErrorMessage from "../../helpers/getErrorMessage";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ExchangerSettingsModal from "./ExchangerSettingsModal";
import {useRouter} from "next/router";

const formatDateWithTimeZone = (date: any) => {
    const options = { timeZone: 'Europe/Kiev' };
    return date.toLocaleString('en-US', options).split(',')[0];
};

const ExchangerPage = ({ exchangerData }: any) => {

    const router = useRouter();

    const { id, address, currencies }: ExchangerType = exchangerData;

    const [initialExchangerData, setInitialExchangerData] = useState({
        address: address,
        currencies: currencies,
    })

    const currentDate = formatDateWithTimeZone(new Date());

    const [currentExistence, setCurrentExistence] = useState<any>([]);
    const [morningExistence, setMorningExistence] = useState<any>([]);
    const [tradesData, setTradesData] = useState<any>([]);
    const [selectedDate, setSelectedDate] = useState<string>(currentDate);

    const [selectedCurrency, setSelectedCurrency] = useState(
        initialExchangerData?.currencies &&
        initialExchangerData?.currencies[0]);

    const handleDateChange = (date: any) => {
        const formattedDate = formatDateWithTimeZone(date);
        setSelectedDate(formattedDate);
    };

    const getCurrentExistence = ({ morningExistence, trades }: any) => {

        return morningExistence.map(({ currency, amount }: any) => {
            if (currency === 'uah') {
                const buySum = trades
                    .filter((trade: any) => trade.type === 'buy')
                    .reduce((sum: any, trade: any) => sum + parseFloat(trade.course) * parseFloat(trade.amount), 0);

                const saleSum = trades
                    .filter((trade: any) => trade.type === 'sale')
                    .reduce((sum: any, trade: any) => sum + parseFloat(trade.course) * parseFloat(trade.amount), 0);

                const buyMinusSaleAmount = buySum - saleSum;

                return {
                    currency: currency,
                    amount: parseFloat(amount) - buyMinusSaleAmount
                };
            } else {
                const buyAmountSum = trades
                    .filter((trade: any) => trade.type === 'buy' && trade.currency?.toLowerCase() === currency?.toLowerCase())
                    .reduce((sum: any, trade: any) => sum + parseFloat(trade.amount), 0);

                const saleAmountSum = trades
                    .filter((trade: any) => trade.type === 'sale' && trade.currency?.toLowerCase() === currency?.toLowerCase())
                    .reduce((sum: any, trade: any) => sum + parseFloat(trade.amount), 0);

                return {
                    currency: currency,
                    amount: parseFloat(amount) - saleAmountSum + buyAmountSum
                };
            }
        });
    };

    const getMorningExistenceData = async () => {
        const morningExistenceResponse = await nextApiInstance.get(
            `/api/morningExistence/${id}?date=${selectedDate}`
        );
        return morningExistenceResponse?.data || [];
    }

    const getTradesData = async () => {
        const tradesDataResponse = await nextApiInstance.get(
            `/api/trades?exchangerId=${id}&date=${selectedDate}`
        );

        return tradesDataResponse?.data || [];
    };

    const onTradeAdd = async ({ tradeId, type, time, amount, course }: any) => {

        const newTradesData = [...tradesData, {
            id: tradeId,
            time: time,
            type: type,
            currency: selectedCurrency,
            amount: amount,
            course: course,
        }];

        setTradesData(newTradesData);

        await refreshCurrentExistence({ newTradesData: newTradesData })
    };

    const onTradeUpdate = async ({ id, key, value }: any) => {

        const newTradesData = [
            ...tradesData.filter((trade: any) => trade.id !== id),
            {
                ...tradesData.find((trade: any) => trade.id === id),
                [key]: value,
            }
        ];

        setTradesData(newTradesData);

        await refreshCurrentExistence({ newTradesData: newTradesData })
    }

    const onTradeDelete = async ({ id }: any) => {
        const newTradesData = tradesData.filter((trade: any) => trade.id !== id)
        setTradesData(newTradesData);
        await refreshCurrentExistence({ newTradesData: newTradesData })
    }

    useEffect(() => {
        const onDateUpdate = async () => {
            try {
                const morningExistenceData = await getMorningExistenceData();
                const tradesData = await getTradesData();

                const currentExistence = getCurrentExistence({
                    morningExistence: morningExistenceData,
                    trades: tradesData
                });

                setTradesData(tradesData);
                setMorningExistence(morningExistenceData);
                setCurrentExistence(currentExistence);
            }
            catch(err) {
                const errorMessage = getErrorMessage(err);
                setMorningExistence([]);
                setTradesData([]);
                setCurrentExistence([]);
                alert(errorMessage);
            }
        }
        onDateUpdate()
    }, [selectedDate]);

    useEffect(() => {
        const onCurrencyUpdate = async () => {
            const tradesData = await getTradesData();
            setTradesData(tradesData);
        };
        onCurrencyUpdate()
    }, [selectedCurrency]);


    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsMobile(window.innerWidth < 1100);
        }
    }, [])

    const refreshCurrentExistence = ({ newTradesData }: any) => {
        const currentExistence = getCurrentExistence({
            morningExistence: morningExistence,
            trades: newTradesData,
        });
        setCurrentExistence(currentExistence);
    }

    const onMorningExistenceUpdate = async ({ currency, amount }: any) => {

        const comingAmount = parseFloat(amount);

        await nextApiInstance.put('/api/morningExistence/' + id, {
            date: selectedDate,
            currency: currency,
            amount: amount,
        });

        const updatedCurrentExistence = currentExistence.map((currentExistenceItem: any) => {
            if (currentExistenceItem.currency === currency) {
                const morningExistenceAmount = morningExistence?.find((morningItem: any) => morningItem?.currency === currency)?.amount || '0';
                const newAmount = comingAmount + parseFloat(currentExistenceItem.amount) - parseFloat(morningExistenceAmount);
                return { ...currentExistenceItem, amount: newAmount}
            }
            return currentExistenceItem;
        });

        const updatedMorningExistence = morningExistence.map((morningExistenceItem: any) => {
            if (morningExistenceItem.currency === currency) {
                return { ...morningExistenceItem, amount: comingAmount}
            }
            return morningExistenceItem;
        });

        setMorningExistence(updatedMorningExistence);
        setCurrentExistence(updatedCurrentExistence);
    };

    const [modalVisible, setModalVisible] = useState<boolean>(false);

    const onExchangerDelete = async () => {
        const confirmDelete = confirm('Вы уверены что хотите удалить обменник?');

        if(confirmDelete) {
            const { data } = await nextApiInstance.delete('/api/exchanger/' + id);
            const { ok } = data;
            if(ok) {
                await router.push('/');
            }
            else {
                alert('Произошла ошибка во время удаления обменника')
            }
        }
    }

    const [selectedMobileType, setSelectedMobileType] = useState('buy');

    return (
        <>
            <main>
                <div className={styles.header}>
                    <h1>{initialExchangerData.address}</h1>
                    <div className={styles.headerExtra}>
                        {(
                            router?.query?.admin &&
                            <>
                                <span
                                    className={styles.headerDeleteExchanger}
                                    onClick={onExchangerDelete}
                                >
                                    {isMobile ? 'Удалить' : 'Удалить обменник'}
                                </span>
                                <span
                                    className={styles.headerSettings}
                                    onClick={() => setModalVisible(true)}
                                >
                                    Настройки
                                </span>
                            </>
                        )}
                        <DatePicker
                            onChange={() => ''}
                            selected={new Date(selectedDate)}
                            onSelect={handleDateChange}
                            customInput={<button className={styles.datePicker}>{selectedDate}</button>}
                            dateFormat="yyyy-MM-dd"
                        />
                    </div>
                </div>

                <div className={styles.existencesWrapper}>
                    <ExistenceTable
                        title='Наличие на утро'
                        data={morningExistence}
                        onMorningExistenceUpdate={
                            selectedDate === currentDate ?
                                async (update: any) => await onMorningExistenceUpdate(update)
                                : undefined
                        }
                    />
                    <ExistenceTable
                        title='Наличие'
                        data={currentExistence}
                    />

                </div>
                <div className={styles.currenciesWrapper}>
                    {currencies?.filter((currency) => currency !== 'uah')?.map((currency: string, index: number) =>
                        <CurrencyCard
                            key={index}
                            currency={currency}
                            selected={currency === selectedCurrency}
                            onClick={() => setSelectedCurrency(currency)}
                        />
                    )}
                </div>

                {(isMobile &&
                    <div className={styles.typesWrapper}>
                        <div
                            className={selectedMobileType === 'buy' ? styles.selected : undefined}
                            onClick={() => setSelectedMobileType('buy')}
                        >
                            Покупка
                        </div>
                        <div
                            className={selectedMobileType === 'sale' ? styles.selected : undefined}
                            onClick={() => setSelectedMobileType('sale')}
                        >
                            Продажа
                        </div>
                    </div>
                )}
                <div className={styles.currencyTablesWrapper}>
                    {((isMobile ? selectedMobileType === 'buy' : true) &&
                        <TradesTable
                            exchangerId={id}
                            type='buy'
                            title={`Покупка ${selectedCurrency}`}
                            currency={selectedCurrency}
                            data={tradesData?.filter((row: any) => row.type === 'buy' && row?.currency === selectedCurrency)}
                            onTradeAdd={(trade: any) => onTradeAdd(trade)}
                            onTradeUpdate={(trade: any) => onTradeUpdate(trade)}
                            onTradeDelete={(trade: any) => onTradeDelete(trade)}
                            editRowAvailable={selectedDate === currentDate}
                        />
                    )}

                    {((isMobile ? selectedMobileType === 'sale' : true) &&
                        <TradesTable
                            exchangerId={id}
                            type='sale'
                            title={`Продажа ${selectedCurrency}`}
                            currency={selectedCurrency}
                            data={tradesData?.filter((row: any) => row.type === 'sale' && row?.currency === selectedCurrency)}
                            onTradeAdd={(trade: any) => onTradeAdd(trade)}
                            onTradeUpdate={(trade: any) => onTradeUpdate(trade)}
                            onTradeDelete={(trade: any) => onTradeDelete(trade)}
                            editRowAvailable={selectedDate === currentDate}
                        />
                    )}
                </div>
            </main>

            {(modalVisible &&
                <ExchangerSettingsModal
                    exchangerId={id}
                    currentDate={currentDate}
                    initialAddress={initialExchangerData.address}
                    initialCurrencies={currencies?.filter((c) => c !== 'uah')}
                    setInitialExchangerData={setInitialExchangerData}
                    hideModal={() => setModalVisible(false)}
                />
            )}
        </>
    )
};

export default ExchangerPage;