import IndexPage from "../components/IndexPage";
import nextApiInstance from "../utils/nextApiInstance";

export default function Index({ allExchangers }: any) {
    return (
        <IndexPage
            allExchangers={allExchangers}
        />
    )
}

export async function getServerSideProps(context: any) {
    const { data } = await nextApiInstance.get('/exchanger/all');

    return {
        props: {
            allExchangers: data,
        },
    };
}