const express = require("express");

const app = express();
const PORT = process.env.PORT || 5000;

app.get("/start-timer/:seconds", (req, res) => {
  const { seconds } = req.params;
  const timeInSeconds = parseInt(seconds);

  if (isNaN(timeInSeconds) || timeInSeconds <= 0) {
    return res
      .status(400)
      .json({ error: "Invalid time. Enter a positive number." });
  }

  console.log(`Timer started for ${timeInSeconds} seconds...`);

  setTimeout(() => {
    console.log(`Time elapsed: ${timeInSeconds} seconds`);
    res.json({ message: `Time elapsed: ${timeInSeconds} seconds` });
  }, timeInSeconds * 1000);
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
