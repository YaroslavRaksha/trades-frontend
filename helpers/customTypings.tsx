

export type TradesDataType = {
    id: number,
    time: string,
    type: 'sale' | 'buy',
    amount: number,
    course: number | string,
    currency: string,
}

export type ExchangerType = {
    id: number,
    address: string,
    currencies: string[],
}

export type ExistenceType = {
    currency: string,
    amount: string,
}