export type WalletRequest = {
  id: number,
  method: string,
  params: any,
}

export type WalletResponse = {
  id: number,
  method?: string,
  result?: string,
  error?: string,
  params?: {
    publicKey: string,
    autoApprove: boolean,
  }
}
