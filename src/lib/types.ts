export interface AddressByDiscordIdReturn {
    WalletAddress: string
}
export interface SendTokenPayloadCheck {
    creatorUser: string;
    toDiscordId: string;
    amount: string;


    coinType?: string;
    threadId?: string;
    channelId?: string;
    iat?: number;
    exp?: number;
}



export interface RegisterTokenPayloadCheck {
    discordId: string;
    walletAddress: string;
    
    coinType?: string;
    threadId?: string;
    channelId?: string;
    iat?: number;
    exp?: number;
}