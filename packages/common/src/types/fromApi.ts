import type { AllowedPrice } from "./engine"

export type MessageFromApi = {
  type: "create_user", 
  payload: {
    userId: string
  }
} | {
  type: "create_event", 
  payload: {
    eventName: string 
  }
} | {
  type: "add_money", 
  payload: {
    userId: string,
    amount: number
  }
} | {
  type: "check_balance", 
  payload: {
    userId: string
  }
} | {
  type: "mint_tokens", 
  payload: {
    userId: string, 
    event: string, 
    noOfTokens: number
  }
} | {
  type: "buy_tokens", 
  payload: {
    userId: string, 
    event: string, 
    noOfTokens: number, 
    type: YesNo, 
    price: AllowedPrice
  }
} | {
  type: "sell_tokens", 
  payload: {
    userId: string, 
    event: string, 
    noOfTokens: number, 
    type: YesNo, 
    price: AllowedPrice
  }
} | {
  type: "reset"
}

export type YesNo = "YES" | "NO"

