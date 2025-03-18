require("dotenv").config();
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const Arweave = require("arweave");
const {
  Keypair,
  Connection,
  clusterApiUrl,
  PublicKey,
} = require("@solana/web3.js");
const {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  TOKEN_PROGRAM_ID,
} = require("@solana/spl-token");
const { Metaplex, bundlrStorage, keypairIdentity } = require("@metaplex/js");

// Load Solana keypair from a file
const wallet = Keypair.fromSecretKey(
  Uint8Array.from(JSON.parse(fs.readFileSync("./wallet.json", "utf-8")))
);

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// Configure Arweave (for storing video metadata)
const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
});

// Setup Express
const app = express();
const upload = multer({ dest: "uploads/" });

app.post("/create-token", upload.single("video"), async (req, res) => {
  try {
    const { name, symbol, supply } = req.body;
    const videoFile = req.file;

    if (!videoFile) {
      return res.status(400).json({ error: "No video file uploaded." });
    }

    // Step 1: Upload Video to Arweave
    const videoData = fs.readFileSync(videoFile.path);
    const transaction = await arweave.createTransaction({ data: videoData });
    transaction.addTag("Content-Type", "video/mp4"); // Change if using GIF or WebP

    await arweave.transactions.sign(transaction, wallet.secretKey);
    await arweave.transactions.post(transaction);
    const videoUrl = `https://arweave.net/${transaction.id}`;

    // Step 2: Mint SPL Token
    const mint = await createMint(
      connection,
      wallet,
      wallet.publicKey,
      null,
      9
    );
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      wallet,
      mint,
      wallet.publicKey
    );

    await mintTo(
      connection,
      wallet,
      mint,
      tokenAccount.address,
      wallet.publicKey,
      supply * Math.pow(10, 9)
    );

    // Step 3: Attach Video Metadata (Metaplex)
    const metaplex = Metaplex.make(connection)
      .use(keypairIdentity(wallet))
      .use(bundlrStorage());

    const { uri } = await metaplex.nfts().uploadMetadata({
      name,
      symbol,
      image: videoUrl, // Link to video instead of static image
      animation_url: videoUrl, // For animated metadata support
    });

    await metaplex.nfts().create({
      uri,
      name,
      symbol,
      sellerFeeBasisPoints: 0,
      creators: [{ address: wallet.publicKey, share: 100 }],
      mintAddress: mint,
    });

    // Cleanup temporary video file
    fs.unlinkSync(videoFile.path);

    res.json({ success: true, mint: mint.toBase58(), videoUrl });
  } catch (error) {
    console.error("Error creating token:", error);
    res.status(500).json({ error: "Failed to create video token." });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
