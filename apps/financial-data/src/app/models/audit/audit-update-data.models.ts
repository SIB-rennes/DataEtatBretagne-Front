export interface AuditUpdateData {
  username: string;
  filename: string;
  date: Date;
}

export enum DataType {
  FINANCIAL_DATA_AE = 'FINANCIAL_DATA_AE',
  FINANCIAL_DATA_CP = 'FINANCIAL_DATA_CP',
  FRANCE_RELANCE = 'FRANCE_RELANCE',
  REFERENTIEL = 'REFERENTIEL',
}
