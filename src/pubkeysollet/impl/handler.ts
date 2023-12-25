import { PublicKey, Transaction, VersionedTransaction, TransactionSignature, SendOptions } from "@solana/web3.js";
import { type SolanaSignInInput, type SolanaSignInOutput } from '@solana/wallet-standard-features';
import { dumpTransaction } from "./txutil";

const WALLET_NAME = "PubkeySollet";

const REJECT_SIGN_REQUEST_ERROR = "REJECT SIGN REQUEST";

export async function handleConnect(): Promise<{ publicKey: PublicKey }> {
  const pubkeyInput = window.prompt([
    WALLET_NAME + " connecting...",
    "",
    "Input wallet \"PublicKey\" in base58"
  ].join("\n"));
  const pubkey = (pubkeyInput ?? "").trim();

  console.log("pubkey", pubkey);
  return {
    publicKey: new PublicKey(pubkey),
  }
}

export async function handleDisconnect() {
  // nop
}

export async function handleSignMessage(message: Uint8Array): Promise<{ signature: Uint8Array }> {
  try {
    const decoded = new TextDecoder(undefined, {fatal: true}).decode(message);
    console.log("message\n" + decoded);
  } catch {
    console.log("failed to decode message as utf-8 string");
  }

  window.alert([
    "signMessage requested!",
    "",
    "- message will be rejected",
    "- message was dumped to console"
  ].join("\n"));

  throw new Error(REJECT_SIGN_REQUEST_ERROR);
}

export async function handleSignTransaction<T extends Transaction | VersionedTransaction>(transaction: T): Promise<T> {
  console.log("transaction\n" + dumpTransaction(transaction));

  window.alert([
    "signTransaction requested!",
    "",
    "- transaction will be rejected",
    "- transaction was dumped to console"
  ].join("\n"));

  throw new Error(REJECT_SIGN_REQUEST_ERROR);
}

export async function handleSignAllTransactions<T extends Transaction | VersionedTransaction>(transactions: T[]): Promise<T[]> {
  transactions.forEach((t, i) => console.log(`transactions[${i}]\n` + dumpTransaction(t, i)));

  const numTransactions = transactions.length;
  window.alert([
    "signAllTransactions requested!",
    "",
    `- ${numTransactions} transaction(s)`,
    "- transactions will be rejected",
    "- transactions were dumped to console"
  ].join("\n"));

  throw new Error(REJECT_SIGN_REQUEST_ERROR);
}

export async function handleSignAndSendTransaction<T extends Transaction | VersionedTransaction>(
  transaction: T,
  options?: SendOptions
): Promise<{ signature: TransactionSignature }> {
  console.log("transaction\n" + dumpTransaction(transaction));

  window.alert([
    "signTransactionAndSendTransaction requested!",
    "",
    "- transaction will be rejected",
    "- transaction was dumped to console"
  ].join("\n"));

  throw new Error(REJECT_SIGN_REQUEST_ERROR);
}

export async function handleSignIn(input?: SolanaSignInInput): Promise<SolanaSignInOutput> {
  console.log("input\n" + JSON.stringify(input, null, 2));

  window.alert([
    "signIn requested!",
    "",
    "- sign-in request will be rejected",
    "- sign-in request was dumped to console"
  ].join("\n"));

  throw new Error(REJECT_SIGN_REQUEST_ERROR);
}
