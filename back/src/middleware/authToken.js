import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  const token = req.cookies.accessToken; // Récupérer le token depuis les cookies
  if (!token)
    return res.status(401).json({ message: "Access denied (authmiddleware)" });

  jwt.verify(token, "your_secret_key", (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

export default authenticateToken;
