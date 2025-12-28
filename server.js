import dotenv from "dotenv";
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://hospitalsfinder.netlify.app"
  ],
  credentials: true
}));

const DATA_GOV_BASE =
  "https://api.data.gov.in/resource/98fa254e-c5f8-4910-a19b-4828939b477d";

// Root route - THIS WAS MISSING!
app.get("/", (req, res) => {
  res.json({ 
    message: "Hospital Finder API is running!",
    status: "healthy",
    endpoints: {
      hospitals: "/api/hospitals?pincode=800001"
    }
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Hospitals API endpoint
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

    if (pincode) {
      params.append("filters[_pincode]", pincode);
    }

    const url = `${DATA_GOV_BASE}?${params.toString()}`;
    
    console.log("Fetching from data.gov.in");
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

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ 
    error: "Not Found",
    message: `Cannot ${req.method} ${req.path}`,
    availableEndpoints: ["/", "/api/hospitals"]
  });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
