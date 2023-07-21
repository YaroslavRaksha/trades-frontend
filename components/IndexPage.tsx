
import { useState } from 'react';
import styles from '../styles/IndexPage.module.css';
import {ExchangerType} from "../helpers/customTypings";
import SideModal from "./SideModal";
import Input from "./ctaComponents/Input";
import { useRouter } from 'next/router';
import nextApiInstance from "../utils/nextApiInstance";

type newExchanger = {
    exchangerAddress: string,
    exchangerCurrencies: string,
}

const IndexPage = ({ allExchangers }: any) => {


    const router = useRouter();
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [allExchangersState, setAllExchangersState] = useState<any>(allExchangers);

    const [newExchangerData, setNewExchangerData] = useState<newExchanger>({
        exchangerAddress: '',
        exchangerCurrencies: '',
    });

    const handleInputChange = (event: any) => {
        const { name, value } = event.target;
        setNewExchangerData({ ...newExchangerData, [name]: value });
    }

    const newExchangerOnSubmit = async () => {

        const { exchangerAddress, exchangerCurrencies } = newExchangerData;

        try {
            const { data } = await nextApiInstance.post('/api/exchanger', {
                address: exchangerAddress,
                currencies: exchangerCurrencies,
            });

            const { ok, id } = data;

            if(id && ok) {
                setAllExchangersState((prev: any) => [
                    ...prev,
                    {
                        id: id,
                        address: exchangerAddress,
                        currencies: exchangerCurrencies,
                    }
                ]);
                setModalVisible(false);
            }

            else {
                alert('Произошла ошибка при создании обменника')
            }
        }
        catch(err: any) {
            const { errorMessage }: any = err.response.data;
            errorMessage
                ? alert(errorMessage)
                : alert('Произошла неизвестная ошибка');
        }
    }

    const navigateToExchanger = (id: number) => router.push('/exchanger/' + id);

    return (
        <>
            <main>
                <div className={styles.allExchangersWrapper}>
                    {allExchangersState?.map((exchanger: ExchangerType) => (
                        <div
                            className={styles.exchangerCard}
                            key={exchanger.id}
                            onClick={() => navigateToExchanger(exchanger.id)}
                        >
                            <div>{exchanger.address}</div>
                            <div className={styles.exchangerCurrencies}>
                                {exchanger.currencies?.filter((c: any) => c !== 'uah')}
                            </div>
                        </div>
                    ))}
                    {( router?.query?.admin &&
                        <div className={styles.addExchanger} onClick={() => setModalVisible(true)}>
                            Добавить обменник
                        </div>
                    )}
                </div>
            </main>

            {(modalVisible &&
                <SideModal title='Добавить обменник' onSubmit={newExchangerOnSubmit} hideModal={() => setModalVisible(false)}>
                    <div style={{ marginTop: '20px' }}>
                        <Input
                            name='exchangerAddress'
                            label='Адрес обменника'
                            placeholder='Введите адрес обменника'
                            value={newExchangerData.exchangerAddress}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div style={{ marginTop: '20px' }}>
                        <Input
                            name='exchangerCurrencies'
                            label='Валюты ($, €, ₣, £, zł)'
                            placeholder='Введите валюты'
                            value={newExchangerData.exchangerCurrencies}
                            onChange={handleInputChange}
                        />
                    </div>
                </SideModal>
            )}
        </>
    )
};

export default IndexPage;