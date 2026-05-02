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
  subject: string;
  object: string;
  tableName: string;
  policySql: string;
  object_policy_index?: number;
}

interface PolicyStats {
  totalPolicies: number;
  tablesWithPolicies: string[];
  querierAddresses: string[];
}

const PolicyManagement: React.FC = () => {
  const { account: userWalletAddress } = useWeb3();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [grantedPolicies, setGrantedPolicies] = useState<Policy[]>([]);
  const [stats, setStats] = useState<PolicyStats>({ totalPolicies: 0, tablesWithPolicies: [], querierAddresses: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [toasts, setToasts] = useState<Array<{
    id: number;
    type: 'success' | 'error';
    message: string;
  }>>([]);

  // Form state - now includes object_address (querier)
  const [newPolicy, setNewPolicy] = useState({
    objectAddress: '', // querier address
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
      sql: "SELECT * FROM patient_data WHERE HospitalID = 'HOSP-001'"
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
          querierAddresses: Array.from(new Set(data.policies?.map((p: Policy) => p.object) || [])),
        });
      } else {
        throw new Error(data.message || 'Failed to fetch policies');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch policies');
      setPolicies([]);
      setStats({ totalPolicies: 0, tablesWithPolicies: [], querierAddresses: [] });
    } finally {
      setLoading(false);
    }
  }, [userWalletAddress, clearMessages]);

  const fetchGrantedPolicies = useCallback(async () => {
    if (!userWalletAddress) return;
    try {
      const response = await fetch(
        buildApiUrl(`/access-policies/granted-by/${userWalletAddress}`),
        { method: 'GET', headers: config.REQUEST_CONFIG.HEADERS }
      );
      const data = await response.json();
      if (data.status === 'success') {
        setGrantedPolicies(data.policies || []);
      } else {
        setGrantedPolicies([]);
      }
    } catch {
      setGrantedPolicies([]);
    }
  }, [userWalletAddress]);

  const createPolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userWalletAddress || !newPolicy.policySql.trim() || !newPolicy.objectAddress.trim()) return;

    setIsCreating(true);
    clearMessages();

    try {
      const response = await fetch(buildApiUrl('/access-policies'), {
        method: 'POST',
        headers: config.REQUEST_CONFIG.HEADERS,
        body: JSON.stringify({
          subject_address: userWalletAddress, // Current wallet as owner/subject
          object_address: newPolicy.objectAddress, // User-provided querier address
          table_name: newPolicy.tableName,
          policy_sql: newPolicy.policySql.trim(),
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        // Show success toast notification
        showToast('success', 'Policy created successfully!');

        // Clear form and refresh
        setNewPolicy({ objectAddress: '', tableName: 'patient_data', policySql: '' });
        await Promise.all([fetchPolicies(), fetchGrantedPolicies()]); // Refresh both lists
      } else {
        throw new Error(data.message || 'Failed to create policy');
      }
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to create policy');
    } finally {
      setIsCreating(false);
    }
  };

  const deletePolicy = async (policyIndex: number, objectAddress?: string) => {
    if (!userWalletAddress) return;

    setLoading(true);
    clearMessages();

    try {
      const response = await fetch(buildApiUrl('/access-policies'), {
        method: 'DELETE',
        headers: config.REQUEST_CONFIG.HEADERS,
        body: JSON.stringify({
          object_address: objectAddress || userWalletAddress,
          policy_index: policyIndex,
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        showToast('success', 'Policy deleted successfully!');
        await Promise.all([fetchPolicies(), fetchGrantedPolicies()]); // Refresh both lists
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
        await Promise.all([fetchPolicies(), fetchGrantedPolicies()]); // Refresh both lists
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
      fetchGrantedPolicies();
    }
  }, [userWalletAddress, fetchPolicies, fetchGrantedPolicies]);

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
        <p><strong>Your Wallet:</strong> {userWalletAddress}</p>
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
        <StatsCard>
          <h4>{stats.querierAddresses.length}</h4>
          <p>Authorized Queriers</p>
        </StatsCard>
      </StatsContainer>

      {/* Create New Policy */}
      <PolicyCard>
        <h3>📝 Create New Policy</h3>
        <p>Create an access policy to grant querying permissions to another wallet address.</p>
        <CreatePolicyForm onSubmit={createPolicy}>
          <FormGroup>
            <Label htmlFor="objectAddress">Querier Wallet Address:</Label>
            <Input
              id="objectAddress"
              type="text"
              value={newPolicy.objectAddress}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPolicy(prev => ({ ...prev, objectAddress: e.target.value }))}
              placeholder="0x... (wallet address that will be granted access)"
              required
            />
          </FormGroup>

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

          <Button type="submit" disabled={isCreating || !newPolicy.policySql.trim() || !newPolicy.objectAddress.trim()}>
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
          <h3>Your Access Policies ({stats.totalPolicies})</h3>
          {stats.totalPolicies > 0 && (
            <ActionButtons>
              <Button onClick={fetchPolicies} disabled={loading}>
                Refresh
              </Button>
              <DeleteButton onClick={deleteAllPolicies} disabled={loading}>
                Delete All
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
            <p>No access policies found.</p>
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
                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                      <strong>Owner:</strong> {policy.subject}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                      <strong>Querier:</strong> {policy.object}
                    </div>
                    <PolicySql>{policy.policySql}</PolicySql>
                  </div>
                  <DeleteButton
                    onClick={() => deletePolicy(index)}
                    disabled={loading}
                    title="Delete this policy"
                  >
                    Delete
                  </DeleteButton>
                </PolicyContent>
              </PolicyItem>
            ))}
          </PolicyList>
        )}
      </PolicyCard>

      {/* Policies the wallet has granted to others */}
      <PolicyCard>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3>Policies You Granted ({grantedPolicies.length})</h3>
          <ActionButtons>
            <Button onClick={fetchGrantedPolicies} disabled={loading}>
              Refresh
            </Button>
          </ActionButtons>
        </div>

        {grantedPolicies.length === 0 && (
          <EmptyState>
            <p>You have not granted any policies to other wallets.</p>
          </EmptyState>
        )}

        {grantedPolicies.length > 0 && (
          <PolicyList>
            {grantedPolicies.map((policy, index) => (
              <PolicyItem key={`granted-${index}`}>
                <PolicyContent>
                  <PolicyIndex>#{index + 1}</PolicyIndex>
                  <div>
                    <PolicyTable>Table: {policy.tableName}</PolicyTable>
                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                      <strong>Owner:</strong> {policy.subject}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                      <strong>Querier:</strong> {policy.object}
                    </div>
                    <PolicySql>{policy.policySql}</PolicySql>
                  </div>
                  <DeleteButton
                    onClick={() => policy.object_policy_index !== undefined
                      ? deletePolicy(policy.object_policy_index, policy.object)
                      : showToast('error', 'Cannot resolve policy index for delete')}
                    disabled={loading || policy.object_policy_index === undefined}
                    title="Revoke this granted policy"
                  >
                    Revoke
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
