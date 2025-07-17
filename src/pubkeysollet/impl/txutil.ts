import { Transaction, VersionedTransaction } from "@solana/web3.js";

const IX_DATA_CHUNK_SIZE = 16;

export type ParsedTransaction = {
  version: "legacy" | "V0";
  serialized: number[];
  instructions: {
    programId: string;
    keys: {
      isSigner: boolean;
      isWritable: boolean;
      pubkey: string;
    }[];
    data: number[];
  }[];
};

export function parseTransaction(transaction: Transaction | VersionedTransaction): ParsedTransaction {
  if (isVersionedTransaction(transaction)) {
    return parseVersionedTransaction(transaction);
  } else {
    return parseLegacyTransaction(transaction);
  }
}

function convertToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => {
    return (byte & 0xFF).toString(16).padStart(2, "0");
  }).join('');
}

function convertToBase64(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString("base64");
}

function isVersionedTransaction(transaction: Transaction | VersionedTransaction): transaction is VersionedTransaction {
  return "version" in transaction;
};

function parseLegacyTransaction(transaction: Transaction): ParsedTransaction {
  const version = "legacy";
  const serialized = Array.from(transaction.serialize({ requireAllSignatures: false, verifySignatures: false }));
  const instructions = transaction.instructions.map((ix) => ({
    programId: ix.programId.toBase58(),
    data: Array.from(ix.data),
    keys: ix.keys.map((key) => ({
      isSigner: key.isSigner,
      isWritable: key.isWritable,
      pubkey: key.pubkey.toBase58(),
    })),
  }));

  return {
    version,
    serialized,
    instructions,
  };
}

function parseVersionedTransaction(transaction: VersionedTransaction): ParsedTransaction {
  const message = transaction.message;
  const isSigner = message.isAccountSigner.bind(message);
  const isWritable = message.isAccountWritable.bind(message);

  // if ALTs are used, we cannot know the loaded pubkeys without fetching them.
  // we would like to avoid fetching them, so we just ALT <ALT ADDRESS>[<INDEX>] notation.
  const staticKeys = message.staticAccountKeys.map((k) => k.toBase58());
  const writableKeys: string[] = [];
  const readonlyKeys: string[] = [];
  message.addressTableLookups.forEach((alt) => {
    const altKey = alt.accountKey.toBase58();
    alt.writableIndexes.forEach((i) => writableKeys.push(`ALT ${altKey}[${i}]`));
    alt.readonlyIndexes.forEach((i) => readonlyKeys.push(`ALT ${altKey}[${i}]`));
  });
  const keys = [...staticKeys, ...writableKeys, ...readonlyKeys];

  const version = "V0";
  const serialized = Array.from(transaction.serialize());
  const instructions = transaction.message.compiledInstructions.map((ix) => ({
    programId: keys[ix.programIdIndex],
    data: Array.from(ix.data),
    keys: ix.accountKeyIndexes.map((keyIndex) => ({
      isSigner: isSigner(keyIndex),
      isWritable: isWritable(keyIndex),
      pubkey: keys[keyIndex],
    })),
  }));

  return {
    version,
    serialized,
    instructions,
  };
}

export function stringifyParsedTransaction(transaction: ParsedTransaction, index: number|null = null): string {
  let lines: string[] = [];

  lines.push(`version: ${transaction.version}`);
  lines.push(`size: ${transaction.serialized.length}`);

  transaction.instructions.forEach((ix, i) => {
    const prefix = index === null ? "" : `${index}.`;
    lines.push(`ix[${prefix}${i}]: ${ix.programId}`);

    lines.push(`  data`);
    for (let d=0; d<ix.data.length; d+=IX_DATA_CHUNK_SIZE) {
      const hex = convertToHex(new Uint8Array(ix.data.slice(d, d+IX_DATA_CHUNK_SIZE)));
      lines.push(`    ${hex}`);
    }

    lines.push(`  keys`);
    ix.keys.forEach((key, k) => {
      const signer = key.isSigner ? "s" : "-";
      const writable = key.isWritable ? "w" : "-";
      const rws = `r${writable}${signer}`;
      lines.push(`    ${k.toString().padStart(2, "0")}: ${rws} ${key.pubkey}`);
    });

    lines.push("");
  });

  const serializedBase64 = convertToBase64(new Uint8Array(transaction.serialized));
  lines.push(`serialized: ${serializedBase64}`);
  lines.push("");

  return lines.join("\n");
}
