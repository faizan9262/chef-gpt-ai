import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface TokenPayload {
  id: string;
  email: string;
}

interface JwtPayload {
  id: string;
  email: string;
  iat?: number;
  exp?: number;
}

export const createToken = (
  id: string,
  email: string,
  expiresIn: number
): string => {
  const payload: TokenPayload = { id, email };

  const secret: Secret | undefined = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  const options: SignOptions = {
    expiresIn,
  };

  const token = jwt.sign(payload, secret, options);
  return token;
};



export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.signedCookies["auth-cookie"];

    if (!token || token.trim() === "") {
      return res.status(401).json({ message: "Token Not Received" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    res.locals.jwtData = decoded;
    return next();
  } catch (err: any) {
    console.error("Token verification failed:", err.message);
    return res.status(401).json({ message: "Token Expired or Invalid" });
  }
};
