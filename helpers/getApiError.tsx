

import { NextApiResponse } from 'next';

type Data = {
    errorMessage?: string;
};

const handleApiError = async (res: NextApiResponse<Data>, error: any) => {
    const { status, errorMessage } = getApiError(error);
    res.status(status).json({ errorMessage });
}

const getApiError = (err: any) => {
    const error = err?.response?.data?.error;
    const status = error?.status || 500;
    const errorMessage = error?.message || 'Internal server error ';

    return {
        status: status,
        errorMessage: errorMessage,
    }
};

export default handleApiError;