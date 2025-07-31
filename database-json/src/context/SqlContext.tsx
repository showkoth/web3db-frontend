import React, { createContext, useState, ReactNode } from "react";

type SqlState = {
  query: string;
  results: any;
  runQuery: (query: string, indexAttribute: string) => void;
  message: string | null;
  error: string | null;
};

const initialContext: Partial<SqlState> = {
  query: "",
  results: null,
  runQuery: () => {},
  message: null,
  error: null,
};

export const SqlContext = createContext<Partial<SqlState>>(initialContext);

interface SqlProviderProps {
  children: ReactNode;
}

export const SqlProvider: React.FC<SqlProviderProps> = ({ children }) => {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<any>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runQuery = async (
    sqlQuery: string,
    indexAttribute: string
  ) => {
    setQuery(sqlQuery);
    setMessage(null);
    setError(null);
    setResults(null);

    const requestBody = {
      index_attribute: indexAttribute,
      query: sqlQuery,
    };

    try {
      const response = await fetch(
        "http://129.74.152.201:8000/query",
        {
          method: "POST",
          body: JSON.stringify(requestBody),
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("API Response:", data);

      // Update state with response data based on your API structure
      setResults(data.results || []); // Your API returns results in 'results' field
      setMessage(`Query executed successfully. Found ${data.records} record(s) from ${data.cids} CID(s). Execution time: ${data.total_query_execution_time_seconds?.toFixed(4)}s`);
      setError(null);
    } catch (err) {
      console.error("Error running query:", err);

      // Check if 'err' is an instance of Error and set the error message
      if (err instanceof Error) {
        // Check for specific CORS error
        if (err.message.includes("Failed to fetch") || err.message.includes("CORS")) {
          setError("CORS error: Unable to connect to the API. Please ensure the API server has CORS enabled for localhost:3000");
        } else {
          setError(err.message);
        }
      } else {
        // If it's not an Error, you can handle it differently or set a generic error message
        setError("An unknown error occurred");
      }
      
      // Clear results on error
      setResults(null);
      setMessage(null);
    }
  };

  return (
    <SqlContext.Provider
      value={{ query, results, runQuery, message, error }}
    >
      {children}
    </SqlContext.Provider>
  );
};
