import type { NextApiRequest, NextApiResponse } from 'next'
import backendApiInstance from "../../../utils/backendApiInstance";
import getApiError from "../../../helpers/getApiError";

type Data = {
    errorMessage?: string,
}

async function tradesByIdHandler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {

    switch(req.method?.toUpperCase()) {
        case 'PUT':
            try {
                const { id } = req.query;
                const { key, value } = req.body;

                const { data } = await backendApiInstance.put('/trades/' + id, {
                    key: key,
                    value: value,
                });

                res.status(200).json(data)
            }
            catch(err) {
                await getApiError(res, err)
            }
            break;
        case 'DELETE':
            try {
                const { id } = req.query;

                const { data } = await backendApiInstance.delete('/trades/' + id);

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

export default tradesByIdHandler;