import { PageSize } from '@models/pagination/pagesize.models';
import { KeycloakProfile } from 'keycloak-js';

export type User = KeycloakProfile & {
  roles: string[];
};

export interface UsersPagination {
  users: User[];
  pageInfo?: PageSize;
}
