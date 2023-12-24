import { Transaction, VersionedTransaction } from "@solana/web3.js";

const IX_DATA_CHUNK_SIZE = 32

function convertToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => {
    return (byte & 0xFF).toString(16).padStart(2, "0");
  }).join('');
}

function isVersionedTransaction(transaction: Transaction | VersionedTransaction): transaction is VersionedTransaction {
  return "version" in transaction;
};

export function dumpTransaction(transaction: Transaction | VersionedTransaction, index: number|null = null): string {
  if (isVersionedTransaction(transaction)) {
    return dumpVersionedTransaction(transaction, index);
  } else {
    return dumpLegacyTransaction(transaction, index);
  }
}

function dumpLegacyTransaction(transaction: Transaction, index: number|null = null): string {
  let lines: string[] = [];

  lines.push(`version: not versioned transaction (legacy)`);

  transaction.instructions.forEach((ix, i) => {
    const prefix = index === null ? "" : `${index}.`;
    lines.push(`${prefix}${i}: ${ix.programId.toBase58()}`);

    lines.push(`  data`);
    for (let d=0; d<ix.data.length; d+=IX_DATA_CHUNK_SIZE) {
      const hex = convertToHex(ix.data.slice(d, d+IX_DATA_CHUNK_SIZE));
      lines.push(`    ${hex}`);
    }

    lines.push(`  keys`);
    ix.keys.forEach((key, k) => {
      const signer = key.isSigner ? "s" : "-";
      const writable = key.isWritable ? "w" : "-";
      const rws = `r${writable}${signer}`;
      lines.push(`    ${k.toString().padStart(2, "0")}: ${rws} ${key.pubkey.toBase58()}`);
    });

    lines.push("");
  });
  return lines.join("\n");
}

function dumpVersionedTransaction(transaction: VersionedTransaction, index: number|null = null): string {
  const message = transaction.message;
  const isSigner = message.isAccountSigner.bind(message);
  const isWritable = message.isAccountWritable.bind(message);

  let lines: string[] = [];

  lines.push(`version: ${transaction.version}`);

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

  transaction.message.compiledInstructions.forEach((ix, i) => {
    const prefix = index === null ? "" : `${index}.`;
    lines.push(`${prefix}${i}: ${keys[ix.programIdIndex]}`);

    lines.push(`  data`);
    for (let d=0; d<ix.data.length; d+=IX_DATA_CHUNK_SIZE) {
      const hex = convertToHex(ix.data.slice(d, d+IX_DATA_CHUNK_SIZE));
      lines.push(`    ${hex}`);
    }

    lines.push(`  keys`);
    ix.accountKeyIndexes.forEach((keyIndex, k) => {
      const signer = isSigner(keyIndex) ? "s" : "-";
      const writable = isWritable(keyIndex) ? "w" : "-";
      const rws = `r${writable}${signer}`;
      lines.push(`    ${k.toString().padStart(2, "0")}: ${rws} ${keys[keyIndex]}`);
    });

    lines.push("");
  });

  return lines.join("\n");
}