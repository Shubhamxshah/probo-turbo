export interface Orderbook {
  YES: tradeValues;
  NO: tradeValues;
}

interface tradeValues {
  '50': PriceValue;
  '100': PriceValue;
  '150': PriceValue;
  '200': PriceValue;
  '250': PriceValue;
  '300': PriceValue;
  '350': PriceValue;
  '400': PriceValue;
  '450': PriceValue;
  '500': PriceValue;
  '550': PriceValue;
  '600': PriceValue;
  '650': PriceValue;
  '700': PriceValue;
  '750': PriceValue;
  '800': PriceValue;
  '850': PriceValue;
  '900': PriceValue;
  '950': PriceValue;
}

interface PriceValue {
  total: number;
  orders: tradeOrders[];
}

interface tradeOrders {
  userId: string;
  quantity: number;
  type: 'YES' | 'NO';
}

export interface Balances {
  available: number;
  locked: number;
}

export interface StockBalances {
  stockName: string;
  available: number;
  locked: number;
}
