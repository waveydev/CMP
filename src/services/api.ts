import axios from 'axios';
import { Platform } from 'react-native';
import appConfig from '../../app.json';

const baseURL: string = (appConfig as any)?.expo?.extra?.apiBaseUrl || 'http://localhost:8000';
const client = axios.create({ baseURL, timeout: 10000 });

export type Role = 'NATIONAL' | 'REGIONAL';
export interface UserProfile {
  id: string;
  email: string;
  role: Role;
  region?: string | null;
}

export interface MemberRecord {
  id: string | number;
  first_name: string;
  last_name: string;
  national_number: string;
  jamaat: string;
  date_of_birth: string;
  gender: 'Male' | 'Female';
  family_situation: 'Married' | 'Divorced' | 'Single';
  children_count: number;
  children_over_15_count: number;
  spouse_is_ahmadi: boolean;
  salary_mad: number;
  salary_type: 'Fixed' | 'Variable';
  monthly_tchanda: number;
  is_mousi: boolean;
  is_active: boolean;
  jamaat_role: string;
}

const demoMembers: MemberRecord[] = [
  {
    id: 1,
    first_name: 'Ali',
    last_name: 'Hassan',
    national_number: 'MOR0123',
    jamaat: '1',
    date_of_birth: '1990-01-01',
    gender: 'Male',
    family_situation: 'Married',
    children_count: 2,
    children_over_15_count: 1,
    spouse_is_ahmadi: true,
    salary_mad: 7000,
    salary_type: 'Fixed',
    monthly_tchanda: 200,
    is_mousi: false,
    is_active: true,
    jamaat_role: 'Treasurer',
  },
  {
    id: 2,
    first_name: 'Fatima',
    last_name: 'Zahra',
    national_number: 'MOR0456',
    jamaat: '1',
    date_of_birth: '1992-02-02',
    gender: 'Female',
    family_situation: 'Single',
    children_count: 0,
    children_over_15_count: 0,
    spouse_is_ahmadi: false,
    salary_mad: 0,
    salary_type: 'Variable',
    monthly_tchanda: 50,
    is_mousi: true,
    is_active: true,
    jamaat_role: 'Member',
  },
];

export const api = {
  async login(input: { email: string; password: string }): Promise<{ token: string; user: UserProfile }> {
    if (!input.email || !input.password) throw new Error('Email and password required');
    const isNational = /national/i.test(input.email);
    return {
      token: 'dev-token-' + Date.now(),
      user: { id: '1', email: input.email, role: isNational ? 'NATIONAL' : 'REGIONAL', region: isNational ? null : '1' },
    };
  },
  async redeemInvite(_input: { token: string; email: string; password: string }): Promise<{ ok: true }> {
    // Placeholder
    return { ok: true };
  },
  async me(token: string): Promise<UserProfile> {
    if (!token.startsWith('dev-token')) throw new Error('Invalid token');
    return { id: '1', email: 'national@example.com', role: 'NATIONAL', region: null };
  },
  async listMembers(): Promise<MemberRecord[]> {
    return demoMembers;
  },
  async getMember(id: string): Promise<MemberRecord | null> {
    return demoMembers.find((m) => String(m.id) === String(id)) || null;
  },
  async createMember(values: Omit<MemberRecord, 'id'>): Promise<MemberRecord> {
    const created: MemberRecord = { id: Date.now(), ...values };
    demoMembers.push(created);
    return created;
  },
  async updateMember(id: string, values: Partial<MemberRecord>): Promise<MemberRecord> {
    const idx = demoMembers.findIndex((m) => String(m.id) === String(id));
    if (idx === -1) throw new Error('Not found');
    demoMembers[idx] = { ...demoMembers[idx], ...values };
    return demoMembers[idx];
  },
};
