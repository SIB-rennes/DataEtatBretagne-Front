import { RefTheme } from './theme.models';

export interface BopModelCode {
  Code: string;
}

export interface BopModel extends BopModelCode {
  Id: number;
  Label: string;
  RefTheme: RefTheme;
}
