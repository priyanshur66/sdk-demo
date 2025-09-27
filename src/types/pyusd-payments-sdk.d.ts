declare module 'pyusd-payments-sdk' {
  export class HaloClient {
    constructor(config: {
      rpcUrl: string;
      network: string;
      recipient: string;
    });

    getWalletAddress(): Promise<string>;
    getPyusdBalance(address: string): Promise<string>;
    makePayment(senderAddress: string, config: { amount: string }): Promise<string>;
    broadcastTransaction(signedTx: string): Promise<{ success: boolean; txHash?: string; error?: string }>;
  }
}
