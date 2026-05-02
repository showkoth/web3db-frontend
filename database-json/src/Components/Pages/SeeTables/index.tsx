import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  CircularProgress,
  Button,
  Grid,
  IconButton,
  Tooltip,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Snackbar,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Storage as DatabaseIcon,
  TableChart as TableIcon,
  Key as KeyIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  Schedule as ScheduleIcon,
  DataObject as DataIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Code as CodeIcon,
  ContentCopy as CopyIcon,
} from "@mui/icons-material";
import { SqlContext } from "../../../context/SqlContext";
import { config, buildApiUrl } from "../../../config/config";

const SeeTables: React.FC = () => {
  console.log("SeeTables component is rendering");
  const { schemas, fetchSchemas, schemasLoading, error } = useContext(SqlContext);

  // State for schema management
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });


  // State for SQL view dialog
  const [sqlDialogOpen, setSqlDialogOpen] = useState(false);
  const [selectedTableSql, setSelectedTableSql] = useState({ name: '', sql: '' });
  const [copySuccess, setCopySuccess] = useState(false);



  // Helper function to parse SQL CREATE TABLE statement into structured data
  const parseCreateTableSQL = (sql: string) => {
    try {
      // Extract column definitions between parentheses
      const columnsMatch = sql.match(/\(([^)]+)\)/);
      if (!columnsMatch) return null;

      const columnDefs = columnsMatch[1].split(',').map(def => def.trim());
      const columns: Array<{ name: string, type: string, nullable: boolean }> = [];
      const primaryKeys: string[] = [];

      columnDefs.forEach(def => {
        // Parse column definition
        const parts = def.trim().split(/\s+/);
        const columnName = parts[0];
        const columnType = parts[1] || 'VARCHAR';
        const isPrimaryKey = def.toUpperCase().includes('PRIMARY KEY');
        const hasNotNull = def.toUpperCase().includes('NOT NULL');

        if (isPrimaryKey) {
          primaryKeys.push(columnName);
        }

        // A column is nullable if it's NOT a primary key AND doesn't have NOT NULL constraint
        const isNullable = !isPrimaryKey && !hasNotNull;

        columns.push({
          name: columnName,
          type: columnType.toLowerCase(),
          nullable: isNullable
        });
      });

      return {
        columns,
        primary_key: primaryKeys,
        indexes: primaryKeys // For now, assume primary keys are indexed
      };
    } catch (error) {
      console.error('Error parsing SQL:', error);
      return null;
    }
  };




  const deleteSchema = async (tableName: string) => {
    if (!window.confirm(`Are you sure you want to delete the schema for table "${tableName}"? This action cannot be undone.`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(buildApiUrl(`/schemas/${tableName}`), {
        method: 'DELETE',
        headers: config.REQUEST_CONFIG.HEADERS,
      });

      const data = await response.json();
      if (data.status === 'success') {
        setNotification({ open: true, message: 'Schema deleted successfully!', severity: 'success' });
        fetchSchemas && fetchSchemas();
      } else {
        throw new Error(data.message || 'Failed to delete schema');
      }
    } catch (err) {
      setNotification({
        open: true,
        message: err instanceof Error ? err.message : 'Failed to delete schema',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };


  // Handle SQL dialog
  const handleViewSql = (tableName: string, sql: string) => {
    setSelectedTableSql({ name: tableName, sql });
    setSqlDialogOpen(true);
  };

  const handleCopySql = async () => {
    try {
      await navigator.clipboard.writeText(selectedTableSql.sql);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy SQL:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = selectedTableSql.sql;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };


  // Handle DDL example selection

  useEffect(() => {
    console.log("SeeTables component mounted, calling fetchSchemas");
    if (fetchSchemas) {
      console.log("Calling fetchSchemas");
      fetchSchemas();
    } else {
      console.log("fetchSchemas is not available");
    }
  }, [fetchSchemas]);

  console.log("SeeTables render - schemasLoading:", schemasLoading, "error:", error, "schemas:", schemas);

  const handleRefresh = () => {
    if (fetchSchemas) {
      fetchSchemas();
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'string':
      case 'varchar':
      case 'text':
        return '#4CAF50';
      case 'integer':
      case 'int':
      case 'number':
        return '#2196F3';
      case 'boolean':
      case 'bool':
        return '#FF9800';
      case 'date':
      case 'datetime':
      case 'timestamp':
        return '#9C27B0';
      default:
        return '#757575';
    }
  };

  // Always render something to ensure the component is working
  return (
    <Box sx={{ p: 4, minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
          <Box>
            <Typography
              variant="h3"
              fontWeight={700}
              sx={{
                mb: 2,
                color: '#1a1a1a',
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              <DatabaseIcon sx={{ fontSize: 40, color: '#00D4FF' }} />
              Database Schemas
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Explore the schemas and metadata of the tables in Web3DB.
            </Typography>
          </Box>

          <Stack direction="row" spacing={2}>
            <Tooltip title="Refresh Schemas">
              <IconButton
                onClick={handleRefresh}
                disabled={schemasLoading}
                sx={{
                  bgcolor: 'white',
                  border: '1px solid #e0e0e0',
                  '&:hover': { bgcolor: '#f5f5f5' }
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        {/* Status Information */}
        {schemas && schemas.timestamp && (
          <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ py: 2 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <ScheduleIcon sx={{ color: '#4CAF50' }} />
                <Typography variant="body2" color="text.secondary">
                  <strong>Last Updated:</strong> {new Date(schemas.timestamp).toLocaleString()}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        )}
      </Box>

      {/* Loading State */}
      {schemasLoading && (
        <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <CircularProgress size={60} sx={{ color: '#00D4FF', mb: 3 }} />
            <Typography variant="h5" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>
              Loading Database Schemas
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Fetching table structures from Web3DB...
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Alert
          severity="error"
          sx={{
            borderRadius: 2,
            mb: 3,
            backgroundColor: 'rgba(255, 87, 87, 0.1)',
            border: '1px solid rgba(255, 87, 87, 0.3)'
          }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={handleRefresh}
              startIcon={<RefreshIcon />}
            >
              Retry
            </Button>
          }
        >
          <Typography variant="body1" fontWeight={600}>
            Failed to Load Schemas
          </Typography>
          <Typography variant="body2">
            {error}
          </Typography>
        </Alert>
      )}

      {/* Empty State */}
      {!schemasLoading && !error && (!schemas || !schemas.schemas) && (
        <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <DataIcon sx={{ fontSize: 80, color: '#e0e0e0', mb: 3 }} />
            <Typography variant="h5" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>
              No Table Schemas Available
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              No database schemas found. Try refreshing to load the latest data.
            </Typography>
            <Button
              variant="contained"
              onClick={handleRefresh}
              startIcon={<RefreshIcon />}
              sx={{
                background: 'linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)',
                textTransform: 'none'
              }}
            >
              Reload Schemas
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Schemas Display */}
      {schemas && schemas.schemas && (
        <Box>
          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', height: '100%' }}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <TableIcon sx={{ fontSize: 40, color: '#00D4FF', mb: 2 }} />
                  <Typography variant="h4" fontWeight={700} color="primary">
                    {Object.keys(schemas.schemas).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Database Tables
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', height: '100%' }}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <DataIcon sx={{ fontSize: 40, color: '#4CAF50', mb: 2 }} />
                  <Typography variant="h4" fontWeight={700} color="primary">
                    {Object.values(schemas.schemas).reduce((total: number, schemaSql: any) => {
                      const parsed = typeof schemaSql === 'string' ? parseCreateTableSQL(schemaSql) : schemaSql;
                      return total + (parsed?.columns?.length || 0);
                    }, 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Columns
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', height: '100%' }}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <SearchIcon sx={{ fontSize: 40, color: '#FF9800', mb: 2 }} />
                  <Typography variant="h4" fontWeight={700} color="primary">
                    {Object.values(schemas.schemas).reduce((total: number, schemaSql: any) => {
                      const parsed = typeof schemaSql === 'string' ? parseCreateTableSQL(schemaSql) : schemaSql;
                      return total + (parsed?.indexes?.length || 0);
                    }, 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Database Indexes
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Table Schemas */}
          <Stack spacing={3}>
            {schemas.schemas && Object.entries(schemas.schemas).map(([tableName, schemaSql]: [string, any]) => {
              // Parse SQL to get structured data for display
              const parsedSchema = typeof schemaSql === 'string' ? parseCreateTableSQL(schemaSql) : schemaSql;

              // If parsing fails or schema is empty, skip this table
              if (!parsedSchema) return null;

              const tableData = parsedSchema;

              return (
                <Card key={tableName} sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                  <CardContent sx={{ p: 0 }}>
                    <Accordion sx={{ boxShadow: 'none' }}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                          bgcolor: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(0, 153, 204, 0.1) 100%)',
                          borderRadius: '8px 8px 0 0',
                          '& .MuiAccordionSummary-content': {
                            alignItems: 'center'
                          }
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
                          <TableIcon sx={{ color: '#00D4FF' }} />
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>
                              {tableName}
                            </Typography>
                            <Stack direction="row" spacing={2}>
                              <Chip
                                icon={<DataIcon />}
                                label={`${tableData.columns?.length || 0} columns`}
                                size="small"
                                sx={{ bgcolor: 'rgba(76, 175, 80, 0.1)', color: '#4CAF50' }}
                              />
                              <Chip
                                icon={<KeyIcon />}
                                label={`Primary: ${tableData.primary_key?.join(', ') || 'None'}`}
                                size="small"
                                sx={{ bgcolor: 'rgba(255, 152, 0, 0.1)', color: '#FF9800' }}
                              />
                            </Stack>
                          </Box>
                          <Stack direction="row" spacing={1}>
                            <Tooltip title="View SQL">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewSql(tableName, schemaSql);
                                }}
                                sx={{
                                  bgcolor: 'rgba(76, 175, 80, 0.1)',
                                  color: '#4CAF50',
                                  '&:hover': { bgcolor: 'rgba(76, 175, 80, 0.2)' }
                                }}
                              >
                                <CodeIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Schema">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteSchema(tableName);
                                }}
                                sx={{
                                  bgcolor: 'rgba(244, 67, 54, 0.1)',
                                  color: '#f44336',
                                  '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.2)' }
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </Stack>
                      </AccordionSummary>

                      <AccordionDetails sx={{ p: 3 }}>
                        {/* Table Metadata */}
                        <Grid container spacing={3} sx={{ mb: 3 }}>
                          <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                                Primary Key
                              </Typography>
                              <Stack direction="row" spacing={1} flexWrap="wrap">
                                {tableData.primary_key.map((key: string, index: number) => (
                                  <Chip
                                    key={index}
                                    icon={<KeyIcon />}
                                    label={key}
                                    size="small"
                                    sx={{ bgcolor: '#fff3cd', color: '#856404' }}
                                  />
                                ))}
                              </Stack>
                            </Paper>
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                                Indexes
                              </Typography>
                              <Stack direction="row" spacing={1} flexWrap="wrap">
                                {tableData.indexes.map((index: string, idx: number) => (
                                  <Chip
                                    key={idx}
                                    icon={<SearchIcon />}
                                    label={index}
                                    size="small"
                                    sx={{ bgcolor: '#d1ecf1', color: '#0c5460' }}
                                  />
                                ))}
                              </Stack>
                            </Paper>
                          </Grid>
                        </Grid>

                        {/* Columns Table */}
                        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                          Column Structure
                        </Typography>

                        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                          <Table>
                            <TableHead>
                              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                <TableCell sx={{ fontWeight: 700, color: '#333' }}>Column Name</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#333' }}>Data Type</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#333', textAlign: 'center' }}>Nullable</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {tableData.columns.map((column: any, index: number) => (
                                <TableRow
                                  key={index}
                                  hover
                                  sx={{
                                    '&:nth-of-type(odd)': { bgcolor: 'rgba(0, 0, 0, 0.02)' },
                                    '&:hover': { bgcolor: 'rgba(0, 212, 255, 0.08)' }
                                  }}
                                >
                                  <TableCell sx={{
                                    fontFamily: 'monospace',
                                    fontWeight: 600,
                                    color: '#1976d2'
                                  }}>
                                    {column.name}
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      label={column.type}
                                      size="small"
                                      sx={{
                                        bgcolor: `${getTypeColor(column.type)}15`,
                                        color: getTypeColor(column.type),
                                        fontWeight: 600
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell sx={{ textAlign: 'center' }}>
                                    <Badge
                                      badgeContent={column.nullable ? "Yes" : "No"}
                                      color={column.nullable ? "error" : "success"}
                                      sx={{
                                        '& .MuiBadge-badge': {
                                          fontSize: '0.7rem',
                                          fontWeight: 600,
                                          minWidth: '40px',
                                          height: '20px'
                                        }
                                      }}
                                    />
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </AccordionDetails>
                    </Accordion>
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        </Box>
      )}

      {/* SQL View Dialog */}
      <Dialog
        open={sqlDialogOpen}
        onClose={() => setSqlDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={2}>
              <CodeIcon sx={{ color: '#00D4FF' }} />
              <Typography variant="h6" fontWeight={600}>
                SQL Schema - {selectedTableSql.name}
              </Typography>
            </Stack>
            <IconButton onClick={() => setSqlDialogOpen(false)}>
              <CancelIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Paper
            sx={{
              p: 3,
              bgcolor: '#f8f9fa',
              borderRadius: 2,
              border: '1px solid #e0e0e0',
              position: 'relative'
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
                CREATE TABLE Statement
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<CopyIcon />}
                onClick={handleCopySql}
                sx={{
                  textTransform: 'none',
                  color: copySuccess ? '#4CAF50' : '#00D4FF',
                  borderColor: copySuccess ? '#4CAF50' : '#00D4FF',
                  '&:hover': {
                    borderColor: copySuccess ? '#4CAF50' : '#0099CC',
                    bgcolor: copySuccess ? 'rgba(76, 175, 80, 0.04)' : 'rgba(0, 212, 255, 0.04)'
                  }
                }}
              >
                {copySuccess ? 'Copied!' : 'Copy SQL'}
              </Button>
            </Stack>
            <Typography
              component="pre"
              sx={{
                fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                fontSize: '14px',
                lineHeight: 1.5,
                color: '#333',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                margin: 0,
                padding: 0
              }}
            >
              {selectedTableSql.sql}
            </Typography>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSqlDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification(prev => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setNotification(prev => ({ ...prev, open: false }))}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SeeTables;
