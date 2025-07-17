import { ParsedTransaction } from "./tx-util";

export function updateLastTransactions(transactions: ParsedTransaction[]) {
  window.dispatchEvent(new CustomEvent("updateLastTransactions", {
    detail: JSON.stringify(transactions),
  }));
}
