
export enum Industry {
  REAL_ESTATE = 'Real Estate',
  INSURANCE = 'Insurance',
  ECOMMERCE = 'E-commerce',
  HOSPITALITY = 'Hospitality',
  RESTAURANT = 'Restaurant',
  OTHER = 'General Business'
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'New' | 'Interested' | 'Qualified' | 'Closed';
  lastCallDate: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  notes: string;
}

export interface BusinessConfig {
  name: string;
  industry: Industry;
  objective: string;
  knowledgeBase: string;
}

export interface CallMetric {
  date: string;
  calls: number;
  qualified: number;
  revenue: number;
}

export interface SocialMessage {
  id: string;
  platform: 'Instagram' | 'Facebook' | 'X';
  sender: string;
  text: string;
  timestamp: string;
  isAuroraResponse: boolean;
  status: 'Delivered' | 'Read' | 'Replied';
}

export interface ChannelConnection {
  id: string;
  name: string;
  connected: boolean;
  health: number;
  username: string;
}
