export interface Orderbook {
  YES: {
    bids: tradeValues;
    asks: tradeValues;
  };
  NO: {
    bids: tradeValues;
    asks: tradeValues;
  };
}

export type WsMessage = {
  YES: {
    asks: tradeTotal;
  };
  NO: {
    asks: tradeTotal;
  };
};

export type tradeTotal = Record<string, number>

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
}

export interface Balances {
  available: number;
  locked: number;
}

export interface StockBalances {
  [stockName: string]: {
    YES: {
      available: number;
      locked: number;
    };
    NO: {
      available: number;
      locked: number;
    };
  };
}

export const eventInitialize = {
  YES: {
    bids: {
      '50': {
        total: 0,
        orders: [],
      },
      '100': {
        total: 0,
        orders: [],
      },
      '150': {
        total: 0,
        orders: [],
      },
      '200': {
        total: 0,
        orders: [],
      },
      '250': {
        total: 0,
        orders: [],
      },
      '300': {
        total: 0,
        orders: [],
      },
      '350': {
        total: 0,
        orders: [],
      },
      '400': {
        total: 0,
        orders: [],
      },
      '450': {
        total: 0,
        orders: [],
      },
      '500': {
        total: 0,
        orders: [],
      },
      '550': {
        total: 0,
        orders: [],
      },
      '600': {
        total: 0,
        orders: [],
      },
      '650': {
        total: 0,
        orders: [],
      },
      '700': {
        total: 0,
        orders: [],
      },
      '750': {
        total: 0,
        orders: [],
      },
      '800': {
        total: 0,
        orders: [],
      },
      '850': {
        total: 0,
        orders: [],
      },
      '900': {
        total: 0,
        orders: [],
      },
      '950': {
        total: 0,
        orders: [],
      },
    },
    asks: {
      '50': {
        total: 0,
        orders: [],
      },
      '100': {
        total: 0,
        orders: [],
      },
      '150': {
        total: 0,
        orders: [],
      },
      '200': {
        total: 0,
        orders: [],
      },
      '250': {
        total: 0,
        orders: [],
      },
      '300': {
        total: 0,
        orders: [],
      },
      '350': {
        total: 0,
        orders: [],
      },
      '400': {
        total: 0,
        orders: [],
      },
      '450': {
        total: 0,
        orders: [],
      },
      '500': {
        total: 0,
        orders: [],
      },
      '550': {
        total: 0,
        orders: [],
      },
      '600': {
        total: 0,
        orders: [],
      },
      '650': {
        total: 0,
        orders: [],
      },
      '700': {
        total: 0,
        orders: [],
      },
      '750': {
        total: 0,
        orders: [],
      },
      '800': {
        total: 0,
        orders: [],
      },
      '850': {
        total: 0,
        orders: [],
      },
      '900': {
        total: 0,
        orders: [],
      },
      '950': {
        total: 0,
        orders: [],
      },
    },
  },
  NO: {
    bids: {
      '50': {
        total: 0,
        orders: [],
      },
      '100': {
        total: 0,
        orders: [],
      },
      '150': {
        total: 0,
        orders: [],
      },
      '200': {
        total: 0,
        orders: [],
      },
      '250': {
        total: 0,
        orders: [],
      },
      '300': {
        total: 0,
        orders: [],
      },
      '350': {
        total: 0,
        orders: [],
      },
      '400': {
        total: 0,
        orders: [],
      },
      '450': {
        total: 0,
        orders: [],
      },
      '500': {
        total: 0,
        orders: [],
      },
      '550': {
        total: 0,
        orders: [],
      },
      '600': {
        total: 0,
        orders: [],
      },
      '650': {
        total: 0,
        orders: [],
      },
      '700': {
        total: 0,
        orders: [],
      },
      '750': {
        total: 0,
        orders: [],
      },
      '800': {
        total: 0,
        orders: [],
      },
      '850': {
        total: 0,
        orders: [],
      },
      '900': {
        total: 0,
        orders: [],
      },
      '950': {
        total: 0,
        orders: [],
      },
    },
    asks: {
      '50': {
        total: 0,
        orders: [],
      },
      '100': {
        total: 0,
        orders: [],
      },
      '150': {
        total: 0,
        orders: [],
      },
      '200': {
        total: 0,
        orders: [],
      },
      '250': {
        total: 0,
        orders: [],
      },
      '300': {
        total: 0,
        orders: [],
      },
      '350': {
        total: 0,
        orders: [],
      },
      '400': {
        total: 0,
        orders: [],
      },
      '450': {
        total: 0,
        orders: [],
      },
      '500': {
        total: 0,
        orders: [],
      },
      '550': {
        total: 0,
        orders: [],
      },
      '600': {
        total: 0,
        orders: [],
      },
      '650': {
        total: 0,
        orders: [],
      },
      '700': {
        total: 0,
        orders: [],
      },
      '750': {
        total: 0,
        orders: [],
      },
      '800': {
        total: 0,
        orders: [],
      },
      '850': {
        total: 0,
        orders: [],
      },
      '900': {
        total: 0,
        orders: [],
      },
      '950': {
        total: 0,
        orders: [],
      },
    },
  },
};

export const allowedPrices = [
  '50',
  '100',
  '150',
  '200',
  '250',
  '300',
  '350',
  '400',
  '450',
  '500',
  '550',
  '600',
  '650',
  '700',
  '750',
  '800',
  '850',
  '900',
  '950',
] as const;

// Type derived from the values of the array
export type AllowedPrice = (typeof allowedPrices)[number];
