export function isTokenExpired(iat?: number, exp?: number): boolean {
    if (!iat || !exp) return true;
  
    const currentTime = Math.floor(Date.now() / 1000); // tempo atual em segundos
  
    return currentTime >= exp;
}