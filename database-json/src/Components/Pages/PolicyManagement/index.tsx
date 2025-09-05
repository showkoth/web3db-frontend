import React, { useState, useEffect, useCallback } from 'react';
import { useWeb3 } from '../../../context/Web3Context';
import { config, buildApiUrl } from '../../../config/config';
import {
  Container,
  PolicyCard,
  PolicyHeader,
  PolicyContent,
  PolicyItem,
  CreatePolicyForm,
  FormGroup,
  Label,
  Input,
  TextArea,
  Button,
  DeleteButton,
  ErrorMessage,
  SuccessMessage,
  LoadingSpinner,
  PolicyList,
  EmptyState,
  PolicyIndex,
  PolicyTable,
  PolicySql,
  StatsCard,
  StatsContainer,
  ExampleQueries,
  ExampleQuery,
  ActionButtons,
  ToastContainer,
  Toast,
  ToastIcon,
  ToastMessage,
  ToastCloseButton,
} from './styles';

interface Policy {
  ownerAddress: string;
  tableName: string;
  policySql: string;
}

interface PolicyStats {
  totalPolicies: number;
  tablesWithPolicies: string[];
}

const PolicyManagement: React.FC = () => {
  const { account: userWalletAddress } = useWeb3();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [stats, setStats] = useState<PolicyStats>({ totalPolicies: 0, tablesWithPolicies: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [toasts, setToasts] = useState<Array<{
    id: number;
    type: 'success' | 'error';
    message: string;
  }>>([]);

  // Form state
  const [newPolicy, setNewPolicy] = useState({
    tableName: 'patient_data',
    policySql: '',
  });

  // Example queries for user reference
  const exampleQueries = [
    {
      title: "Access specific patient",
      sql: "SELECT * FROM patient_data WHERE PatientID = '38'"
    },
    {
      title: "Access by hospital",
      sql: "SELECT * FROM patient_data WHERE HospitalID = 'H001'"
    },
    {
      title: "Access by condition",
      sql: "SELECT * FROM patient_data WHERE Condition = 'Diabetes'"
    },
    {
      title: "Limited columns access",
      sql: "SELECT PatientID, Name, Age FROM patient_data WHERE Age > 99"
    }
  ];

  // Enhanced notification functions
  const showToast = useCallback((type: 'success' | 'error', message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    
    // Auto remove toast after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  const fetchPolicies = useCallback(async () => {
    if (!userWalletAddress) return;

    setLoading(true);
    clearMessages();

    try {
      const response = await fetch(
        buildApiUrl(`/access-policies/${userWalletAddress}`),
        {
          method: 'GET',
          headers: config.REQUEST_CONFIG.HEADERS,
        }
      );

      const data = await response.json();

      if (data.status === 'success') {
        setPolicies(data.policies || []);
        setStats({
          totalPolicies: data.policy_count || 0,
          tablesWithPolicies: Array.from(new Set(data.policies?.map((p: Policy) => p.tableName) || [])),
        });
      } else {
        throw new Error(data.message || 'Failed to fetch policies');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch policies');
      setPolicies([]);
      setStats({ totalPolicies: 0, tablesWithPolicies: [] });
    } finally {
      setLoading(false);
    }
  }, [userWalletAddress, clearMessages]);

  const createPolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userWalletAddress || !newPolicy.policySql.trim()) return;

    setIsCreating(true);
    clearMessages();

    try {
      const response = await fetch(buildApiUrl('/access-policies'), {
        method: 'POST',
        headers: config.REQUEST_CONFIG.HEADERS,
        body: JSON.stringify({
          wallet_address: userWalletAddress,
          table_name: newPolicy.tableName,
          policy_sql: newPolicy.policySql.trim(),
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        // Show success toast notification
        showToast('success', 'Policy created successfully!');
        
        // Clear form and refresh
        setNewPolicy({ tableName: 'patient_data', policySql: '' });
        await fetchPolicies(); // Refresh the list
      } else {
        throw new Error(data.message || 'Failed to create policy');
      }
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to create policy');
    } finally {
      setIsCreating(false);
    }
  };

  const deletePolicy = async (policyIndex: number) => {
    if (!userWalletAddress) return;

    setLoading(true);
    clearMessages();

    try {
      const response = await fetch(buildApiUrl('/access-policies'), {
        method: 'DELETE',
        headers: config.REQUEST_CONFIG.HEADERS,
        body: JSON.stringify({
          wallet_address: userWalletAddress,
          policy_index: policyIndex,
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        showToast('success', 'Policy deleted successfully!');
        await fetchPolicies(); // Refresh the list
      } else {
        throw new Error(data.message || 'Failed to delete policy');
      }
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to delete policy');
    } finally {
      setLoading(false);
    }
  };

  const deleteAllPolicies = async () => {
    if (!userWalletAddress || !window.confirm('Are you sure you want to delete ALL policies? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    clearMessages();

    try {
      const response = await fetch(
        buildApiUrl(`/access-policies/${userWalletAddress}/all`),
        {
          method: 'DELETE',
          headers: config.REQUEST_CONFIG.HEADERS,
        }
      );

      const data = await response.json();

      if (data.status === 'success') {
        showToast('success', 'All policies deleted successfully!');
        await fetchPolicies(); // Refresh the list
      } else {
        throw new Error(data.message || 'Failed to delete all policies');
      }
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to delete all policies');
    } finally {
      setLoading(false);
    }
  };

  const handleUseExampleQuery = (sql: string) => {
    setNewPolicy(prev => ({ ...prev, policySql: sql }));
  };

  useEffect(() => {
    if (userWalletAddress) {
      fetchPolicies();
    }
  }, [userWalletAddress, fetchPolicies]);

  useEffect(() => {
    const timer = setTimeout(clearMessages, 5000);
    return () => clearTimeout(timer);
  }, [error, success, clearMessages]);

  if (!userWalletAddress) {
    return (
      <Container>
        <EmptyState>
          <h3>🔒 Access Policy Management</h3>
          <p>Please connect your wallet to manage access policies.</p>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      {/* Toast Notifications */}
      <ToastContainer>
        {toasts.map((toast) => (
          <Toast key={toast.id} type={toast.type}>
            <ToastIcon>
              {toast.type === 'success' ? '✅' : '❌'}
            </ToastIcon>
            <ToastMessage>{toast.message}</ToastMessage>
            <ToastCloseButton onClick={() => removeToast(toast.id)}>
              ×
            </ToastCloseButton>
          </Toast>
        ))}
      </ToastContainer>

      <PolicyHeader>
        <h2>🔒 Access Policy Management</h2>
        <p>Manage your data access policies to control what data you can query from the Web3DB.</p>
        <p><strong>Wallet:</strong> {userWalletAddress}</p>
      </PolicyHeader>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}

      {/* Statistics */}
      <StatsContainer>
        <StatsCard>
          <h4>{stats.totalPolicies}</h4>
          <p>Total Policies</p>
        </StatsCard>
        <StatsCard>
          <h4>{stats.tablesWithPolicies.length}</h4>
          <p>Tables with Access</p>
        </StatsCard>
      </StatsContainer>

      {/* Create New Policy */}
      <PolicyCard>
        <h3>📝 Create New Policy</h3>
        <CreatePolicyForm onSubmit={createPolicy}>
          <FormGroup>
            <Label htmlFor="tableName">Table Name:</Label>
            <Input
              id="tableName"
              type="text"
              value={newPolicy.tableName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPolicy(prev => ({ ...prev, tableName: e.target.value }))}
              placeholder="e.g., patient_data"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="policySql">Policy SQL Query:</Label>
            <TextArea
              id="policySql"
              value={newPolicy.policySql}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewPolicy(prev => ({ ...prev, policySql: e.target.value }))}
              placeholder="e.g., SELECT * FROM patient_data WHERE PatientID = '38'"
              rows={4}
              required
            />
          </FormGroup>

          <Button type="submit" disabled={isCreating || !newPolicy.policySql.trim()}>
            {isCreating ? <LoadingSpinner /> : '➕ Create Policy'}
          </Button>
        </CreatePolicyForm>

        {/* Example Queries */}
        <ExampleQueries>
          <h4>💡 Example Queries:</h4>
          {exampleQueries.map((example, index) => (
            <ExampleQuery key={index}>
              <p><strong>{example.title}:</strong></p>
              <code>{example.sql}</code>
              <Button
                type="button"
                onClick={() => handleUseExampleQuery(example.sql)}
                style={{ marginLeft: '10px', padding: '4px 8px', fontSize: '12px' }}
              >
                Use This
              </Button>
            </ExampleQuery>
          ))}
        </ExampleQueries>
      </PolicyCard>

      {/* Existing Policies */}
      <PolicyCard>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3>📋 Your Access Policies ({stats.totalPolicies})</h3>
          {stats.totalPolicies > 0 && (
            <ActionButtons>
              <Button onClick={fetchPolicies} disabled={loading}>
                🔄 Refresh
              </Button>
              <DeleteButton onClick={deleteAllPolicies} disabled={loading}>
                🗑️ Delete All
              </DeleteButton>
            </ActionButtons>
          )}
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <LoadingSpinner /> Loading policies...
          </div>
        )}

        {!loading && policies.length === 0 && (
          <EmptyState>
            <p>🔍 No access policies found.</p>
            <p>Create your first policy above to start accessing data.</p>
          </EmptyState>
        )}

        {!loading && policies.length > 0 && (
          <PolicyList>
            {policies.map((policy, index) => (
              <PolicyItem key={index}>
                <PolicyContent>
                  <PolicyIndex>#{index + 1}</PolicyIndex>
                  <div>
                    <PolicyTable>Table: {policy.tableName}</PolicyTable>
                    <PolicySql>{policy.policySql}</PolicySql>
                  </div>
                  <DeleteButton
                    onClick={() => deletePolicy(index)}
                    disabled={loading}
                    title="Delete this policy"
                  >
                    🗑️
                  </DeleteButton>
                </PolicyContent>
              </PolicyItem>
            ))}
          </PolicyList>
        )}
      </PolicyCard>
    </Container>
  );
};

export default PolicyManagement;
