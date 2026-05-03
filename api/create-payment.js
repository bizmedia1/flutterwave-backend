export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { email, amount, name } = req.body;

    if (!email || !amount || !name) {
      return res.status(400).json({
        message: "Missing fields",
      });
    }

    const response = await fetch(
      "https://api.flutterwave.com/v3/payments",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tx_ref: `tx_${Date.now()}`,
          amount,
          currency: "NGN",
          redirect_url: "https://t.me/GlamourAgent01", // change later

          customer: {
            email,
            name,
          },

          customizations: {
            title: "Glm",
            description: "Subscription",
          },
        }),
      }
    );

    const data = await response.json();

    return res.status(200).json({
      link: data.data.link
    });

  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
}
