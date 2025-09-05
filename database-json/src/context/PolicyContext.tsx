import React, { createContext, useState, ReactNode, useCallback, useEffect } from "react";
import { config, buildApiUrl } from "../config/config";
import { useWeb3 } from "./Web3Context";

interface AccessPolicy {
  wallet_address: string;
  table_name: string;
  policy_sql: string;
}

interface PolicyCountResponse {
  status: string;
  wallet_address: string;
  count: number;
  smart_contract_enabled: boolean;
  storage_type: string;
}

interface PolicyState {
  policyCount: number;
  policies: AccessPolicy[];
  isLoadingPolicies: boolean;
  policyError: string | null;
  hasFetchedPolicyCount: boolean;
  checkPolicyCount: () => Promise<void>;
  createDefaultPolicy: () => Promise<void>;
  initializePoliciesForUser: () => Promise<void>;
  refreshPolicies: () => Promise<void>;
  getPolicies: () => Promise<AccessPolicy[]>;
}

export const PolicyContext = createContext<PolicyState | undefined>(undefined);

interface PolicyProviderProps {
  children: ReactNode;
}

export const PolicyProvider: React.FC<PolicyProviderProps> = ({ children }) => {
  const [policyCount, setPolicyCount] = useState<number>(0);
  const [policies, setPolicies] = useState<AccessPolicy[]>([]);
  const [isLoadingPolicies, setIsLoadingPolicies] = useState<boolean>(false);
  const [policyError, setPolicyError] = useState<string | null>(null);
  const [hasFetchedPolicyCount, setHasFetchedPolicyCount] = useState<boolean>(false);
  
  // Get wallet address from Web3Context
  const { account, isConnected } = useWeb3();

  // Check policy count for the connected wallet
  const checkPolicyCount = useCallback(async () => {
    if (!account) {
      console.log("No wallet address available for policy check");
      return;
    }

    setIsLoadingPolicies(true);
    setPolicyError(null);

    try {
      const endpoint = config.ENDPOINTS.ACCESS_POLICIES_COUNT.replace('{wallet_address}', account);
      const response = await fetch(
        buildApiUrl(endpoint),
        {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: PolicyCountResponse = await response.json();
      console.log("Policy count response:", data);

      setPolicyCount(data.count);
      setHasFetchedPolicyCount(true);
      setPolicyError(null);
    } catch (err) {
      console.error("Error checking policy count:", err);
      setHasFetchedPolicyCount(false);
      if (err instanceof Error) {
        setPolicyError(`Failed to check policy count: ${err.message}`);
      } else {
        setPolicyError("An unknown error occurred while checking policy count");
      }
    } finally {
      setIsLoadingPolicies(false);
    }
  }, [account]);

  // Create default policy for new users
  const createDefaultPolicy = useCallback(async () => {
    if (!account) {
      console.log("No wallet address available for creating default policy");
      return;
    }

    setIsLoadingPolicies(true);
    setPolicyError(null);

    const defaultPolicy: AccessPolicy = {
      wallet_address: account,
      table_name: "patient_data",
      policy_sql: "SELECT * FROM patient_data WHERE Age > 98"
    };

    try {
      const response = await fetch(
        buildApiUrl(config.ENDPOINTS.ACCESS_POLICIES),
        {
          method: "POST",
          headers: config.REQUEST_CONFIG.HEADERS,
          body: JSON.stringify(defaultPolicy),
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Default policy created:", data);

      // Update policy count after successful creation
      setPolicyCount(1);
      setPolicies([defaultPolicy]);
      setPolicyError(null);
      
      // Show success message to user
      console.log("Default policy created successfully for new user");
    } catch (err) {
      console.error("Error creating default policy:", err);
      if (err instanceof Error) {
        setPolicyError(`Failed to create default policy: ${err.message}`);
      } else {
        setPolicyError("An unknown error occurred while creating default policy");
      }
    } finally {
      setIsLoadingPolicies(false);
    }
  }, [account]);

  // Get all policies for the connected wallet
  const getPolicies = useCallback(async (): Promise<AccessPolicy[]> => {
    if (!account) {
      console.log("No wallet address available for getting policies");
      return [];
    }

    setIsLoadingPolicies(true);
    setPolicyError(null);

    try {
      const response = await fetch(
        buildApiUrl(`/access-policies/${account}`),
        {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Policies response:", data);

      if (data.status === 'success') {
        const fetchedPolicies = data.policies || [];
        setPolicies(fetchedPolicies);
        setPolicyCount(data.policy_count || 0);
        setPolicyError(null);
        return fetchedPolicies;
      } else {
        throw new Error(data.message || 'Failed to fetch policies');
      }
    } catch (err) {
      console.error("Error getting policies:", err);
      if (err instanceof Error) {
        setPolicyError(`Failed to get policies: ${err.message}`);
      } else {
        setPolicyError("An unknown error occurred while getting policies");
      }
      return [];
    } finally {
      setIsLoadingPolicies(false);
    }
  }, [account]);

  // Refresh policies (combination of count and full policy list)
  const refreshPolicies = useCallback(async () => {
    await getPolicies();
  }, [getPolicies]);
  const initializePoliciesForUser = useCallback(async () => {
    if (!account || !isConnected) {
      return;
    }

    console.log("Initializing policies for user:", account);
    
    // First, check if user has existing policies
    await checkPolicyCount();
    
    // Note: We'll check policyCount in a useEffect after the state updates
  }, [account, isConnected, checkPolicyCount]);

  // Effect to create default policy if count is 0
  useEffect(() => {
    if (account && isConnected && hasFetchedPolicyCount && policyCount === 0 && !isLoadingPolicies && !policyError) {
      console.log("No policies found for user, creating default policy...");
      createDefaultPolicy();
    }
  }, [account, isConnected, hasFetchedPolicyCount, policyCount, isLoadingPolicies, policyError, createDefaultPolicy]);

  // Effect to initialize policies when wallet connects (with a small delay to avoid race conditions)
  useEffect(() => {
    console.log("PolicyContext useEffect triggered:", { account, isConnected, hasFetchedPolicyCount });
    
    if (account && isConnected) {
      const timer = setTimeout(() => {
        console.log("Initializing policies for user...");
        initializePoliciesForUser();
      }, 500); // Small delay to ensure wallet connection is fully established

      return () => clearTimeout(timer);
    } else {
      // Reset policy state when wallet disconnects
      console.log("Resetting policy state (wallet disconnected)");
      setPolicyCount(0);
      setPolicies([]);
      setPolicyError(null);
      setHasFetchedPolicyCount(false);
    }
  }, [account, isConnected, hasFetchedPolicyCount, initializePoliciesForUser]);

  const contextValue: PolicyState = {
    policyCount,
    policies,
    isLoadingPolicies,
    policyError,
    hasFetchedPolicyCount,
    checkPolicyCount,
    createDefaultPolicy,
    initializePoliciesForUser,
    refreshPolicies,
    getPolicies,
  };

  // Debug log to track context values
  console.log("PolicyContext providing values:", {
    policyCount,
    isLoadingPolicies,
    policyError,
    hasFetchedPolicyCount,
    account,
    isConnected
  });

  return (
    <PolicyContext.Provider value={contextValue}>
      {children}
    </PolicyContext.Provider>
  );
};

// Custom hook to use the PolicyContext
export const usePolicy = (): PolicyState => {
  const context = React.useContext(PolicyContext);
  if (context === undefined) {
    throw new Error('usePolicy must be used within a PolicyProvider');
  }
  return context;
};
