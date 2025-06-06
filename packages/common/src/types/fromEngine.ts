export type MessageFromEngine = {
  type: string,
  status: number,
  payload: {
    simpleres?: string,
    available?: number,
    locked?: number
  }
} 
