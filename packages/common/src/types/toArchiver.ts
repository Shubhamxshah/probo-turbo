export type ArchiverMessage = {
  type: 'balance';
  payload: {
    userId: string;
    available: number;
    locked: number;
  };
} | {
  type: "mint";
  payload: {
    userId: string,
    event: string, 
    balanceAvailable: number, 
    yesStockAvailable: number, 
    noStockAvailable: number
  }
};
