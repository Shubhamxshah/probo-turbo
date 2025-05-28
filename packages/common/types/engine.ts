export interface Orderbook {
  "yes": tradeValues;
  "no": tradeValues;
}

interface tradeValues {
    "50" : number,
    "100" : number,
    "150" : number,
    "200" : number,
    "250" : number,
    "300" : number,
    "350" : number,
    "400" : number,
    "450" : number,
    "500" : number,
    "550" : number,
    "600" : number,
    "650" : number,
    "700" : number,
    "750" : number,
    "800" : number,
    "850" : number,
    "900" : number,
    "950" : number,
}

export interface Balances {
  available: number, 
  locked: number
}

export interface StockBalances {
  stockName: string, 
  available: number, 
  locked: number,
}


