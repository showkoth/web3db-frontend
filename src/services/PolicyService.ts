import { config, buildApiUrl } from '../config/config';

export interface Policy {
  ownerAddress: string;
  tableName: string;
  policySql: string;
}

export interface PolicyResponse {
  status: string;
  message?: string;
  policies?: Policy[];
  policy_count?: number;
  wallet_address?: string;
}

export interface PolicyCountResponse {
  status: string;
  message?: string;
  count?: number;
  wallet_address?: string;
}

export class PolicyService {
  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(buildApiUrl(endpoint), {
      headers: {
        ...config.REQUEST_CONFIG.HEADERS,
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  }

  static async getPolicies(walletAddress: string): Promise<PolicyResponse> {
    return this.request<PolicyResponse>(`/access-policies/${walletAddress}`);
  }

  static async getPolicyCount(walletAddress: string): Promise<PolicyCountResponse> {
    return this.request<PolicyCountResponse>(`/access-policies/${walletAddress}/count`);
  }

  static async createPolicy(
    walletAddress: string,
    tableName: string,
    policySql: string
  ): Promise<PolicyResponse> {
    return this.request<PolicyResponse>('/access-policies', {
      method: 'POST',
      body: JSON.stringify({
        wallet_address: walletAddress,
        table_name: tableName,
        policy_sql: policySql,
      }),
    });
  }

  static async deletePolicy(
    walletAddress: string,
    policyIndex: number
  ): Promise<PolicyResponse> {
    return this.request<PolicyResponse>('/access-policies', {
      method: 'DELETE',
      body: JSON.stringify({
        wallet_address: walletAddress,
        policy_index: policyIndex,
      }),
    });
  }

  static async deleteAllPolicies(walletAddress: string): Promise<PolicyResponse> {
    return this.request<PolicyResponse>(`/access-policies/${walletAddress}/all`, {
      method: 'DELETE',
    });
  }
}
