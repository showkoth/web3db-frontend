// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { createContext, useState, ReactNode, useCallback } from "react";
import { config, buildApiUrl } from "../config/config";

type SqlState = {
  query: string;
  results: any;
  runQuery: (query: string, indexAttribute: string) => void;
  message: string | null;
  error: string | null;
  schemas: any;
  fetchSchemas: () => void;
  schemasLoading: boolean;
};

const initialContext: Partial<SqlState> = {
  query: "",
  results: null,
  runQuery: () => {},
  message: null,
  error: null,
  schemas: null,
  fetchSchemas: () => {},
  schemasLoading: false,
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
  const [schemas, setSchemas] = useState<any>(null);
  const [schemasLoading, setSchemasLoading] = useState<boolean>(false);

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
        buildApiUrl(config.ENDPOINTS.QUERY),
        {
          method: "POST",
          body: JSON.stringify(requestBody),
          headers: config.REQUEST_CONFIG.HEADERS,
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

  const fetchSchemas = useCallback(async () => {
    setSchemasLoading(true);
    setError(null);

    try {
      const response = await fetch(
        buildApiUrl(config.ENDPOINTS.SCHEMAS),
        {
          method: "GET",
          headers: {
            "Accept": "application/json",
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Schemas API Response:", data);

      setSchemas(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching schemas:", err);

      if (err instanceof Error) {
        if (err.message.includes("Failed to fetch") || err.message.includes("CORS")) {
          setError("CORS error: Unable to connect to the API. Please ensure the API server has CORS enabled for localhost:3000");
        } else {
          setError(err.message);
        }
      } else {
        setError("An unknown error occurred while fetching schemas");
      }
      
      setSchemas(null);
    } finally {
      setSchemasLoading(false);
    }
  }, []);

  return (
    <SqlContext.Provider
      value={{ query, results, runQuery, message, error, schemas, fetchSchemas, schemasLoading }}
    >
      {children}
    </SqlContext.Provider>
  );
};
