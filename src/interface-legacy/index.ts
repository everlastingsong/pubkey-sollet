import { PubkeySolletStandard } from "../pubkeysollet/wallet";
import { WalletRequest } from "./types";
import { dispatchRequest } from "./dispatch";

export function initializeLegacyInterface(pubkeySolletStandard: PubkeySolletStandard) {
  // create window.sollet
  window["sollet"] = {
    // reference: https://github.com/project-serum/sol-wallet-adapter/blob/master/src/index.ts
    postMessage: async (message: WalletRequest) => {
      console.log("WalletRequest", message);
      const response = await dispatchRequest(pubkeySolletStandard, message);
      console.log("WalletResponse", response);
      window.postMessage(response);
    }
  };
}
