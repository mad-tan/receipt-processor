const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");

const app = express();
const port = 4000;

app.use(bodyParser.json());

const receipts = {};
const receiptToId = new Map();

const calculatePoints = (receipt) => {
  let points = 0;

  points += (receipt.retailer.match(/[a-zA-Z0-9]/g) || []).length;

  if (parseFloat(receipt.total) % 1 === 0) points += 50;
  if (parseFloat(receipt.total) % 0.25 === 0) points += 25;

  points += Math.floor(receipt.items.length / 2) * 5;
  receipt.items.forEach((item) => {
    const trimmedDescLength = item.shortDescription.trim().length;
    if (trimmedDescLength % 3 === 0) {
      points += Math.ceil(parseFloat(item.price) * 0.2);
    }
  });

  const day = parseInt(receipt.purchaseDate.split("-")[2]);
  if (day % 2 !== 0) points += 6;

  const [hour] = receipt.purchaseTime.split(":").map(Number);
  if (hour === 14) points += 10;

  return points;
};

app.post("/receipts/process", (req, res) => {
  try {
    const receipt = req.body;

    if (
      !receipt.retailer ||
      !receipt.purchaseDate ||
      !receipt.purchaseTime ||
      !receipt.items ||
      !receipt.total
    ) {
      return res.status(400).json({ error: "Invalid receipt format" });
    }

    const serializedReceipt = JSON.stringify(receipt);

    if (receiptToId.has(serializedReceipt)) {
      const existingId = receiptToId.get(serializedReceipt);
      return res.status(200).json({ id: existingId });
    }

    const id = uuidv4();
    const points = calculatePoints(receipt);
    receipts[id] = points;

    receiptToId.set(serializedReceipt, id);

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ error: "Failed to process receipt" });
  }
});

app.get("/receipts/:id/points", (req, res) => {
  const id = req.params.id;
  if (receipts[id] !== undefined) {
    res.status(200).json({ points: receipts[id] });
  } else {
    res.status(404).json({ error: "Receipt not found" });
  }
});

app.listen(port, () => {
  console.log(`Receipt Processor running at http://localhost:${port}`);
});
