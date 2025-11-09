import Constants from 'expo-constants';
import axios from 'axios';

const baseURL: string = (Constants?.expoConfig?.extra as any)?.apiBaseUrl || 'http://localhost:8000';

const client = axios.create({ baseURL, timeout: 10000 });

export const api = {
  async login(input: { email: string; password: string }) {
    // Placeholder implementation
    if (!input.email || !input.password) throw new Error('Email and password required');
    return {
      token: 'dev-token-' + Date.now(),
      user: { id: '1', email: input.email, role: 'REGIONAL', region: '1' },
    };
  },
  async redeemInvite(input: { token: string; email: string; password: string }) {
    if (!input.token) throw new Error('Token required');
    // Placeholder: would POST to /auth/redeem
    return { ok: true };
  },
  async me(token: string) {
    // Placeholder: would GET /auth/me with bearer token
    if (!token.startsWith('dev-token')) throw new Error('Invalid token');
    return { id: '1', email: 'regional@example.com', role: 'REGIONAL', region: '1' };
  },
  async listMembers() {
    // Placeholder dataset
    return [
      { id: 1, first_name: 'Ali', last_name: 'Hassan', national_number: 'NN123', jamaat: '1', date_of_birth: '1990-01-01', gender: 'Male' },
      { id: 2, first_name: 'Fatima', last_name: 'Zahra', national_number: 'NN456', jamaat: '1', date_of_birth: '1992-02-02', gender: 'Female' },
    ];
  },
  async getMember(id: string) {
    return { id, first_name: 'Ali', last_name: 'Hassan', national_number: 'NN123', jamaat: '1', date_of_birth: '1990-01-01', gender: 'Male' };
  },
  async createMember(values: any) {
    return { id: String(Date.now()), ...values };
  },
  async updateMember(id: string, values: any) {
    return { id, ...values };
  },
};
