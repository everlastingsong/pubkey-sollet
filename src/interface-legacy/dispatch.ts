import { PubkeySolletStandard } from "../core/wallet";
import { WalletRequest, WalletResponse } from "./types";
import { decodeTransaction } from "./util";

const UNKNOWN_REQUEST_METHOD_ERROR = "UNKNOWN REQUEST METHOD";

export async function dispatchRequest(pubkeySolletStandard: PubkeySolletStandard, message: WalletRequest): Promise<WalletResponse> {
  switch (message.method) {
    case "connect": return await handleConnect(pubkeySolletStandard, message);
    case "disconnect": return await handleDisconnect(pubkeySolletStandard, message);
    case "sign": return await handleSign(pubkeySolletStandard, message);
    case "signTransaction": return await handleSignTransaction(pubkeySolletStandard, message);
    case "signAllTransactions": return await handleSignAllTransactions(pubkeySolletStandard, message);
    default: return { id: message.id, error: UNKNOWN_REQUEST_METHOD_ERROR };
  }
}

const REJECT_SIGN_REQUEST_ERROR = "REJECT SIGN REQUEST";

async function handleConnect(pubkeySolletStandard: PubkeySolletStandard, message: WalletRequest): Promise<WalletResponse> {
  const response = await pubkeySolletStandard.connect();
  const pubkey = response.publicKey.toBase58();
  return {
    id: message.id,
    method: 'connected',
    params: {
      publicKey: pubkey,
      autoApprove: false,
    },
  };
}

async function handleDisconnect(pubkeySolletStandard: PubkeySolletStandard, message: WalletRequest): Promise<WalletResponse> {
  await pubkeySolletStandard.disconnect();
  return {
    id: message.id,
    method: 'disconnected',
  };
}

async function handleSign(pubkeySolletStandard: PubkeySolletStandard, message: WalletRequest): Promise<WalletResponse> {
  const data = message.params.data;
  if (data instanceof Uint8Array) {
    try {
      await pubkeySolletStandard.signMessage(data);
    } catch {}
  } else {
    console.log("data is not Uint8Array");
  }

  return {
    id: message.id,
    error: REJECT_SIGN_REQUEST_ERROR,
  };
}

async function handleSignTransaction(pubkeySolletStandard: PubkeySolletStandard, message: WalletRequest): Promise<WalletResponse> {
  try {
    const transaction = decodeTransaction(message.params.message);
    try {
      await pubkeySolletStandard.signTransaction(transaction);
    } catch {}
  } catch {
    console.log("failed to decode transaction");
  }

  return {
    id: message.id,
    error: REJECT_SIGN_REQUEST_ERROR,
  };
}

async function handleSignAllTransactions(pubkeySolletStandard: PubkeySolletStandard, message: WalletRequest): Promise<WalletResponse> {
  try {
    const transactions = (message.params.messages as string[]).map((m) => decodeTransaction(m));
    try {
      await pubkeySolletStandard.signAllTransactions(transactions);
    } catch {}
  } catch {
    console.log("failed to decode transactions");
  }

  return {
    id: message.id,
    error: REJECT_SIGN_REQUEST_ERROR,
  };
}
