import type { NextApiRequest, NextApiResponse } from 'next';
import backendApiInstance from '../../../utils/backendApiInstance';
import getApiError from "../../../helpers/getApiError";

type Data = {
    errorMessage?: string,
    ok?: boolean,
}

async function IndexExchangerHandler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {

    switch(req.method?.toUpperCase()) {
        case 'POST':
            try {
                const { address, currencies } = req.body;

                const { data } = await backendApiInstance.post('/exchanger', {
                    address: address,
                    currencies: currencies,
                });

                res.status(200).json(data)
            }
            catch(err) {
                await getApiError(res, err)
            }
            break;
        default:
            res.status(405).json({ errorMessage: 'Method not allowed' });
    }
}

export default IndexExchangerHandler;