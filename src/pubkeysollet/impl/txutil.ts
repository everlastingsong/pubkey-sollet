import { Transaction } from "@solana/web3.js";

const IX_DATA_CHUNK_SIZE = 32

function convertToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('');
}

export function dumpTransaction(transaction: Transaction, index: number|null = null): string {
  let lines: string[] = [];
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
      const signer = key.isSigner ? " [signer]" : "";
      const writable = key.isWritable ? " [writable]" : "";
      lines.push(`    ${k}: ${key.pubkey.toBase58()}${signer}${writable}`);
    });

    lines.push("");
  });
  return lines.join("\n");
}
