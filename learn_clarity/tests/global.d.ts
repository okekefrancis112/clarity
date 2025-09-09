import '@hirosystems/clarinet-sdk';

declare global {
  interface Simnet {
    mineBlock(transactions: Array<{
      contract: string;
      method: string;
      args: any[];
      sender: string;
    }>): Array<{
      result: any;
      events: any[];
    }>;

    callReadOnlyFn(contract: string, method: string, args: any[], sender: string): any;
    getAccounts(): Map<string, string>;
  }
}

export {};