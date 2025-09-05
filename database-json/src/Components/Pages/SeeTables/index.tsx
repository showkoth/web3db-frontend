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
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { SqlContext } from "../../../context/SqlContext";
import { config, buildApiUrl } from "../../../config/config";

const SeeTables: React.FC = () => {
  console.log("SeeTables component is rendering");
  const { schemas, fetchSchemas, schemasLoading, error } = useContext(SqlContext);

  // State for schema management
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSchema, setSelectedSchema] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Form state for create/edit schema
  const [schemaForm, setSchemaForm] = useState({
    table_name: '',
    columns: [{ name: '', type: 'string', nullable: false }],
    primary_key: [''],
    indexes: ['PatientID', 'HospitalID', 'Age']
  });

  // API functions for schema management
  const createSchema = async () => {
    setLoading(true);
    try {
      const response = await fetch(buildApiUrl('/schemas'), {
        method: 'POST',
        headers: config.REQUEST_CONFIG.HEADERS,
        body: JSON.stringify({
          table_name: schemaForm.table_name,
          table_schema: {
            columns: schemaForm.columns,
            primary_key: schemaForm.primary_key,
            indexes: schemaForm.indexes
          }
        })
      });

      const data = await response.json();
      if (data.status === 'success') {
        setNotification({ open: true, message: 'Schema created successfully!', severity: 'success' });
        setCreateDialogOpen(false);
        fetchSchemas && fetchSchemas();
        resetForm();
      } else {
        throw new Error(data.message || 'Failed to create schema');
      }
    } catch (err) {
      setNotification({ 
        open: true, 
        message: err instanceof Error ? err.message : 'Failed to create schema', 
        severity: 'error' 
      });
    } finally {
      setLoading(false);
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

  const resetForm = () => {
    setSchemaForm({
      table_name: '',
      columns: [{ name: '', type: 'string', nullable: false }],
      primary_key: [''],
      indexes: ['PatientID', 'HospitalID', 'Age']
    });
  };

  const addColumn = () => {
    setSchemaForm(prev => ({
      ...prev,
      columns: [...prev.columns, { name: '', type: 'string', nullable: false }]
    }));
  };

  const removeColumn = (index: number) => {
    setSchemaForm(prev => ({
      ...prev,
      columns: prev.columns.filter((_, i) => i !== index)
    }));
  };

  const updateColumn = (index: number, field: string, value: any) => {
    setSchemaForm(prev => ({
      ...prev,
      columns: prev.columns.map((col, i) => 
        i === index ? { ...col, [field]: value } : col
      )
    }));
  };

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
              Explore the structure and metadata of your Web3DB decentralized database tables.
            </Typography>
          </Box>
          
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateDialogOpen(true)}
              sx={{
                background: 'linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)',
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Create Schema
            </Button>
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
                    {Object.values(schemas.schemas).reduce((total: number, table: any) => total + table.columns.length, 0)}
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
                    {Object.values(schemas.schemas).reduce((total: number, table: any) => total + table.indexes.length, 0)}
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
            {Object.entries(schemas.schemas).map(([tableName, tableData]: [string, any]) => (
              <Card key={tableName} sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                <CardContent sx={{ p: 0 }}>
                  <Accordion defaultExpanded sx={{ boxShadow: 'none' }}>
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
                              label={`${tableData.columns.length} columns`}
                              size="small"
                              sx={{ bgcolor: 'rgba(76, 175, 80, 0.1)', color: '#4CAF50' }}
                            />
                            <Chip
                              icon={<KeyIcon />}
                              label={`Primary: ${tableData.primary_key.join(', ')}`}
                              size="small"
                              sx={{ bgcolor: 'rgba(255, 152, 0, 0.1)', color: '#FF9800' }}
                            />
                          </Stack>
                        </Box>
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="Edit Schema">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedSchema({ name: tableName, data: tableData });
                                setSchemaForm({
                                  table_name: tableName,
                                  columns: tableData.columns,
                                  primary_key: tableData.primary_key,
                                  indexes: tableData.indexes
                                });
                                setEditDialogOpen(true);
                              }}
                              sx={{ 
                                bgcolor: 'rgba(33, 150, 243, 0.1)', 
                                color: '#2196F3',
                                '&:hover': { bgcolor: 'rgba(33, 150, 243, 0.2)' }
                              }}
                            >
                              <EditIcon fontSize="small" />
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
            ))}
          </Stack>
        </Box>
      )}

      {/* Create Schema Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={2}>
            <AddIcon sx={{ color: '#00D4FF' }} />
            <Typography variant="h6" fontWeight={600}>Create New Table Schema</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              label="Table Name"
              value={schemaForm.table_name}
              onChange={(e) => setSchemaForm(prev => ({ ...prev, table_name: e.target.value }))}
              placeholder="e.g., patient_data"
              fullWidth
              required
            />
            
            <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>Columns</Typography>
                <Button startIcon={<AddIcon />} onClick={addColumn} size="small">
                  Add Column
                </Button>
              </Stack>
              
              {schemaForm.columns.map((column, index) => (
                <Paper key={index} sx={{ p: 2, mb: 2, bgcolor: '#f8f9fa' }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Column Name"
                        value={column.name}
                        onChange={(e) => updateColumn(index, 'name', e.target.value)}
                        fullWidth
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Data Type</InputLabel>
                        <Select
                          value={column.type}
                          label="Data Type"
                          onChange={(e) => updateColumn(index, 'type', e.target.value)}
                        >
                          <MenuItem value="string">String</MenuItem>
                          <MenuItem value="integer">Integer</MenuItem>
                          <MenuItem value="float">Float</MenuItem>
                          <MenuItem value="boolean">Boolean</MenuItem>
                          <MenuItem value="datetime">DateTime</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={column.nullable}
                            onChange={(e) => updateColumn(index, 'nullable', e.target.checked)}
                          />
                        }
                        label="Nullable"
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <IconButton 
                        onClick={() => removeColumn(index)}
                        disabled={schemaForm.columns.length === 1}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Box>

            <TextField
              label="Primary Key (comma-separated)"
              value={schemaForm.primary_key.join(', ')}
              onChange={(e) => setSchemaForm(prev => ({ 
                ...prev, 
                primary_key: e.target.value.split(',').map(k => k.trim()).filter(k => k) 
              }))}
              placeholder="e.g., PatientID"
              fullWidth
              helperText="Enter column names that form the primary key"
            />

            <TextField
              label="Indexes (comma-separated)"
              value={schemaForm.indexes.join(', ')}
              onChange={(e) => setSchemaForm(prev => ({ 
                ...prev, 
                indexes: e.target.value.split(',').map(k => k.trim()).filter(k => k) 
              }))}
              placeholder="e.g., PatientID, HospitalID, Age"
              fullWidth
              helperText="Enter column names to be indexed for faster queries"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setCreateDialogOpen(false); resetForm(); }} startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button 
            onClick={createSchema} 
            variant="contained" 
            startIcon={<SaveIcon />}
            disabled={loading || !schemaForm.table_name || schemaForm.columns.some(col => !col.name)}
            sx={{
              background: 'linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)',
            }}
          >
            {loading ? 'Creating...' : 'Create Schema'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Schema Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={2}>
            <EditIcon sx={{ color: '#2196F3' }} />
            <Typography variant="h6" fontWeight={600}>Edit Schema: {selectedSchema?.name}</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Note: Editing schemas in a production environment should be done carefully as it may affect existing data.
          </Alert>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              label="Table Name"
              value={schemaForm.table_name}
              onChange={(e) => setSchemaForm(prev => ({ ...prev, table_name: e.target.value }))}
              fullWidth
              disabled // Usually table name shouldn't be editable
            />
            
            <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>Columns</Typography>
                <Button startIcon={<AddIcon />} onClick={addColumn} size="small">
                  Add Column
                </Button>
              </Stack>
              
              {schemaForm.columns.map((column, index) => (
                <Paper key={index} sx={{ p: 2, mb: 2, bgcolor: '#f8f9fa' }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Column Name"
                        value={column.name}
                        onChange={(e) => updateColumn(index, 'name', e.target.value)}
                        fullWidth
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Data Type</InputLabel>
                        <Select
                          value={column.type}
                          label="Data Type"
                          onChange={(e) => updateColumn(index, 'type', e.target.value)}
                        >
                          <MenuItem value="string">String</MenuItem>
                          <MenuItem value="integer">Integer</MenuItem>
                          <MenuItem value="float">Float</MenuItem>
                          <MenuItem value="boolean">Boolean</MenuItem>
                          <MenuItem value="datetime">DateTime</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={column.nullable}
                            onChange={(e) => updateColumn(index, 'nullable', e.target.checked)}
                          />
                        }
                        label="Nullable"
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <IconButton 
                        onClick={() => removeColumn(index)}
                        disabled={schemaForm.columns.length === 1}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Box>

            <TextField
              label="Primary Key (comma-separated)"
              value={schemaForm.primary_key.join(', ')}
              onChange={(e) => setSchemaForm(prev => ({ 
                ...prev, 
                primary_key: e.target.value.split(',').map(k => k.trim()).filter(k => k) 
              }))}
              fullWidth
              helperText="Enter column names that form the primary key"
            />

            <TextField
              label="Indexes (comma-separated)"
              value={schemaForm.indexes.join(', ')}
              onChange={(e) => setSchemaForm(prev => ({ 
                ...prev, 
                indexes: e.target.value.split(',').map(k => k.trim()).filter(k => k) 
              }))}
              fullWidth
              helperText="Enter column names to be indexed for faster queries"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setEditDialogOpen(false); resetForm(); }} startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button 
            onClick={createSchema} 
            variant="contained" 
            startIcon={<SaveIcon />}
            disabled={loading || !schemaForm.table_name || schemaForm.columns.some(col => !col.name)}
            sx={{
              background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
            }}
          >
            {loading ? 'Updating...' : 'Update Schema'}
          </Button>
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
