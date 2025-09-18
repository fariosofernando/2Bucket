import { type Request, type Response, type NextFunction } from "express";

export default function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["authorization"]?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  const validTokens = (process.env.VALID_TOKENS || "").split(",");

  if (!validTokens.includes(token)) {
    return res.status(403).json({ message: "Invalid token" });
  }

  next();
}
