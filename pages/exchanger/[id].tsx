import ExchangerPage from "../../components/exchangerPage";
import nextApiInstance from '../../utils/nextApiInstance';
import getErrorMessage from "../../helpers/getErrorMessage";

export default function Exchanger({ exchangerData, errorMessage }: any) {

    return (
        <ExchangerPage
            exchangerData={exchangerData}
            errorMessage={errorMessage}
        />
    );
}

export async function getServerSideProps(context: any) {
    const { id } = context.params;
    let exchangerData;
    let errorMessage;

    try {

        const exchangerResponse = await nextApiInstance.get('/api/exchanger/' + id);
        exchangerData = exchangerResponse?.data;
        console.log(exchangerData);

    } catch (err) {
        errorMessage = getErrorMessage(err);
    }

    return {
        props: {
            exchangerData: {
                id: id,
                ...exchangerData || {},
            },
            errorMessage: errorMessage || false,
        },
    };
}