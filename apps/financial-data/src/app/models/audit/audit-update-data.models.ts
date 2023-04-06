export interface AuditUpdateData {
  username: string;
  filename: string;
  date: Date;
}

export enum DataType {
  FINANCIAL_DATA = 'FINANCIAL_DATA',
  FRANCE_RELANCE = 'FRANCE_RELANCE',
  REFERENTIEL = 'REFERENTIEL',
}
