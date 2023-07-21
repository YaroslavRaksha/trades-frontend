import type { NextApiRequest, NextApiResponse } from 'next'
import {ExchangerType} from "../../../helpers/customTypings";
import backendApiInstance from "../../../utils/backendApiInstance";
import getApiError from "../../../helpers/getApiError";

type Data = {
    exchangerData?: ExchangerType,
    errorMessage?: string,
}

async function exchangerHandlerById(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    switch(req.method?.toUpperCase()) {
        case 'GET':
            try {
                const { id } = req.query;
                const { data } = await backendApiInstance.get('/exchanger/' + id);

                res.status(200).json({
                    ...data,
                    currencies: data?.currencies?.split(',')
                });
            }
            catch(err) {
                await getApiError(res, err)
            }
            break;
        case 'PUT':
            try {
                const { id } = req.query;
                const { date, address, currencies } = req.body;

                const { data } = await backendApiInstance.put('/exchanger/' + id, {
                    date: date,
                    address: address,
                    currencies: typeof currencies === 'object' ? currencies.join(',') : currencies,
                });

                res.status(200).json(data);
            }
            catch(err) {
                await getApiError(res, err)
            }
            break;
        case 'DELETE':
            try {
                const { id } = req.query;

                const { data } = await backendApiInstance.delete('/exchanger/' + id);

                res.status(200).json(data);
            }
            catch(err) {
                await getApiError(res, err)
            }
            break;
        default:
            res.status(405).json({ errorMessage: 'Method not allowed' });
    }

}

export default exchangerHandlerById;

{/*
    const exchangerData: ExchangerType = {
        id: 1,
        address: 'Тц Украина',
        currencies: ['$', '€', 'F', '£', 'zł'],
    };
*/}