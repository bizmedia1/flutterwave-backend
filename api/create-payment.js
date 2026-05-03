export default function handler(req, res) {
  return res.status(200).json({
    message: "NEW CODE IS RUNNING",
    method: req.method,
    body: req.body || null
  });
}
