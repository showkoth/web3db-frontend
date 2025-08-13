import React, { useContext, useEffect } from "react";
import { SqlContext } from "../../../context/SqlContext";

const SeeTables: React.FC = () => {
  console.log("SeeTables component is rendering");
  const { schemas, fetchSchemas, schemasLoading, error } = useContext(SqlContext);

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

  // Always render something to ensure the component is working
  return (
    <div style={{ padding: "20px" }}>
      
      {schemasLoading && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <h2>Loading table schemas...</h2>
        </div>
      )}

      {error && (
        <div style={{ color: "red", marginTop: "20px" }}>
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => fetchSchemas && fetchSchemas()}>
            Retry Fetch Schemas
          </button>
        </div>
      )}

      {!schemasLoading && !error && (!schemas || !schemas.schemas) && (
        <div style={{ marginTop: "20px" }}>
          <h2>No table schemas available yet...</h2>
          <p>Loading: {schemasLoading ? "Yes" : "No"}</p>
          <p>Error: {error || "None"}</p>
          <button onClick={() => fetchSchemas && fetchSchemas()}>
            Retry Fetch Schemas
          </button>
        </div>
      )}

      {schemas && schemas.schemas && (
        <div style={{ marginTop: "20px" }}>
          <h1>Database Schemas</h1>
          
          {/* Display general information */}
          <div style={{ 
            backgroundColor: "#f5f5f5", 
            padding: "15px", 
            borderRadius: "8px", 
            marginBottom: "20px" 
          }}>
            <p><strong>Last Updated:</strong> {schemas.timestamp}</p>
          </div>

          {/* Display each table schema */}
          {Object.entries(schemas.schemas).map(([tableName, tableData]: [string, any]) => (
            <div key={tableName} style={{ 
              border: "1px solid #ddd", 
              borderRadius: "8px", 
              padding: "20px", 
              marginBottom: "20px" 
            }}>
              <h2 style={{ marginTop: 0, color: "#333" }}>{tableName}</h2>
              
              <div style={{ marginBottom: "15px" }}>
                <p><strong>Created At:</strong> {tableData.created_at}</p>
                <p><strong>Primary Key:</strong> {tableData.primary_key.join(", ")}</p>
                <p><strong>Indexes:</strong> {tableData.indexes.join(", ")}</p>
              </div>

              <h3>Columns</h3>
              <div style={{ overflowX: "auto" }}>
                <table style={{ 
                  width: "100%", 
                  borderCollapse: "collapse", 
                  backgroundColor: "white",
                  border: "1px solid #ddd"
                }}>
                  <thead>
                    <tr style={{ backgroundColor: "#f8f9fa" }}>
                      <th style={{ 
                        padding: "12px", 
                        textAlign: "left", 
                        border: "1px solid #ddd",
                        fontWeight: "bold"
                      }}>Column Name</th>
                      <th style={{ 
                        padding: "12px", 
                        textAlign: "left", 
                        border: "1px solid #ddd",
                        fontWeight: "bold"
                      }}>Type</th>
                      <th style={{ 
                        padding: "12px", 
                        textAlign: "left", 
                        border: "1px solid #ddd",
                        fontWeight: "bold"
                      }}>Nullable</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.columns.map((column: any, index: number) => (
                      <tr key={index} style={{ 
                        backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8f9fa" 
                      }}>
                        <td style={{ 
                          padding: "12px", 
                          border: "1px solid #ddd",
                          fontFamily: "monospace"
                        }}>{column.name}</td>
                        <td style={{ 
                          padding: "12px", 
                          border: "1px solid #ddd",
                          color: "#666"
                        }}>{column.type}</td>
                        <td style={{ 
                          padding: "12px", 
                          border: "1px solid #ddd",
                          color: column.nullable ? "#dc3545" : "#28a745"
                        }}>{column.nullable ? "Yes" : "No"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SeeTables;
