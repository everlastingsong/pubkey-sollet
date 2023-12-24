import { Transaction, Message } from "@solana/web3.js";
import * as bs58 from "bs58";

export function decodeTransaction(message: string): Transaction {
  const bytes = bs58.decode(message); // message passed is encoded in base58
  const decodedMessage = Message.from(bytes);
  const decodedTransaction = Transaction.populate(decodedMessage);
  return decodedTransaction;
}
