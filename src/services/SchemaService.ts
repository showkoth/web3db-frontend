import { config, buildApiUrl } from '../config/config';
import { SchemaForm, generateCreateTableSQL } from '../utils/schemaUtils';

export interface SchemaResponse {
  status: 'success' | 'error' | 'not_found';
  message?: string;
  table_name?: string;
  schema_sql?: string;
  schemas?: Record<string, string>;
  storage_type?: string;
  timestamp?: string;
}

/**
 * Schema Service for handling API operations related to database schemas
 */
export class SchemaService {
  
  /**
   * Create or update a table schema
   */
  static async createOrUpdateSchema(form: SchemaForm): Promise<SchemaResponse> {
    try {
      const schemaSql = generateCreateTableSQL(form);
      
      const response = await fetch(buildApiUrl('/schemas'), {
        method: 'POST',
        headers: config.REQUEST_CONFIG.HEADERS,
        body: JSON.stringify({
          table_name: form.table_name,
          schema_sql: schemaSql
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to create/update schema'
      };
    }
  }

  /**
   * Get all table schemas
   */
  static async getAllSchemas(): Promise<SchemaResponse> {
    try {
      const response = await fetch(buildApiUrl('/schemas'), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to fetch schemas'
      };
    }
  }

  /**
   * Get schema for a specific table
   */
  static async getTableSchema(tableName: string): Promise<SchemaResponse> {
    try {
      const response = await fetch(buildApiUrl(`/schemas/${tableName}`), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to fetch table schema'
      };
    }
  }

  /**
   * Delete a table schema
   */
  static async deleteSchema(tableName: string): Promise<SchemaResponse> {
    try {
      const response = await fetch(buildApiUrl(`/schemas/${tableName}`), {
        method: 'DELETE',
        headers: config.REQUEST_CONFIG.HEADERS,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to delete schema'
      };
    }
  }
}