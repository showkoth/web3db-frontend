import React, { useContext, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Alert,
  Chip,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  IconButton,
  Tooltip,
  LinearProgress,
  Divider,
  ButtonGroup,
  Stack,
} from "@mui/material";
import {
  PlayArrow as PlayIcon,
  ContentCopy as CopyIcon,
  GetApp as ExportIcon,
  History as HistoryIcon,
  Help as HelpIcon,
  Storage as DatabaseIcon,
  Speed as OptimizeIcon,
} from "@mui/icons-material";
import AceEditor from "react-ace";
import "brace/mode/sql";
import "brace/theme/tomorrow_night_eighties";
import "brace/ext/language_tools";
import "brace/ext/searchbox";
import { SqlContext } from "../../../context/SqlContext";
import { useWeb3 } from "../../../context/Web3Context";
import WalletModal from "../../Organisms/WalletModal";
import PolicyStatus from "../../Atoms/PolicyStatus";
import ace from "ace-builds/src-noconflict/ace";
interface ResultRow {
  [key: string]: any;
}

const RunQuery: React.FC = () => {
  const langTools = ace.require("ace/ext/language_tools");

  const {
    runQuery,
    results,
    message,
    error: sqlError,
  } = useContext(SqlContext);
  
  const { isConnected, account } = useWeb3();
  
  const [inputQuery, setInputQuery] = useState<string>("SELECT * FROM patient_data WHERE PatientID = '323'");
  const [indexAttribute, setIndexAttribute] = useState<string>("PatientID");
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleInputChange = (newValue: string) => {
    const transformedValue = capitalizeSQLKeywords(newValue);
    setInputQuery(transformedValue);
  };

  const handleIndexAttributeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIndexAttribute(event.target.value);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRunQuery = async () => {
    // Check if wallet is connected
    if (!isConnected) {
      setIsWalletModalOpen(true);
      return;
    }

    if (!inputQuery.trim()) {
      alert("Please enter a SQL query");
      return;
    }

    if (!indexAttribute.trim()) {
      alert("Please enter an index attribute");
      return;
    }

    // Reset pagination when running a new query
    setPage(0);
    setIsLoading(true);

    try {
      // Check if runQuery is defined
      if (runQuery) {
        await runQuery(inputQuery, indexAttribute);
      } else {
        console.error("runQuery function is undefined");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalletConnectSuccess = () => {
    console.log("Wallet connected successfully!");
    setIsWalletModalOpen(false);
  };

  const handleCopyQuery = () => {
    navigator.clipboard.writeText(inputQuery);
  };

  const exampleQueries = [
    {
      label: "Get Patient by ID",
      query: "SELECT * FROM patient_data WHERE PatientID = '323'",
      description: "Retrieve specific patient data"
    },
    {
      label: "Limited Results",
      query: "SELECT * FROM patient_data LIMIT 10",
      description: "Get first 10 patients"
    },
    {
      label: "Basic Columns",
      query: "SELECT PatientID, Age, Gender FROM patient_data",
      description: "Select specific columns"
    },
    {
      label: "Count Records",
      query: "SELECT COUNT(*) FROM patient_data",
      description: "Count total patients"
    },
  ];

  const handleLoadExample = (exampleQuery: string) => {
    setInputQuery(exampleQuery);
  };
  const renderTable = () => {
    if (results && results.length > 0) {
      const columns = Object.keys(results[0]);
      
      return (
        <Paper sx={{ width: '100%', mb: 2, borderRadius: 2, overflow: 'hidden' }}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column}
                      sx={{
                        fontWeight: 700,
                        backgroundColor: '#f5f5f5',
                        color: '#333',
                        borderBottom: '2px solid #e0e0e0'
                      }}
                    >
                      {column}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {results
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row: ResultRow, index: number) => (
                    <TableRow
                      key={index}
                      hover
                      sx={{
                        '&:nth-of-type(odd)': {
                          backgroundColor: 'rgba(0, 0, 0, 0.02)',
                        },
                        '&:hover': {
                          backgroundColor: 'rgba(0, 212, 255, 0.08)',
                        },
                      }}
                    >
                      {columns.map((column) => (
                        <TableCell key={column} sx={{ py: 1.5 }}>
                          {row[column]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={results.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ borderTop: '1px solid #e0e0e0' }}
          />
        </Paper>
      );
    } else if (message) {
      return (
        <Alert severity="info" sx={{ borderRadius: 2, mb: 2 }}>
          {message}
        </Alert>
      );
    }
    return null;
  };

  const sqlKeywords = [
    "ADD",
    "ALL",
    "ALTER",
    "AND",
    "ANY",
    "AS",
    "ASC",
    "BACKUP",
    "BETWEEN",
    "BY",
    "CASE",
    "CHECK",
    "COLUMN",
    "CONSTRAINT",
    "CREATE",
    "DATABASE",
    "DEFAULT",
    "DELETE",
    "DESC",
    "DISTINCT",
    "DROP",
    "ELSE",
    "END",
    "EXISTS",
    "FOREIGN",
    "FROM",
    "FULL",
    "GROUP",
    "HAVING",
    "IN",
    "INDEX",
    "INNER",
    "INSERT",
    "INTERSECT",
    "INTO",
    "IS",
    "JOIN",
    "KEY",
    "LEFT",
    "LIKE",
    "LIMIT",
    "NOT",
    "NULL",
    "OR",
    "ORDER",
    "OUTER",
    "PRIMARY",
    "RIGHT",
    "ROWNUM",
    "SELECT",
    "SET",
    "TABLE",
    "THEN",
    "TOP",
    "TRUNCATE",
    "UNION",
    "UPDATE",
    "VALUES",
    "VIEW",
    "WHERE",
  ];
  const sqlCompleter = {
    getCompletions: (
      _editor: any,
      _session: any,
      _pos: any,
      prefix: any,
      callback: any
    ) => {
      callback(
        null,
        sqlKeywords.map((word) => ({
          caption: word,
          value: word,
          meta: "SQL",
        }))
      );
    },
  };
  langTools.addCompleter(sqlCompleter);

  const capitalizeSQLKeywords = (input: string) => {
    const words = input.split(" ");
    return words
      .map((word) => {
        if (sqlKeywords.includes(word.toUpperCase())) {
          return word.toUpperCase();
        }
        return word;
      })
      .join(" ");
  };

  // Inside your RunQuery component

  return (
    <Box sx={{ p: 4, minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
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
          Universal SQL Interface
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Execute SQL queries on the Web3DB decentralized database with your connected wallet.
        </Typography>

        {/* Wallet Status */}
        {isConnected ? (
          <Alert 
            severity="success" 
            sx={{ 
              borderRadius: 2,
              backgroundColor: 'rgba(76, 175, 80, 0.1)',
              border: '1px solid rgba(76, 175, 80, 0.3)',
              mb: 3
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box>
                <Typography variant="body1" fontWeight={600}>
                  🟢 Wallet Connected
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {account?.slice(0, 8)}...{account?.slice(-6)}
                </Typography>
              </Box>
            </Stack>
          </Alert>
        ) : (
          <Alert 
            severity="warning"
            sx={{ 
              borderRadius: 2,
              backgroundColor: 'rgba(255, 193, 7, 0.1)',
              border: '1px solid rgba(255, 193, 7, 0.3)',
              mb: 3
            }}
          >
            <Typography variant="body1" fontWeight={600}>
              ⚠️ Wallet Not Connected
            </Typography>
            <Typography variant="body2">
              Please connect your MetaMask wallet to run queries.
            </Typography>
          </Alert>
        )}

        {/* Policy Status - Show only when connected */}
        {isConnected && <PolicyStatus />}
      </Box>

      <Grid container spacing={3}>
        {/* Query Editor Section */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PlayIcon sx={{ color: '#00D4FF' }} />
                  Query Editor
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Copy Query">
                    <IconButton onClick={handleCopyQuery} size="small">
                      <CopyIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Help">
                    <IconButton size="small">
                      <HelpIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>

              <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, overflow: 'hidden', mb: 3 }}>
                <AceEditor
                  mode="sql"
                  theme="tomorrow_night_eighties"
                  value={inputQuery}
                  onChange={handleInputChange}
                  name="SQL_EDITOR"
                  editorProps={{ $blockScrolling: true }}
                  width="100%"
                  height="250px"
                  fontSize={14}
                  showPrintMargin={true}
                  showGutter={true}
                  highlightActiveLine={true}
                  setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                    showLineNumbers: true,
                    tabSize: 4,
                  }}
                  placeholder="Enter your SQL query here..."
                />
              </Box>

              {/* Index Attribute */}
              <TextField
                fullWidth
                label="Index Attribute"
                value={indexAttribute}
                onChange={handleIndexAttributeChange}
                helperText="Index attribute for query optimization (e.g., PatientID)"
                variant="outlined"
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: <OptimizeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleRunQuery}
                  disabled={!isConnected || isLoading}
                  startIcon={isLoading ? <LinearProgress /> : <PlayIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)',
                    color: 'white',
                    fontWeight: 700,
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #00B8E6 0%, #0088BB 100%)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 8px 25px rgba(0, 212, 255, 0.3)'
                    },
                    '&:disabled': {
                      background: 'rgba(0, 0, 0, 0.12)',
                      color: 'rgba(0, 0, 0, 0.26)'
                    }
                  }}
                >
                  {isLoading ? 'Running Query...' : !isConnected ? 'Connect Wallet First' : 'Run Query'}
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<ExportIcon />}
                  disabled={!results || results.length === 0}
                  sx={{ 
                    borderColor: '#00D4FF', 
                    color: '#00D4FF',
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: '#00B8E6',
                      backgroundColor: 'rgba(0, 212, 255, 0.1)'
                    }
                  }}
                >
                  Export Results
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Example Queries Section */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <HistoryIcon sx={{ color: '#4CAF50' }} />
                Example Queries
              </Typography>
              
              <Stack spacing={2}>
                {exampleQueries.map((example, index) => (
                  <Card 
                    key={index}
                    variant="outlined"
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(0, 212, 255, 0.2)',
                        borderColor: '#00D4FF'
                      }
                    }}
                    onClick={() => handleLoadExample(example.query)}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                        {example.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {example.description}
                      </Typography>
                      <Chip
                        label={example.query.length > 40 ? `${example.query.substring(0, 40)}...` : example.query}
                        size="small"
                        sx={{ 
                          fontFamily: 'monospace',
                          backgroundColor: 'rgba(0, 212, 255, 0.1)',
                          color: '#0088CC'
                        }}
                      />
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Results Section */}
        <Grid item xs={12}>
          {isLoading && (
            <Box sx={{ mb: 2 }}>
              <LinearProgress sx={{ borderRadius: 1, height: 6 }} />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                Executing query on Web3DB...
              </Typography>
            </Box>
          )}

          {sqlError && (
            <Alert 
              severity="error" 
              sx={{ 
                borderRadius: 2, 
                mb: 3,
                backgroundColor: 'rgba(255, 87, 87, 0.1)',
                border: '1px solid rgba(255, 87, 87, 0.3)'
              }}
            >
              <Typography variant="body1" fontWeight={600}>
                Query Error
              </Typography>
              <Typography variant="body2">
                {sqlError}
              </Typography>
            </Alert>
          )}

          {results && results.length > 0 && (
            <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight={600}>
                    Query Results
                  </Typography>
                  <Chip
                    label={`${results.length} ${results.length === 1 ? 'record' : 'records'} found`}
                    color="success"
                    variant="outlined"
                  />
                </Box>
                {renderTable()}
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* MetaMask Modal */}
      <WalletModal
        open={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onSuccess={handleWalletConnectSuccess}
        onDisconnect={() => setIsWalletModalOpen(false)}
      />
    </Box>
  );
};

export default RunQuery;
