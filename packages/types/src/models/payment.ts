import { PaymentStatus } from '../enums/payment-status';

export interface Payment {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  gatewayRef?: string;
  createdAt: string;
}

export enum PaymentMethod {
  WALLET = 'wallet',
  ONLINE = 'online',
  CASH = 'cash',
  CARD_ON_SITE = 'card_on_site',
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  transactions: WalletTransaction[];
}

export interface WalletTransaction {
  id: string;
  walletId: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  referenceId?: string;
  createdAt: string;
}
