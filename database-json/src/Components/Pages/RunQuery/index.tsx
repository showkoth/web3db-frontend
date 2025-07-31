import React, { useContext, useState } from "react";
import { Row, Col, Table, Form, Alert, Pagination } from "react-bootstrap";
import AceEditor from "react-ace";
import "brace/mode/sql";
import "brace/theme/tomorrow_night_eighties";
import "brace/ext/language_tools";
import "brace/ext/searchbox";
import { SqlContext } from "../../../context/SqlContext";
import { useWeb3 } from "../../../context/Web3Context";
import MetaMaskModal from "../../Organisms/MetaMaskModal";
import { QueryContainer, StyledButton } from "./styles";
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
  
  const [inputQuery, setInputQuery] = useState<string>("SELECT * FROM patient_data WHERE PatientID = '38'");
  const [indexAttribute, setIndexAttribute] = useState<string>("PatientID");
  const [isMetaMaskModalOpen, setIsMetaMaskModalOpen] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const handleInputChange = (newValue: string) => {
    const transformedValue = capitalizeSQLKeywords(newValue);
    setInputQuery(transformedValue);
  };

  const handleIndexAttributeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIndexAttribute(event.target.value);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to first page when changing rows per page
  };

  const handleRunQuery = () => {
    // Check if wallet is connected
    if (!isConnected) {
      setIsMetaMaskModalOpen(true);
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
    setCurrentPage(1);

    // Check if runQuery is defined
    if (runQuery) {
      runQuery(inputQuery, indexAttribute);
    } else {
      console.error("runQuery function is undefined");
      // Handle the error as needed
    }
  };

  const handleMetaMaskSuccess = () => {
    setIsMetaMaskModalOpen(false);
    // Optionally auto-run the query after connection
  };

  const exampleQueries = [
    "SELECT * FROM patient_data WHERE PatientID = '38'",
    "SELECT * FROM patient_data LIMIT 10",
    "SELECT PatientID, Age, Gender FROM patient_data",
    "SELECT COUNT(*) FROM patient_data",
  ];

  const handleLoadExample = (exampleQuery: string) => {
    setInputQuery(exampleQuery);
  };
  const renderTable = () => {
    if (results && results.length > 0) {
      const columns = Object.keys(results[0]);
      
      // Calculate pagination
      const totalPages = Math.ceil(results.length / rowsPerPage);
      const startIndex = (currentPage - 1) * rowsPerPage;
      const endIndex = startIndex + rowsPerPage;
      const currentPageData = results.slice(startIndex, endIndex);
      
      return (
        <div>
          {/* Results info and rows per page selector */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <strong>
                Showing {startIndex + 1}-{Math.min(endIndex, results.length)} of {results.length} results
              </strong>
            </div>
            <div className="d-flex align-items-center">
              <span className="me-2">Rows per page:</span>
              <Form.Select 
                size="sm" 
                style={{ width: 'auto' }}
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </Form.Select>
            </div>
          </div>
          
          {/* Table */}
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                {columns.map((col, index) => (
                  <th key={index}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentPageData.map((row: ResultRow, rowIndex: number) => (
                <tr key={startIndex + rowIndex}>
                  {columns.map((col, colIndex) => (
                    <td key={colIndex}>{row[col]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-3">
              <Pagination>
                <Pagination.First 
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                />
                <Pagination.Prev 
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                />
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <Pagination.Item
                      key={pageNum}
                      active={pageNum === currentPage}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Pagination.Item>
                  );
                })}
                
                <Pagination.Next 
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                />
                <Pagination.Last 
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </div>
          )}
        </div>
      );
    } else if (message) {
      return <p>{message}</p>;
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
    <QueryContainer>
      {/* Wallet Connection Status */}
      <Row className="mb-3">
        <Col xs={12}>
          {isConnected ? (
            <Alert variant="success">
              <strong>Wallet Connected:</strong> {account?.slice(0, 6)}...{account?.slice(-4)}
            </Alert>
          ) : (
            <Alert variant="warning">
              <strong>Wallet Not Connected:</strong> Please connect your MetaMask wallet to run queries.
            </Alert>
          )}
        </Col>
      </Row>

      <Row className="mb-4">
        <Col xs={12}>
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
        </Col>
      </Row>

      {/* Example Queries */}
      <Row className="mb-3">
        <Col xs={12}>
          <div className="mb-2">
            <strong>Example Queries:</strong>
          </div>
          {exampleQueries.map((query, index) => (
            <button
              key={index}
              className="btn btn-outline-secondary btn-sm me-2 mb-2"
              onClick={() => handleLoadExample(query)}
              style={{ fontSize: '12px' }}
            >
              {query.length > 50 ? `${query.substring(0, 50)}...` : query}
            </button>
          ))}
        </Col>
      </Row>
      <Row className="mb-4">
        <Col xs={12}>
          <Form.Control
            type="text"
            placeholder="Enter index attribute (e.g., PatientID)"
            value={indexAttribute}
            onChange={handleIndexAttributeChange}
          />
          <Form.Text className="text-muted">
            Index attribute for query optimization
          </Form.Text>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <StyledButton 
            variant="secondary" 
            onClick={handleRunQuery}
            disabled={!isConnected}
          >
            {isConnected ? "Run Query" : "Connect Wallet to Run Query"}
          </StyledButton>
        </Col>
      </Row>
      
      {/* Error Display */}
      {sqlError && (
        <Row className="mt-3">
          <Col xs={12}>
            <Alert variant="danger">
              <strong>Error:</strong> {sqlError}
            </Alert>
          </Col>
        </Row>
      )}
      
      <Row>
        <Col xs={12}>{renderTable()}</Col>
      </Row>

      {/* MetaMask Modal */}
      <MetaMaskModal
        open={isMetaMaskModalOpen}
        onClose={() => setIsMetaMaskModalOpen(false)}
        onSuccess={handleMetaMaskSuccess}
        onDisconnect={() => setIsMetaMaskModalOpen(false)}
      />
    </QueryContainer>
  );
};

export default RunQuery;
