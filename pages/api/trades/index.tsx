import type { NextApiRequest, NextApiResponse } from 'next'
import backendApiInstance from "../../../utils/backendApiInstance";
import getApiError from "../../../helpers/getApiError";

type Data = {
    errorMessage?: string,
    ok?: boolean,
}

async function tradesHandler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    switch(req.method?.toUpperCase()) {
        case 'POST':
            try {
                const { exchangerId, type, currency, course, amount } = req.body;

                const { data } = await backendApiInstance.post('/trades', {
                    exchangerId: exchangerId,
                    type: type,
                    currency: currency,
                    course: course,
                    amount: amount,
                });

                res.status(200).json(data)
            }
            catch(err) {
                await getApiError(res, err);
            }
            break;
        case 'GET':
            try {
                const { exchangerId, date, currency, } = req.query;
                const { data } = await backendApiInstance.get(
                    `/trades?exchangerId=${exchangerId}&date=${date}` + (currency ? `&currency=${currency}` : '')
                );

                res.status(200).json(data);
            }
            catch(err) {
                await getApiError(res, err);
            }
            break;
        default:
            res.status(405).json({ errorMessage: 'Method not allowed' });
    }

}

export default tradesHandler;