import { PubkeySolletStandardImpl, PubkeySolletConfig } from "./pubkeysollet/impl/wallet-impl";
import { initializeLegacyInterface } from "./interface-legacy";
import { initializeStandardInterface } from "./interface-standard";

// only contentscript.js can access chrome.storage.local, so we need to receive it via attribute.
const configString = document.currentScript.getAttribute("config");
const config = JSON.parse(configString) as PubkeySolletConfig;

const pubkeySolletStandard = new PubkeySolletStandardImpl(config);
initializeLegacyInterface(pubkeySolletStandard);
initializeStandardInterface(pubkeySolletStandard);
