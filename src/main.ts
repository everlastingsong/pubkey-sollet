import { PubkeySolletStandardImpl } from "./pubkeysollet/impl/wallet-impl";
import { initializeLegacyInterface } from "./interface-legacy";
import { initializeStandardInterface } from "./interface-standard";

const pubkeySolletStandard = new PubkeySolletStandardImpl();
initializeLegacyInterface(pubkeySolletStandard);
initializeStandardInterface(pubkeySolletStandard);
