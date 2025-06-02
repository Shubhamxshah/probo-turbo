export type ArchiverMessage = {
  type: 'balance';
  payload: {
    userId: string;
    available: number;
    locked: number;
  };
};
