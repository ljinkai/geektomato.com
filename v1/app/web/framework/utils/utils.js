const COIN_COINFIG = {
    'USD': '$',
    'CNY': '¥',
    'VND': '₫',
    'EUR': '€',
    'KRW': '₩',
    'JPY': '¥',
    'IDR': 'Rp',
    'RUB': '₽',
    'INR': '₹',
    'GBP': '£'
}

export function removeHTML(input) {
    return input
}

export function formatDate(input) {
    return input
}

export function getCoinSymbol(coinName) {
    return COIN_COINFIG[coinName]
}
