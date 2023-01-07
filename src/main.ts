import { decodeTransaction, dumpTransaction } from "./txutil";
import { WalletRequest, WalletResponse } from "./types";

const WALLET_NAME = "PubkeySollet";

const REJECT_SIGN_REQUEST_ERROR = "REJECT SIGN REQUEST";
const UNKNOWN_REQUEST_METHOD_ERROR = "UNKNOWN REQUEST METHOD";

function handleConnect(message: WalletRequest): WalletResponse {
  const pubkeyInput = window.prompt([
    WALLET_NAME + " connecting...",
    "",
    "Input wallet \"PublicKey\" in base58"
  ].join("\n"));
  const pubkey = (pubkeyInput ?? "").trim();

  console.log("pubkey", pubkey);

  return {
    id: message.id,
    method: 'connected',
    params: {
      publicKey: pubkey,
      autoApprove: false,
    },
  };
}

function handleDisconnect(message: WalletRequest): WalletResponse {
  return {
    id: message.id,
    method: 'disconnected',
  };
}

function handleSign(message: WalletRequest): WalletResponse {
  window.alert("sign requested! (will be cancelled)");

  return {
    id: message.id,
    error: REJECT_SIGN_REQUEST_ERROR,
  };
}

function handleSignTransaction(message: WalletRequest): WalletResponse {
  try {
    const transaction = decodeTransaction(message.params.message);
    console.log("raw transaction", transaction);
    console.log("transaction\n" + dumpTransaction(transaction));
  } catch {
    console.log("failed to decode transaction");
  }

  window.alert([
    "signTransaction requested!",
    "",
    "- transaction will be cancelled",
    "- transaction was dumped to console"
  ].join("\n"));

  return {
    id: message.id,
    error: REJECT_SIGN_REQUEST_ERROR,
  };
}

function handleSignAllTransactions(message: WalletRequest): WalletResponse {
  try {
    const transactions = message.params.messages.map((m) => decodeTransaction(m));
    console.log("raw transactions", transactions);
    transactions.forEach((t, i) => console.log(`transactions[${i}]\n` + dumpTransaction(t, i)));  
  } catch {
    console.log("failed to decode transactions");
  }

  const numTransactions = message.params.messages.length;
  window.alert([
    "signAllTransactions requested!",
    "",
    `- ${numTransactions} transaction(s)`,
    "- transactions will be cancelled",
    "- transactions were dumped to console"
  ].join("\n"));

  return {
    id: message.id,
    error: REJECT_SIGN_REQUEST_ERROR,
  };
}

function dispatchRequest(message: WalletRequest): WalletResponse {
  switch (message.method) {
    case "connect": return handleConnect(message);
    case "disconnect": return handleDisconnect(message);
    case "sign": return handleSign(message);
    case "signTransaction": return handleSignTransaction(message);
    case "signAllTransactions": return handleSignAllTransactions(message);
    default: return { id: message.id, error: UNKNOWN_REQUEST_METHOD_ERROR };
  }
}


// create window.sollet
window["sollet"] = {
  // reference: https://github.com/project-serum/sol-wallet-adapter/blob/master/src/index.ts
  postMessage: (message: WalletRequest) => {
    console.log("WalletRequest", message);
    const response = dispatchRequest(message);
    console.log("WalletResponse", response);
    window.postMessage(response);
  }
};