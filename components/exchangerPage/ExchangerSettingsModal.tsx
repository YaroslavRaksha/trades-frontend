import SideModal from "../SideModal";
import {useState} from "react";
import Input from "../ctaComponents/Input";
import nextApiInstance from "../../utils/nextApiInstance";
import getErrorMessage from "../../helpers/getErrorMessage";

type Props = {
    exchangerId: string | number,
    currentDate: string,
    initialAddress: string,
    initialCurrencies: any[],
    hideModal: Function,
    setInitialExchangerData: Function,
}
const ExchangerSettingsModal = ({ exchangerId, currentDate, initialAddress, initialCurrencies, hideModal }: Props) => {

    const [newExchangerSettings, setNewExchangerSettings] = useState({
        address: initialAddress,
        currencies: initialCurrencies,
    });

    const handleInputChange = (event: any) => {
        const { name, value } = event.target;
        setNewExchangerSettings({ ...newExchangerSettings, [name]: value });
    }

    const onModalSubmit = async () => {

        if(initialAddress === newExchangerSettings.address && initialCurrencies === newExchangerSettings.currencies) {
            return hideModal();
        }
        else {
            try {
                const { data } = await nextApiInstance.put('/api/exchanger/' + exchangerId, {
                    date: currentDate,
                    address: newExchangerSettings.address,
                    currencies: newExchangerSettings.currencies
                });

                const { ok } = data;

                if(ok) {
                    window.location.reload();
                }
            }
            catch (err) {
                const errorMessage = getErrorMessage(err);
                alert(errorMessage);
            }
        }
    }

    return (
        <SideModal
            title='Настройки обменника'
            hideModal={hideModal}
            onSubmit={onModalSubmit}
        >
            <div style={{marginTop: '20px'}}>
                <Input
                    name='address'
                    value={newExchangerSettings.address}
                    label='Адресс обменника'
                    placeholder='Введите адресс обменника'
                    onChange={handleInputChange}
                />
            </div>
            <div style={{marginTop: '20px'}}>
                <Input
                    name='currencies'
                    value={newExchangerSettings.currencies}
                    label='Валюты ($, €, ₣, £, zł)'
                    placeholder='Введите валюты'
                    onChange={handleInputChange}
                />
            </div>
        </SideModal>
    )
}

export default ExchangerSettingsModal;