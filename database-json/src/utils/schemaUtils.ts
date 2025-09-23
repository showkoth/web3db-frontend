// Utility functions for handling SQL schema conversions
// This is a separate utility file to make the schema parsing logic reusable

export interface Column {
  name: string;
  type: string;
  nullable: boolean;
}

export interface ParsedSchema {
  columns: Column[];
  primary_key: string[];
  indexes: string[];
}

export interface SchemaForm {
  table_name: string;
  columns: Column[];
  primary_key: string[];
  indexes: string[];
}

/**
 * Parse SQL CREATE TABLE statement into structured data
 */
export const parseCreateTableSQL = (sql: string): ParsedSchema | null => {
  try {
    // Extract column definitions between parentheses
    const columnsMatch = sql.match(/\(([^)]+)\)/);
    if (!columnsMatch) return null;
    
    const columnDefs = columnsMatch[1].split(',').map(def => def.trim());
    const columns: Column[] = [];
    const primaryKeys: string[] = [];
    
    columnDefs.forEach(def => {
      // Parse column definition
      const parts = def.trim().split(/\s+/);
      const columnName = parts[0];
      const columnType = parts[1] || 'VARCHAR';
      const isPrimaryKey = def.toUpperCase().includes('PRIMARY KEY');
      
      if (isPrimaryKey) {
        primaryKeys.push(columnName);
      }
      
      columns.push({
        name: columnName,
        type: columnType.toLowerCase(),
        nullable: !isPrimaryKey // Primary keys are typically not nullable
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

/**
 * Convert form data to SQL CREATE TABLE statement
 */
export const generateCreateTableSQL = (form: SchemaForm): string => {
  const { table_name, columns, primary_key } = form;
  
  // Build column definitions
  const columnDefs = columns.map(col => {
    let def = `${col.name} `;
    
    // Map frontend types to SQL types
    switch (col.type.toLowerCase()) {
      case 'string':
        def += 'VARCHAR';
        break;
      case 'integer':
      case 'int':
        def += 'INTEGER';
        break;
      case 'float':
      case 'number':
        def += 'FLOAT';
        break;
      case 'boolean':
      case 'bool':
        def += 'BOOLEAN';
        break;
      case 'date':
        def += 'DATE';
        break;
      case 'datetime':
      case 'timestamp':
        def += 'TIMESTAMP';
        break;
      default:
        def += 'VARCHAR';
    }
    
    // Add PRIMARY KEY constraint for primary key columns
    if (primary_key.includes(col.name)) {
      def += ' PRIMARY KEY';
    }
    
    return def;
  }).join(', ');
  
  return `CREATE TABLE ${table_name} (${columnDefs})`;
};

/**
 * Validate SQL schema format
 */
export const validateSqlSchema = (sql: string): { isValid: boolean; error?: string } => {
  if (!sql.trim()) {
    return { isValid: false, error: 'SQL schema cannot be empty' };
  }
  
  if (!sql.toUpperCase().includes('CREATE TABLE')) {
    return { isValid: false, error: 'SQL must be a CREATE TABLE statement' };
  }
  
  const parsed = parseCreateTableSQL(sql);
  if (!parsed) {
    return { isValid: false, error: 'Invalid SQL syntax' };
  }
  
  if (parsed.columns.length === 0) {
    return { isValid: false, error: 'Table must have at least one column' };
  }
  
  return { isValid: true };
};