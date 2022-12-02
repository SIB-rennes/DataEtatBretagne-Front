import { BopModel } from './bop.models';
import { RefTheme } from './theme.models';

/**
 * Model pour le resolvers
 */
export interface ChorusResolverModel {
  themes: RefTheme[];
  bop: BopModel[];
}
