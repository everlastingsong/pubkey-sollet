import { registerWallet } from './register';
import { PubkeySolletStandardWallet } from './wallet';
import { PubkeySolletStandard } from '../pubkeysollet/wallet';

export function initializeStandardInterface(pubkeySolletStandard: PubkeySolletStandard): void {
    registerWallet(new PubkeySolletStandardWallet(pubkeySolletStandard));
}
