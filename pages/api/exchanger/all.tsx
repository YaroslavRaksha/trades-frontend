import type { NextApiRequest, NextApiResponse } from 'next';
import backendApiInstance from '../../../utils/backendApiInstance';
import {ExchangerType} from "../../../helpers/customTypings";

type Data = {
    allExchangers: ExchangerType[],
}

async function AllExchangerHandler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const { data } = await backendApiInstance.get('/exchanger/all');
    return res.status(200).json(data);
}

export default AllExchangerHandler;