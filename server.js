import dotenv from "dotenv";
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());

const DATA_GOV_BASE =
  "https://api.data.gov.in/resource/98fa254e-c5f8-4910-a19b-4828939b477d";

app.get("/api/hospitals", async (req, res) => {
  try {
    const { pincode } = req.query;

    const apiKey = process.env.DATA_GOV_API_KEY;

    if (!apiKey) {
      console.error("ERROR: DATA_GOV_API_KEY is not set in .env");
      return res
        .status(500)
        .json({ error: "DATA_GOV_API_KEY is not set in .env" });
    }

    const params = new URLSearchParams({
      "api-key": apiKey,
      format: "json",
      limit: "100",
      offset: "0"
    });

    // Apply pincode filter with the correct field name
    if (pincode) {
      params.append("filters[_pincode]", pincode);
    }

    const url = `${DATA_GOV_BASE}?${params.toString()}`;
    
    console.log("Fetching URL:", url);
    console.log("Searching for pincode:", pincode);

    const response = await fetch(url);
    const data = await response.json();

    console.log("Total records found:", data.records?.length || 0);

    res.json(data);
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});



// THIS WAS MISSING - Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
