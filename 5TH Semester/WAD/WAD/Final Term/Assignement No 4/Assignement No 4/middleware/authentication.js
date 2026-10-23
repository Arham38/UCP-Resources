const jwt = require("jsonwebtoken");
const secret = "arham";

const authenticationMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) return res.status(401).json({ message: "No token, access denied" });

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // { id, role, email }
    next();
  } catch (err) {
    console.log("JWT ERROR:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authenticationMiddleware;
