import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json({ message: "Access denied (authmiddleware)" });
  }

  jwt.verify(token, "your_secret_key", (err, user) => {
    if (err) return res.status(403).json({ message: "Connexion expirée" });
    req.user = user;
    next();
  });
};

export default authenticateToken;
