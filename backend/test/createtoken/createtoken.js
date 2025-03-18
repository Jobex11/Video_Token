const express = require("express");
const dotenv = require("dotenv");
const { Connection, Keypair, PublicKey } = require("@solana/web3.js");
const {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} = require("@solana/spl-token");
const bs58 = require("bs58");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Solana Devnet
const connection = new Connection("https://api.devnet.solana.com", "confirmed");

// Load wallet from .env
const wallet = Keypair.fromSecretKey(bs58.decode(process.env.WALLET_SECRET));

app.get("/create-token/:symbol/:name/:supply", async (req, res) => {
  try {
    const { symbol, name, supply } = req.params;
    const decimals = 9; // Default decimals

    if (!symbol || !name || !supply) {
      return res
        .status(400)
        .json({ error: "Missing required parameters (symbol, name, supply)" });
    }

    // Convert supply to proper format
    const supplyAmount = parseInt(supply) * Math.pow(10, decimals);

    // Create SPL Token Mint
    const mint = await createMint(
      connection,
      wallet,
      wallet.publicKey,
      null,
      decimals
    );
    console.log(
      `Token Created: ${mint.toBase58()} | Name: ${name} | Symbol: ${symbol}`
    );

    // Get or Create Associated Token Account (ATA)
    const ata = await getOrCreateAssociatedTokenAccount(
      connection,
      wallet,
      mint,
      wallet.publicKey
    );

    // Mint Tokens
    await mintTo(
      connection,
      wallet,
      mint,
      ata.address,
      wallet.publicKey,
      supplyAmount
    );
    console.log(
      `Minted ${supply} ${symbol} (${name}) tokens to ${ata.address.toBase58()}`
    );

    res.json({
      success: true,
      name,
      symbol,
      supply,
      mintAddress: mint.toBase58(),
      tokenAccount: ata.address.toBase58(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create token" });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
