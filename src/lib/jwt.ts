import jwt from "jsonwebtoken";
import { isTokenExpired } from "./actions";
import { SendTokenPayloadCheck, RegisterTokenPayloadCheck } from "./types";

//CHAVE SUPER SECRETA
const JWT_SECRET = process.env.JWT_SECRET || "changeme";




//TESTES REMOVER DEPOIS
export type Payload = {
  creatorUser: string;
  to: string;
  amount: string;
  exp?: number; 
};

// Criação do JWT com expiração (5 min por padrão)
export function createToken(payload: Payload, expiresInSeconds = 300): string {
  const fullPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
  };

  return jwt.sign(fullPayload, JWT_SECRET);
}

//TESTES REMOVER DEPOIS







// Validação do JWT e tipagem segura do retorno

export function verifyJwtRegister(token: string): RegisterTokenPayloadCheck | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as RegisterTokenPayloadCheck;

    if (
      typeof decoded === "object" &&
      "discordId" in decoded &&
      "walletAddress" in decoded &&
      !isTokenExpired(decoded.exp)
    ) {
      return decoded;
    }

    return null;
  } catch {
    return null;
  }
}


export function verifyJwtSend(token: string): SendTokenPayloadCheck | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as SendTokenPayloadCheck;

    if (
      typeof decoded === "object" &&
      "creatorUser" in decoded &&
      "toDiscordId" in decoded &&
      "amount" in decoded &&
      !isTokenExpired(decoded.exp)
    ) {
      return decoded;
    }

    return null;
  } catch {
    return null;
  }
}