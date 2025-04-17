const {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
} = require("@solana/web3.js");

const bs58 = require("bs58");

const privatekey =
  "3jynXYgaLzD5XTyReX7ZYCtp4uSZVtTMAPo7pQEvHSqu4iNjMrgZSzFm4RwGyXU7w1TdsJjeELrLN2C3k88Bk15U";

(async () => {
  try {
    // 1. Decode Base58 to get secret key Uint8Array
    const secretKey = bs58.decode(privatekey);
    const payer = Keypair.fromSecretKey(secretKey);

    // 2. Connect to Solana devnet
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    console.log("Wallet address:", payer.publicKey.toBase58());

    // 3. Request airdrop
    const airdropSignature = await connection.requestAirdrop(
      payer.publicKey,
      LAMPORTS_PER_SOL
    );

    console.log("Requesting airdrop...");

    // 4. Confirm transaction
    await connection.confirmTransaction(airdropSignature, "confirmed");

    console.log("✅ Airdrop complete!");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
})();
