const bs58 = require("bs58");
const {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
} = require("@solana/web3.js");

const { createMint } = require("@solana/spl-token");

const base58PrivateKey =
  "3jynXYgaLzD5XTyReX7ZYCtp4uSZVtTMAPo7pQEvHSqu4iNjMrgZSzFm4RwGyXU7w1TdsJjeELrLN2C3k88Bk15U"; // Example only

(async () => {
  try {
    // 1. Decode base58 private key
    const secretKey = bs58.decode(base58PrivateKey);
    const payer = Keypair.fromSecretKey(secretKey);

    // 2. Connect to Solana Devnet
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    console.log("Wallet Address:", payer.publicKey.toBase58());

    // YOU CAN OPTION REQUEST FOR AIRDROP

    // 3. Create mint and authorities
    const mintAuthority = Keypair.generate();
    const freezeAuthority = Keypair.generate();

    const mint = await createMint(
      connection,
      payer,
      mintAuthority.publicKey,
      freezeAuthority.publicKey,
      9 // decimals
    );

    console.log("✅ Token Mint Created!");
    console.log("Mint Address:", mint.toBase58());
    console.log("Mint Authority:", mintAuthority.publicKey.toBase58());
    console.log("Freeze Authority:", freezeAuthority.publicKey.toBase58());
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
})();

/*

==> script  to mint token 



const { createMint } = require("@solana/spl-token");

const {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
} = require("@solana/web3.js");

const payer = Keypair.generate();
const mintAuthority = Keypair.generate();
const freezeAuthority = Keypair.generate();

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

const mint = await createMint(
  connection,
  payer,
  mintAuthority.publicKey,
  freezeAuthority.publicKey,
  9
);

console.log(mint.toBase58()); 

*/
