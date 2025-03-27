import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export type Payload = {
  from: string;
  to: string;
  amount: string;
  exp?: number; // opcional porque será adicionado depois
};

// Criação do JWT com expiração (5 min por padrão)
export function createToken(payload: Payload, expiresInSeconds = 300): string {
  const fullPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
  };

  return jwt.sign(fullPayload, JWT_SECRET);
}

// Validação do JWT e tipagem segura do retorno
export function verifyToken(token: string): Payload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    if (
      typeof decoded === "object" &&
      decoded.from &&
      decoded.to &&
      decoded.amount
    ) {
      return {
        from: decoded.from as string,
        to: decoded.to as string,
        amount: decoded.amount as string,
        exp: decoded.exp,
      };
    }

    return null;
  } catch (err) {
    console.error("Token inválido:", err);
    return null;
  }
}


export interface RegisterJwtPayload {
  discordId: string;
  walletAddress: string;
  iat?: number;
  exp?: number;
}

export function verifyJwtRegister(token: string): RegisterJwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (
      typeof decoded === "object" &&
      decoded !== null &&
      "discordId" in decoded &&
      "walletAddress" in decoded
    ) {
      return decoded as RegisterJwtPayload;
    }

    return null;
  } catch {
    return null;
  }
}