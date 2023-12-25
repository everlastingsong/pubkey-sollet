import { type SolanaSignInInput, type SolanaSignInOutput } from '@solana/wallet-standard-features';
import { PublicKey, SendOptions, Transaction, TransactionSignature, VersionedTransaction } from '@solana/web3.js';
import { PubkeySolletStandard, PubkeySolletStandardEvent } from '../wallet';
import {
    handleConnect,
    handleDisconnect,
    handleSignMessage,
    handleSignTransaction,
    handleSignAllTransactions,
    handleSignAndSendTransaction,
    handleSignIn,
} from './handler';

export type FrequentlyUsedPubkey = {
    nickname: string;
    pubkey: string;
};

export type PubkeySolletConfig = {
    frequentlyUsedPubkeys?: FrequentlyUsedPubkey[];
}

export type PubkeySolletSanitizedConfig = {
    frequentlyUsedPubkeys: FrequentlyUsedPubkey[];
}

export class PubkeySolletStandardImpl implements PubkeySolletStandard {
    private sanitizedConfig: PubkeySolletSanitizedConfig;

    constructor(config: PubkeySolletConfig) {
        const isValidPubkey = (pubkey: string) => {
            try {
                new PublicKey(pubkey);
                return true;
            } catch {
                return false;
            }
        }

        this.sanitizedConfig = {
            frequentlyUsedPubkeys: (config.frequentlyUsedPubkeys ?? [])
                .map(({ nickname, pubkey }) => ({ nickname: nickname.trim(), pubkey: pubkey.trim() }))
                .filter(({ nickname, pubkey }) => isValidPubkey(pubkey)),
        };
    }

    // implement for PubkeySolletStandardEventEmitter
    private listeners: Map<keyof PubkeySolletStandardEvent, Set<PubkeySolletStandardEvent[keyof PubkeySolletStandardEvent]>> = new Map();
    on<E extends keyof PubkeySolletStandardEvent>(event: E, listener: PubkeySolletStandardEvent[E], context?: any) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event).add(listener);
    }
    off<E extends keyof PubkeySolletStandardEvent>(event: E, listener: PubkeySolletStandardEvent[E], context?: any) {
        if (!this.listeners.has(event)) {
            return;
        }
        this.listeners.get(event).delete(listener);
    }
    private emit<E extends keyof PubkeySolletStandardEvent>(event: E, ...args: Parameters<PubkeySolletStandardEvent[E]>) {
        if (!this.listeners.has(event)) {
            return;
        }
        for (const listener of this.listeners.get(event)) {
            listener(...args);
        }
    }

    // implement for PubkeySolletStandard
    publicKey: PublicKey | null;

    async connect(options?: { onlyIfTrusted?: boolean }): Promise<{ publicKey: PublicKey }> {
        console.log("connect called");
        const response = await handleConnect(this.sanitizedConfig);
        this.publicKey = response.publicKey;
        this.emit('connect');
        return { publicKey: this.publicKey };
    }

    async disconnect(): Promise<void> {
        console.log("disconnect called");
        await handleDisconnect();
        this.publicKey = null;
        this.emit('disconnect');
    }

    async signTransaction<T extends Transaction | VersionedTransaction>(transaction: T): Promise<T> {
        console.log("signTransaction called");
        return await handleSignTransaction(transaction); // always throw error
    }
    async signAllTransactions<T extends Transaction | VersionedTransaction>(transactions: T[]): Promise<T[]> {
        console.log("signAllTransactions called");
        return await handleSignAllTransactions(transactions); // always throw error
    }
    async signMessage(message: Uint8Array): Promise<{ signature: Uint8Array }> {
        console.log("signMessage called");
        return await handleSignMessage(message); // always throw error
    }
    async signAndSendTransaction<T extends Transaction | VersionedTransaction>(
        transaction: T,
        options?: SendOptions
    ): Promise<{ signature: TransactionSignature }> {
        console.log("signAndSendTransaction called");
        return await handleSignAndSendTransaction(transaction, options); // always throw error
    }
    async signIn(input?: SolanaSignInInput): Promise<SolanaSignInOutput> {
        console.log("signIn called");
        return await handleSignIn(input); // always throw error
    }
}
