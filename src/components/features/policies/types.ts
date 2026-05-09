export type Policy = {
  object_address: string;
  subject_address?: string;
  table_name: string;
  policy_sql: string;
  policy_index?: number;
};
