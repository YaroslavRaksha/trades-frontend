
const getErrorMessage = (error: any) => {
    const errorMessage = error.response?.data?.errorMessage;
    return errorMessage || 'Internal Server Error'
};

export default getErrorMessage;