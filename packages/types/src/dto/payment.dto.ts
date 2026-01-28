export interface CreatePaymentDTO {
  bookingId: string;
  amount: number;
  currency: string;
  method: string;
}

export interface TopUpWalletDTO {
  amount: number;
  currency: string;
}

export interface SplitPaymentDTO {
  bookingId: string;
  splitType: 'equal' | 'host_pays' | 'loser_pays' | 'custom';
  splits?: { userId: string; amount: number }[];
}
