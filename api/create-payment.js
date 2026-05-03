const axios = require("axios");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // FIX: Ensure body is parsed
    let body = req.body;

    if (!body || typeof body === "string") {
      body = JSON.parse(body || "{}");
    }

    const { email, amount, name } = body;

    if (!email || !amount || !name) {
      return res.status(400).json({
        error: "Missing email, amount or name"
      });
    }

    const response = await axios.post(
      "https://api.flutterwave.com/v3/payments",
      {
        tx_ref: "tx_" + Date.now(),
        amount,
        currency: "NGN",
        redirect_url: "https://your-site.com/success",

        customer: {
          email,
          name
        },

        customizations: {
          title: "My Business",
          description: "Payment",
          logo: "https://via.placeholder.com/150"
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return res.status(200).json({
      link: response.data.data.link
    });

  } catch (error) {
    return res.status(500).json({
      error: error.response?.data || error.message
    });
  }
};
