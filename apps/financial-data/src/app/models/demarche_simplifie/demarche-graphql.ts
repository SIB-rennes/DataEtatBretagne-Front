export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /**
   * Represents non-fractional signed whole numeric values. Since the value may
   * exceed the size of a 32-bit integer, it's encoded as a string.
   */
  BigInt: any;
  /** GeoJSON coordinates */
  Coordinates: any;
  /** An ISO 8601-encoded date */
  ISO8601Date: any;
  /** An ISO 8601-encoded datetime */
  ISO8601DateTime: any;
  /** A valid URL, transported as a string */
  URL: any;
};

export type Address = {
  __typename?: 'Address';
  /** code INSEE de la commune */
  cityCode: Scalars['String'];
  /** nom de la commune */
  cityName: Scalars['String'];
  /** n° de département */
  departmentCode?: Maybe<Scalars['String']>;
  /** nom de département */
  departmentName?: Maybe<Scalars['String']>;
  /** coordonnées géographique */
  geometry?: Maybe<GeoJson>;
  /** libellé complet de l’adresse */
  label: Scalars['String'];
  /** code postal */
  postalCode: Scalars['String'];
  /** n° de region */
  regionCode?: Maybe<Scalars['String']>;
  /** nom de région */
  regionName?: Maybe<Scalars['String']>;
  /** numéro éventuel et nom de voie ou lieu dit */
  streetAddress?: Maybe<Scalars['String']>;
  /** nom de voie ou lieu dit */
  streetName?: Maybe<Scalars['String']>;
  /** numéro avec indice de répétition éventuel (bis, ter, A, B) */
  streetNumber?: Maybe<Scalars['String']>;
  /** type de résultat trouvé */
  type: AddressType;
};

export type AddressChamp = Champ & {
  __typename?: 'AddressChamp';
  address?: Maybe<Address>;
  commune?: Maybe<Commune>;
  departement?: Maybe<Departement>;
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  /** La valeur du champ sous forme texte. */
  stringValue?: Maybe<Scalars['String']>;
};

export type AddressChampDescriptor = ChampDescriptor & {
  __typename?: 'AddressChampDescriptor';
  /**
   * Description des champs d’un bloc répétable.
   * @deprecated Utilisez le champ `RepetitionChampDescriptor.champ_descriptors` à la place.
   */
  champDescriptors?: Maybe<Array<ChampDescriptor>>;
  /** Description du champ. */
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  /** Est-ce que le champ est obligatoire ? */
  required: Scalars['Boolean'];
  /**
   * Type de la valeur du champ.
   * @deprecated Utilisez le champ `__typename` à la place.
   */
  type: TypeDeChamp;
};

export enum AddressType {
  /** numéro « à la plaque » */
  Housenumber = 'housenumber',
  /** lieu-dit */
  Locality = 'locality',
  /** numéro « à la commune » */
  Municipality = 'municipality',
  /** position « à la voie », placé approximativement au centre de celle-ci */
  Street = 'street'
}

export type AnnuaireEducationChampDescriptor = ChampDescriptor & {
  __typename?: 'AnnuaireEducationChampDescriptor';
  /**
   * Description des champs d’un bloc répétable.
   * @deprecated Utilisez le champ `RepetitionChampDescriptor.champ_descriptors` à la place.
   */
  champDescriptors?: Maybe<Array<ChampDescriptor>>;
  /** Description du champ. */
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  /** Est-ce que le champ est obligatoire ? */
  required: Scalars['Boolean'];
  /**
   * Type de la valeur du champ.
   * @deprecated Utilisez le champ `__typename` à la place.
   */
  type: TypeDeChamp;
};

export type Association = {
  __typename?: 'Association';
  dateCreation?: Maybe<Scalars['ISO8601Date']>;
  dateDeclaration?: Maybe<Scalars['ISO8601Date']>;
  datePublication?: Maybe<Scalars['ISO8601Date']>;
  objet?: Maybe<Scalars['String']>;
  rna: Scalars['String'];
  titre: Scalars['String'];
};

export type Avis = {
  __typename?: 'Avis';
  /** @deprecated Utilisez le champ `attachments` à la place. */
  attachment?: Maybe<File>;
  attachments: Array<File>;
  claimant?: Maybe<Profile>;
  dateQuestion: Scalars['ISO8601DateTime'];
  dateReponse?: Maybe<Scalars['ISO8601DateTime']>;
  expert?: Maybe<Profile>;
  id: Scalars['ID'];
  /** @deprecated Utilisez le champ `claimant` à la place. */
  instructeur: Profile;
  question: Scalars['String'];
  questionAnswer?: Maybe<Scalars['Boolean']>;
  questionLabel?: Maybe<Scalars['String']>;
  reponse?: Maybe<Scalars['String']>;
};

export type CarteChamp = Champ & {
  __typename?: 'CarteChamp';
  geoAreas: Array<GeoArea>;
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  /** La valeur du champ sous forme texte. */
  stringValue?: Maybe<Scalars['String']>;
};

export type CarteChampDescriptor = ChampDescriptor & {
  __typename?: 'CarteChampDescriptor';
  /**
   * Description des champs d’un bloc répétable.
   * @deprecated Utilisez le champ `RepetitionChampDescriptor.champ_descriptors` à la place.
   */
  champDescriptors?: Maybe<Array<ChampDescriptor>>;
  /** Description du champ. */
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  /** Est-ce que le champ est obligatoire ? */
  required: Scalars['Boolean'];
  /**
   * Type de la valeur du champ.
   * @deprecated Utilisez le champ `__typename` à la place.
   */
  type: TypeDeChamp;
};

export type Champ = {
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  /** La valeur du champ sous forme texte. */
  stringValue?: Maybe<Scalars['String']>;
};

export type ChampDescriptor = {
  /**
   * Description des champs d’un bloc répétable.
   * @deprecated Utilisez le champ `RepetitionChampDescriptor.champ_descriptors` à la place.
   */
  champDescriptors?: Maybe<Array<ChampDescriptor>>;
  /** Description du champ. */
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  /** Est-ce que le champ est obligatoire ? */
  required: Scalars['Boolean'];
  /**
   * Type de la valeur du champ.
   * @deprecated Utilisez le champ `__typename` à la place.
   */
  type: TypeDeChamp;
};

export type CheckboxChamp = Champ & {
  __typename?: 'CheckboxChamp';
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  /** La valeur du champ sous forme texte. */
  stringValue?: Maybe<Scalars['String']>;
  value: Scalars['Boolean'];
};

export type CheckboxChampDescriptor = ChampDescriptor & {
  __typename?: 'CheckboxChampDescriptor';
  /**
   * Description des champs d’un bloc répétable.
   * @deprecated Utilisez le champ `RepetitionChampDescriptor.champ_descriptors` à la place.
   */
  champDescriptors?: Maybe<Array<ChampDescriptor>>;
  /** Description du champ. */
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  /** Est-ce que le champ est obligatoire ? */
  required: Scalars['Boolean'];
  /**
   * Type de la valeur du champ.
   * @deprecated Utilisez le champ `__typename` à la place.
   */
  type: TypeDeChamp;
};

export enum Civilite {
  /** Monsieur */
  M = 'M',
  /** Madame */
  Mme = 'Mme'
}

export type CiviliteChamp = Champ & {
  __typename?: 'CiviliteChamp';
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  /** La valeur du champ sous forme texte. */
  stringValue?: Maybe<Scalars['String']>;
  value?: Maybe<Civilite>;
};

export type CiviliteChampDescriptor = ChampDescriptor & {
  __typename?: 'CiviliteChampDescriptor';
  /**
   * Description des champs d’un bloc répétable.
   * @deprecated Utilisez le champ `RepetitionChampDescriptor.champ_descriptors` à la place.
   */
  champDescriptors?: Maybe<Array<ChampDescriptor>>;
  /** Description du champ. */
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  /** Est-ce que le champ est obligatoire ? */
  required: Scalars['Boolean'];
  /**
   * Type de la valeur du champ.
   * @deprecated Utilisez le champ `__typename` à la place.
   */
  type: TypeDeChamp;
};

export type CnafChampDescriptor = ChampDescriptor & {
  __typename?: 'CnafChampDescriptor';
  /**
   * Description des champs d’un bloc répétable.
   * @deprecated Utilisez le champ `RepetitionChampDescriptor.champ_descriptors` à la place.
   */
  champDescriptors?: Maybe<Array<ChampDescriptor>>;
  /** Description du champ. */
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  /** Est-ce que le champ est obligatoire ? */
  required: Scalars['Boolean'];
  /**
   * Type de la valeur du champ.
   * @deprecated Utilisez le champ `__typename` à la place.
   */
  type: TypeDeChamp;
};

export type Commune = {
  __typename?: 'Commune';
  /** Le code INSEE */
  code: Scalars['String'];
  /** Le nom de la commune */
  name: Scalars['String'];
  /** Le code postal */
  postalCode?: Maybe<Scalars['String']>;
};

export type CommuneChamp = Champ & {
  __typename?: 'CommuneChamp';
  commune?: Maybe<Commune>;
  departement?: Maybe<Departement>;
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  /** La valeur du champ sous forme texte. */
  stringValue?: Maybe<Scalars['String']>;
};

export type CommuneChampDescriptor = ChampDescriptor & {
  __typename?: 'CommuneChampDescriptor';
  /**
   * Description des champs d’un bloc répétable.
   * @deprecated Utilisez le champ `RepetitionChampDescriptor.champ_descriptors` à la place.
   */
  champDescriptors?: Maybe<Array<ChampDescriptor>>;
  /** Description du champ. */
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  /** Est-ce que le champ est obligatoire ? */
  required: Scalars['Boolean'];
  /**
   * Type de la valeur du champ.
   * @deprecated Utilisez le champ `__typename` à la place.
   */
  type: TypeDeChamp;
};

/** Autogenerated input type of CreateDirectUpload */
export type CreateDirectUploadInput = {
  /** File size (bytes) */
  byteSize: Scalars['Int'];
  /** MD5 file checksum as base64 */
  checksum: Scalars['String'];
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** File content type */
  contentType: Scalars['String'];
  /** Dossier ID */
  dossierId: Scalars['ID'];
  /** Original file name */
  filename: Scalars['String'];
};

/** Autogenerated return type of CreateDirectUpload. */
export type CreateDirectUploadPayload = {
  __typename?: 'CreateDirectUploadPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  directUpload: DirectUpload;
};

export type DateChamp = Champ & {
  __typename?: 'DateChamp';
  /** La valeur du champ formaté en ISO8601 (Date). */
  date?: Maybe<Scalars['ISO8601Date']>;
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  /** La valeur du champ sous forme texte. */
  stringValue?: Maybe<Scalars['String']>;
  /**
   * La valeur du champ formaté en ISO8601 (DateTime).
   * @deprecated Utilisez le champ `date` ou le fragment `DatetimeChamp` à la place.
   */
  value?: Maybe<Scalars['ISO8601DateTime']>;
};

export type DateChampDescriptor = ChampDescriptor & {
  __typename?: 'DateChampDescriptor';
  /**
   * Description des champs d’un bloc répétable.
   * @deprecated Utilisez le champ `RepetitionChampDescriptor.champ_descriptors` à la place.
   */
  champDescriptors?: Maybe<Array<ChampDescriptor>>;
  /** Description du champ. */
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  /** Est-ce que le champ est obligatoire ? */
  required: Scalars['Boolean'];
  /**
   * Type de la valeur du champ.
   * @deprecated Utilisez le champ `__typename` à la place.
   */
  type: TypeDeChamp;
};

export type DatetimeChamp = Champ & {
  __typename?: 'DatetimeChamp';
  /** La valeur du champ formaté en ISO8601 (DateTime). */
  datetime?: Maybe<Scalars['ISO8601DateTime']>;
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  /** La valeur du champ sous forme texte. */
  stringValue?: Maybe<Scalars['String']>;
};

export type DatetimeChampDescriptor = ChampDescriptor & {
  __typename?: 'DatetimeChampDescriptor';
  /**
   * Description des champs d’un bloc répétable.
   * @deprecated Utilisez le champ `RepetitionChampDescriptor.champ_descriptors` à la place.
   */
  champDescriptors?: Maybe<Array<ChampDescriptor>>;
  /** Description du champ. */
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  /** Est-ce que le champ est obligatoire ? */
  required: Scalars['Boolean'];
  /**
   * Type de la valeur du champ.
   * @deprecated Utilisez le champ `__typename` à la place.
   */
  type: TypeDeChamp;
};

export type DecimalNumberChamp = Champ & {
  __typename?: 'DecimalNumberChamp';
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  /** La valeur du champ sous forme texte. */
  stringValue?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['Float']>;
};

export type DecimalNumberChampDescriptor = ChampDescriptor & {
  __typename?: 'DecimalNumberChampDescriptor';
  /**
   * Description des champs d’un bloc répétable.
   * @deprecated Utilisez le champ `RepetitionChampDescriptor.champ_descriptors` à la place.
   */
  champDescriptors?: Maybe<Array<ChampDescriptor>>;
  /** Description du champ. */
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  /** Est-ce que le champ est obligatoire ? */
  required: Scalars['Boolean'];
  /**
   * Type de la valeur du champ.
   * @deprecated Utilisez le champ `__typename` à la place.
   */
  type: TypeDeChamp;
};

/** Un dossier supprimé */
export type DeletedDossier = {
  __typename?: 'DeletedDossier';
  /** Date de suppression. */
  dateSupression: Scalars['ISO8601DateTime'];
  id: Scalars['ID'];
  /** Le numéro du dossier qui a été supprimé. */
  number: Scalars['Int'];
  /** La raison de la suppression du dossier. */
  reason: Scalars['String'];
  /** L’état du dossier supprimé. */
  state: DossierState;
};

/** The connection type for DeletedDossier. */
export type DeletedDossierConnection = {
  __typename?: 'DeletedDossierConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<DeletedDossierEdge>>>;
  /** A list of nodes. */
  nodes?: Maybe<Array<Maybe<DeletedDossier>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type DeletedDossierEdge = {
  __typename?: 'DeletedDossierEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node?: Maybe<DeletedDossier>;
};

export type Demandeur = {
  id: Scalars['ID'];
};

/** Une démarche */
export type Demarche = {
  __typename?: 'Demarche';
  activeRevision: Revision;
  /** @deprecated Utilisez le champ `activeRevision.annotationDescriptors` à la place. */
  annotationDescriptors: Array<ChampDescriptor>;
  /** @deprecated Utilisez le champ `activeRevision.champDescriptors` à la place. */
  champDescriptors: Array<ChampDescriptor>;
  /** Date de la création. */
  dateCreation: Scalars['ISO8601DateTime'];
  /** Date de la dépublication. */
  dateDepublication?: Maybe<Scalars['ISO8601DateTime']>;
  /** Date de la dernière modification. */
  dateDerniereModification: Scalars['ISO8601DateTime'];
  /** Date de la fermeture. */
  dateFermeture?: Maybe<Scalars['ISO8601DateTime']>;
  /** Date de la publication. */
  datePublication?: Maybe<Scalars['ISO8601DateTime']>;
  /** Pour une démarche déclarative, état cible des dossiers à valider automatiquement */
  declarative?: Maybe<DossierDeclarativeState>;
  /** Liste de tous les dossiers supprimés d’une démarche. */
  deletedDossiers: DeletedDossierConnection;
  /** Description de la démarche. */
  description: Scalars['String'];
  /** Liste de tous les dossiers d’une démarche. */
  dossiers: DossierConnection;
  draftRevision: Revision;
  groupeInstructeurs: Array<GroupeInstructeur>;
  id: Scalars['ID'];
  /** Numero de la démarche. */
  number: Scalars['Int'];
  /** Liste de tous les dossiers en attente de suppression définitive d’une démarche. */
  pendingDeletedDossiers: DeletedDossierConnection;
  publishedRevision?: Maybe<Revision>;
  revisions: Array<Revision>;
  service?: Maybe<Service>;
  /** État de la démarche. */
  state: DemarcheState;
  /** Titre de la démarche. */
  title: Scalars['String'];
};


/** Une démarche */
export type DemarcheDeletedDossiersArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  deletedSince?: InputMaybe<Scalars['ISO8601DateTime']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Order>;
};


/** Une démarche */
export type DemarcheDossiersArgs = {
  after?: InputMaybe<Scalars['String']>;
  archived?: InputMaybe<Scalars['Boolean']>;
  before?: InputMaybe<Scalars['String']>;
  createdSince?: InputMaybe<Scalars['ISO8601DateTime']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  maxRevision?: InputMaybe<Scalars['ID']>;
  minRevision?: InputMaybe<Scalars['ID']>;
  order?: InputMaybe<Order>;
  revision?: InputMaybe<Scalars['ID']>;
  state?: InputMaybe<DossierState>;
  updatedSince?: InputMaybe<Scalars['ISO8601DateTime']>;
};


/** Une démarche */
export type DemarcheGroupeInstructeursArgs = {
  closed?: InputMaybe<Scalars['Boolean']>;
};


/** Une démarche */
export type DemarchePendingDeletedDossiersArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  deletedSince?: InputMaybe<Scalars['ISO8601DateTime']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Order>;
};

/** Autogenerated input type of DemarcheCloner */
export type DemarcheClonerInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** La démarche */
  demarche: FindDemarcheInput;
  /** Le titre de la nouvelle démarche. */
  title?: InputMaybe<Scalars['String']>;
};

/** Autogenerated return type of DemarcheCloner. */
export type DemarcheClonerPayload = {
  __typename?: 'DemarcheClonerPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  demarche?: Maybe<DemarcheDescriptor>;
  errors?: Maybe<Array<ValidationError>>;
};

/**
 * Une démarche (métadonnées)
 * Ceci est une version abrégée du type `Demarche`, qui n’expose que les métadonnées.
 * Cela évite l’accès récursif aux dossiers.
 */
export type DemarcheDescriptor = {
  __typename?: 'DemarcheDescriptor';
  /** URL du cadre juridique qui justifie le droit de collecter les données demandées dans la démarche */
  cadreJuridiqueUrl?: Maybe<Scalars['String']>;
  /** Date de la création. */
  dateCreation: Scalars['ISO8601DateTime'];
  /** Date de la dépublication. */
  dateDepublication?: Maybe<Scalars['ISO8601DateTime']>;
  /** Date de la dernière modification. */
  dateDerniereModification: Scalars['ISO8601DateTime'];
  /** Date de la fermeture. */
  dateFermeture?: Maybe<Scalars['ISO8601DateTime']>;
  /** Date de la publication. */
  datePublication?: Maybe<Scalars['ISO8601DateTime']>;
  /** Pour une démarche déclarative, état cible des dossiers à valider automatiquement */
  declarative?: Maybe<DossierDeclarativeState>;
  /** fichier contenant le cadre juridique */
  deliberation?: Maybe<File>;
  /** URL pour commencer la démarche */
  demarcheUrl?: Maybe<Scalars['String']>;
  /** Description de la démarche. */
  description: Scalars['String'];
  /** URL ou email pour contacter le Délégué à la Protection des Données (DPO) */
  dpoUrl?: Maybe<Scalars['String']>;
  /** Durée de conservation des dossiers en mois. */
  dureeConservationDossiers: Scalars['Int'];
  id: Scalars['ID'];
  logo?: Maybe<File>;
  /** notice explicative de la démarche */
  notice?: Maybe<File>;
  noticeUrl?: Maybe<Scalars['String']>;
  /** Numero de la démarche. */
  number: Scalars['Int'];
  opendata: Scalars['Boolean'];
  revision: Revision;
  service?: Maybe<Service>;
  /** URL où les usagers trouvent le lien vers la démarche */
  siteWebUrl?: Maybe<Scalars['String']>;
  /** État de la démarche. */
  state: DemarcheState;
  /** mots ou expressions attribués à la démarche pour décrire son contenu et la retrouver */
  tags: Array<Scalars['String']>;
  /** Titre de la démarche. */
  title: Scalars['String'];
  /** ministère(s) ou collectivité(s) qui mettent en oeuvre la démarche */
  zones: Array<Scalars['String']>;
};

export enum DemarcheState {
  /** Brouillon */
  Brouillon = 'brouillon',
  /** Close */
  Close = 'close',
  /** Dépubliée */
  Depubliee = 'depubliee',
  /** Publiée */
  Publiee = 'publiee'
}

export type Departement = {
  __typename?: 'Departement';
  code: Scalars['String'];
  name: Scalars['String'];
};

export type DepartementChamp = Champ & {
  __typename?: 'DepartementChamp';
  departement?: Maybe<Departement>;
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  /** La valeur du champ sous forme texte. */
  stringValue?: Maybe<Scalars['String']>;
};

export type DepartementChampDescriptor = ChampDescriptor & {
  __typename?: 'DepartementChampDescriptor';
  /**
   * Description des champs d’un bloc répétable.
   * @deprecated Utilisez le champ `RepetitionChampDescriptor.champ_descriptors` à la place.
   */
  champDescriptors?: Maybe<Array<ChampDescriptor>>;
  /** Description du champ. */
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  /** List des departements. */
  options?: Maybe<Array<Departement>>;
  /** Est-ce que le champ est obligatoire ? */
  required: Scalars['Boolean'];
  /**
   * Type de la valeur du champ.
   * @deprecated Utilisez le champ `__typename` à la place.
   */
  type: TypeDeChamp;
};

export type DgfipChampDescriptor = ChampDescriptor & {
  __typename?: 'DgfipChampDescriptor';
  /**
   * Description des champs d’un bloc répétable.
   * @deprecated Utilisez le champ `RepetitionChampDescriptor.champ_descriptors` à la place.
   */
  champDescriptors?: Maybe<Array<ChampDescriptor>>;
  /** Description du champ. */
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  /** Est-ce que le champ est obligatoire ? */
  required: Scalars['Boolean'];
  /**
   * Type de la valeur du champ.
   * @deprecated Utilisez le champ `__typename` à la place.
   */
  type: TypeDeChamp;
};

/** Represents direct upload credentials */
export type DirectUpload = {
  __typename?: 'DirectUpload';
  /** Created blob record ID */
  blobId: Scalars['ID'];
  /** HTTP request headers (JSON-encoded) */
  headers: Scalars['String'];
  /** Created blob record signed ID */
  signedBlobId: Scalars['ID'];
  /** Upload URL */
  url: Scalars['String'];
};

/** Un dossier */
export type Dossier = {
  __typename?: 'Dossier';
  annotations: Array<Champ>;
  archived: Scalars['Boolean'];
  /** L’URL de l’attestation au format PDF. */
  attestation?: Maybe<File>;
  avis: Array<Avis>;
  champs: Array<Champ>;
  /** Date de dépôt. */
  dateDepot: Scalars['ISO8601DateTime'];
  /** Date de la dernière modification. */
  dateDerniereModification: Scalars['ISO8601DateTime'];
  /** Date d’expiration. */
  dateExpiration?: Maybe<Scalars['ISO8601DateTime']>;
  /** Date du dernier passage en construction. */
  datePassageEnConstruction: Scalars['ISO8601DateTime'];
  /** Date du dernier passage en instruction. */
  datePassageEnInstruction?: Maybe<Scalars['ISO8601DateTime']>;
  /** Date de la suppression par l’administration. */
  dateSuppressionParAdministration?: Maybe<Scalars['ISO8601DateTime']>;
  /** Date de la suppression par l’usager. */
  dateSuppressionParUsager?: Maybe<Scalars['ISO8601DateTime']>;
  /** Date du dernier traitement. */
  dateTraitement?: Maybe<Scalars['ISO8601DateTime']>;
  demandeur: Demandeur;
  demarche: DemarcheDescriptor;
  /** L’URL du GeoJSON contenant les données cartographiques du dossier. */
  geojson?: Maybe<File>;
  groupeInstructeur: GroupeInstructeur;
  id: Scalars['ID'];
  instructeurs: Array<Profile>;
  messages: Array<Message>;
  motivation?: Maybe<Scalars['String']>;
  motivationAttachment?: Maybe<File>;
  /** Le numero du dossier. */
  number: Scalars['Int'];
  /** L’URL du dossier au format PDF. */
  pdf?: Maybe<File>;
  /** @deprecated Utilisez le champ `demarche.revision` à la place. */
  revision: Revision;
  /** L’état du dossier. */
  state: DossierState;
  traitements: Array<Traitement>;
  usager: Profile;
};


/** Un dossier */
export type DossierAnnotationsArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


/** Un dossier */
export type DossierAvisArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


/** Un dossier */
export type DossierChampsArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


/** Un dossier */
export type DossierMessagesArgs = {
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated input type of DossierAccepter */
export type DossierAccepterInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Désactiver l’envoi de l’email de notification après l’opération */
  disableNotification?: InputMaybe<Scalars['Boolean']>;
  /** Dossier ID */
  dossierId: Scalars['ID'];
  /** Instructeur qui prend la décision sur le dossier. */
  instructeurId: Scalars['ID'];
  justificatif?: InputMaybe<Scalars['ID']>;
  motivation?: InputMaybe<Scalars['String']>;
};

/** Autogenerated return type of DossierAccepter. */
export type DossierAccepterPayload = {
  __typename?: 'DossierAccepterPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  dossier?: Maybe<Dossier>;
  errors?: Maybe<Array<ValidationError>>;
};

/** Autogenerated input type of DossierArchiver */
export type DossierArchiverInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Dossier ID */
  dossierId: Scalars['ID'];
  /** Instructeur qui prend la décision sur le dossier. */
  instructeurId: Scalars['ID'];
};

/** Autogenerated return type of DossierArchiver. */
export type DossierArchiverPayload = {
  __typename?: 'DossierArchiverPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  dossier?: Maybe<Dossier>;
  errors?: Maybe<Array<ValidationError>>;
};

/** Autogenerated input type of DossierChangerGroupeInstructeur */
export type DossierChangerGroupeInstructeurInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Dossier ID */
  dossierId: Scalars['ID'];
  /** Group instructeur a affecter */
  groupeInstructeurId: Scalars['ID'];
};

/** Autogenerated return type of DossierChangerGroupeInstructeur. */
export type DossierChangerGroupeInstructeurPayload = {
  __typename?: 'DossierChangerGroupeInstructeurPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  dossier?: Maybe<Dossier>;
  errors?: Maybe<Array<ValidationError>>;
};

/** Autogenerated input type of DossierClasserSansSuite */
export type DossierClasserSansSuiteInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Désactiver l’envoi de l’email de notification après l’opération */
  disableNotification?: InputMaybe<Scalars['Boolean']>;
  /** Dossier ID */
  dossierId: Scalars['ID'];
  /** Instructeur qui prend la décision sur le dossier. */
  instructeurId: Scalars['ID'];
  justificatif?: InputMaybe<Scalars['ID']>;
  motivation: Scalars['String'];
};

/** Autogenerated return type of DossierClasserSansSuite. */
export type DossierClasserSansSuitePayload = {
  __typename?: 'DossierClasserSansSuitePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  dossier?: Maybe<Dossier>;
  errors?: Maybe<Array<ValidationError>>;
};

/** The connection type for Dossier. */
export type DossierConnection = {
  __typename?: 'DossierConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<DossierEdge>>>;
  /** A list of nodes. */
  nodes?: Maybe<Array<Maybe<Dossier>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

export enum DossierDeclarativeState {
  /** Accepté */
  Accepte = 'accepte',
  /** En instruction */
  EnInstruction = 'en_instruction'
}

/** An edge in a connection. */
export type DossierEdge = {
  __typename?: 'DossierEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node?: Maybe<Dossier>;
};

/** Autogenerated input type of DossierEnvoyerMessage */
export type DossierEnvoyerMessageInput = {
  attachment?: InputMaybe<Scalars['ID']>;
  body: Scalars['String'];
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  dossierId: Scalars['ID'];
  instructeurId: Scalars['ID'];
};

/** Autogenerated return type of DossierEnvoyerMessage. */
export type DossierEnvoyerMessagePayload = {
  __typename?: 'DossierEnvoyerMessagePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  errors?: Maybe<Array<ValidationError>>;
  message?: Maybe<Message>;
};

export type DossierLinkChamp = Champ & {
  __typename?: 'DossierLinkChamp';
  dossier?: Maybe<Dossier>;
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  /** La valeur du champ sous forme texte. */
  stringValue?: Maybe<Scalars['String']>;
};

export type DossierLinkChampDescriptor = ChampDescriptor & {
  __typename?: 'DossierLinkChampDescriptor';
  /**
   * Description des champs d’un bloc répétable.
   * @deprecated Utilisez le champ `RepetitionChampDescriptor.champ_descriptors` à la place.
   */
  champDescriptors?: Maybe<Array<ChampDescriptor>>;
  /** Description du champ. */
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  /** Est-ce que le champ est obligatoire ? */
  required: Scalars['Boolean'];
  /**
   * Type de la valeur du champ.
   * @deprecated Utilisez le champ `__typename` à la place.
   */
  type: TypeDeChamp;
};

/** Autogenerated input type of DossierModifierAnnotationAjouterLigne */
export type DossierModifierAnnotationAjouterLigneInput = {
  /** Annotation ID */
  annotationId: Scalars['ID'];
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Dossier ID */
  dossierId: Scalars['ID'];
  /** Instructeur qui demande la modification. */
  instructeurId: Scalars['ID'];
};

/** Autogenerated return type of DossierModifierAnnotationAjouterLigne. */
export type DossierModifierAnnotationAjouterLignePayload = {
  __typename?: 'DossierModifierAnnotationAjouterLignePayload';
  annotation?: Maybe<RepetitionChamp>;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  errors?: Maybe<Array<ValidationError>>;
};

/** Autogenerated input type of DossierModifierAnnotationCheckbox */
export type DossierModifierAnnotationCheckboxInput = {
  /** Annotation ID */
  annotationId: Scalars['ID'];
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Dossier ID */
  dossierId: Scalars['ID'];
  /** Instructeur qui demande la modification. */
  instructeurId: Scalars['ID'];
  value: Scalars['Boolean'];
};

/** Autogenerated return type of DossierModifierAnnotationCheckbox. */
export type DossierModifierAnnotationCheckboxPayload = {
  __typename?: 'DossierModifierAnnotationCheckboxPayload';
  annotation?: Maybe<Champ>;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  errors?: Maybe<Array<ValidationError>>;
};

/** Autogenerated input type of DossierModifierAnnotationDate */
export type DossierModifierAnnotationDateInput = {
  /** Annotation ID */
  annotationId: Scalars['ID'];
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Dossier ID */
  dossierId: Scalars['ID'];
  /** Instructeur qui demande la modification. */
  instructeurId: Scalars['ID'];
  value: Scalars['ISO8601Date'];
};

/** Autogenerated return type of DossierModifierAnnotationDate. */
export type DossierModifierAnnotationDatePayload = {
  __typename?: 'DossierModifierAnnotationDatePayload';
  annotation?: Maybe<Champ>;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  errors?: Maybe<Array<ValidationError>>;
};

/** Autogenerated input type of DossierModifierAnnotationDatetime */
export type DossierModifierAnnotationDatetimeInput = {
  /** Annotation ID */
  annotationId: Scalars['ID'];
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Dossier ID */
  dossierId: Scalars['ID'];
  /** Instructeur qui demande la modification. */
  instructeurId: Scalars['ID'];
  value: Scalars['ISO8601DateTime'];
};

/** Autogenerated return type of DossierModifierAnnotationDatetime. */
export type DossierModifierAnnotationDatetimePayload = {
  __typename?: 'DossierModifierAnnotationDatetimePayload';
  annotation?: Maybe<Champ>;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  errors?: Maybe<Array<ValidationError>>;
};

/** Autogenerated input type of DossierModifierAnnotationIntegerNumber */
export type DossierModifierAnnotationIntegerNumberInput = {
  /** Annotation ID */
  annotationId: Scalars['ID'];
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Dossier ID */
  dossierId: Scalars['ID'];
  /** Instructeur qui demande la modification. */
  instructeurId: Scalars['ID'];
  value: Scalars['Int'];
};

/** Autogenerated return type of DossierModifierAnnotationIntegerNumber. */
export type DossierModifierAnnotationIntegerNumberPayload = {
  __typename?: 'DossierModifierAnnotationIntegerNumberPayload';
  annotation?: Maybe<Champ>;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  errors?: Maybe<Array<ValidationError>>;
};

/** Autogenerated input type of DossierModifierAnnotationText */
export type DossierModifierAnnotationTextInput = {
  /** Annotation ID */
  annotationId: Scalars['ID'];
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Dossier ID */
  dossierId: Scalars['ID'];
  /** Instructeur qui demande la modification. */
  instructeurId: Scalars['ID'];
  value: Scalars['String'];
};

/** Autogenerated return type of DossierModifierAnnotationText. */
export type DossierModifierAnnotationTextPayload = {
  __typename?: 'DossierModifierAnnotationTextPayload';
  annotation?: Maybe<Champ>;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  errors?: Maybe<Array<ValidationError>>;
};

/** Autogenerated input type of DossierPasserEnInstruction */
export type DossierPasserEnInstructionInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Désactiver l’envoi de l’email de notification après l’opération */
  disableNotification?: InputMaybe<Scalars['Boolean']>;
  /** Dossier ID */
  dossierId: Scalars['ID'];
  /** Instructeur qui prend la décision sur le dossier. */
  instructeurId: Scalars['ID'];
};

/** Autogenerated return type of DossierPasserEnInstruction. */
export type DossierPasserEnInstructionPayload = {
  __typename?: 'DossierPasserEnInstructionPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  dossier?: Maybe<Dossier>;
  errors?: Maybe<Array<ValidationError>>;
};

/** Autogenerated input type of DossierRefuser */
export type DossierRefuserInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Désactiver l’envoi de l’email de notification après l’opération */
  disableNotification?: InputMaybe<Scalars['Boolean']>;
  /** Dossier ID */
  dossierId: Scalars['ID'];
  /** Instructeur qui prend la décision sur le dossier. */
  instructeurId: Scalars['ID'];
  justificatif?: InputMaybe<Scalars['ID']>;
  motivation: Scalars['String'];
};

/** Autogenerated return type of DossierRefuser. */
export type DossierRefuserPayload = {
  __typename?: 'DossierRefuserPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  dossier?: Maybe<Dossier>;
  errors?: Maybe<Array<ValidationError>>;
};

/** Autogenerated input type of DossierRepasserEnConstruction */
export type DossierRepasserEnConstructionInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Désactiver l’envoi de l’email de notification après l’opération */
  disableNotification?: InputMaybe<Scalars['Boolean']>;
  /** Dossier ID */
  dossierId: Scalars['ID'];
  /** Instructeur qui prend la décision sur le dossier. */
  instructeurId: Scalars['ID'];
};

/** Autogenerated return type of DossierRepasserEnConstruction. */
export type DossierRepasserEnConstructionPayload = {
  __typename?: 'DossierRepasserEnConstructionPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  dossier?: Maybe<Dossier>;
  errors?: Maybe<Array<ValidationError>>;
};

/** Autogenerated input type of DossierRepasserEnInstruction */
export type DossierRepasserEnInstructionInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Désactiver l’envoi de l’email de notification après l’opération */
  disableNotification?: InputMaybe<Scalars['Boolean']>;
  /** Dossier ID */
  dossierId: Scalars['ID'];
  /** Instructeur qui prend la décision sur le dossier. */
  instructeurId: Scalars['ID'];
};

/** Autogenerated return type of DossierRepasserEnInstruction. */
export type DossierRepasserEnInstructionPayload = {
  __typename?: 'DossierRepasserEnInstructionPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  dossier?: Maybe<Dossier>;
  errors?: Maybe<Array<ValidationError>>;
};

export enum DossierState {
  /** Accepté */
  Accepte = 'accepte',
  /** En construction */
  EnConstruction = 'en_construction',
  /** En instruction */
  EnInstruction = 'en_instruction',
  /** Refusé */
  Refuse = 'refuse',
  /** Classé sans suite */
  SansSuite = 'sans_suite'
}

export type DropDownListChampDescriptor = ChampDescriptor & {
  __typename?: 'DropDownListChampDescriptor';
  /**
   * Description des champs d’un bloc répétable.
   * @deprecated Utilisez le champ `RepetitionChampDescriptor.champ_descriptors` à la place.
   */
  champDescriptors?: Maybe<Array<ChampDescriptor>>;
  /** Description du champ. */
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  /** List des options d’un champ avec selection. */
  options?: Maybe<Array<Scalars['String']>>;
  /** La selection contien l’option "Autre". */
  otherOption?: Maybe<Scalars['Boolean']>;
  /** Est-ce que le champ est obligatoire ? */
  required: Scalars['Boolean'];
  /**
   * Type de la valeur du champ.
   * @deprecated Utilisez le champ `__typename` à la place.
   */
  type: TypeDeChamp;
};

export type Effectif = {
  __typename?: 'Effectif';
  nb: Scalars['Float'];
  periode: Scalars['String'];
};

export type EmailChampDescriptor = ChampDescriptor & {
  __typename?: 'EmailChampDescriptor';
  /**
   * Description des champs d’un bloc répétable.
   * @deprecated Utilisez le champ `RepetitionChampDescriptor.champ_descriptors` à la place.
   */
  champDescriptors?: Maybe<Array<ChampDescriptor>>;
  /** Description du champ. */
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  /** Est-ce que le champ est obligatoire ? */
  required: Scalars['Boolean'];
  /**
   * Type de la valeur du champ.
   * @deprecated Utilisez le champ `__typename` à la place.
   */
  type: TypeDeChamp;
};

export type Entreprise = {
  __typename?: 'Entreprise';
  attestationFiscaleAttachment?: Maybe<File>;
  attestationSocialeAttachment?: Maybe<File>;
  /** capital social de l’entreprise. -1 si inconnu. */
  capitalSocial?: Maybe<Scalars['BigInt']>;
  codeEffectifEntreprise?: Maybe<Scalars['String']>;
  dateCreation?: Maybe<Scalars['ISO8601Date']>;
  /** effectif moyen d’une année */
  effectifAnnuel?: Maybe<Effectif>;
  /** effectif pour un mois donné */
  effectifMensuel?: Maybe<Effectif>;
  etatAdministratif?: Maybe<EntrepriseEtatAdministratif>;
  formeJuridique?: Maybe<Scalars['String']>;
  formeJuridiqueCode?: Maybe<Scalars['String']>;
  inlineAdresse: Scalars['String'];
  nom?: Maybe<Scalars['String']>;
  nomCommercial: Scalars['String'];
  numeroTvaIntracommunautaire?: Maybe<Scalars['String']>;
  prenom?: Maybe<Scalars['String']>;
  raisonSociale: Scalars['String'];
  siren: Scalars['String'];
  siretSiegeSocial: Scalars['String'];
};

export enum EntrepriseEtatAdministratif {
  /** L'entreprise est en activité */
  Actif = 'Actif',
  /** L'entreprise a cessé son activité */
  Ferme = 'Ferme'
}

export type Epci = {
  __typename?: 'Epci';
  code: Scalars['String'];
  name: Scalars['String'];
};

export type EpciChamp = Champ & {
  __typename?: 'EpciChamp';
  departement?: Maybe<Departement>;
  epci?: Maybe<Epci>;
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  /** La valeur du champ sous forme texte. */
  stringValue?: Maybe<Scalars['String']>;
};

export type EpciChampDescriptor = ChampDescriptor & {
  __typename?: 'EpciChampDescriptor';
  /**
   * Description des champs d’un bloc répétable.
   * @deprecated Utilisez le champ `RepetitionChampDescriptor.champ_descriptors` à la place.
   */
  champDescriptors?: Maybe<Array<ChampDescriptor>>;
  /** Description du champ. */
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  /** Est-ce que le champ est obligatoire ? */
  required: Scalars['Boolean'];
  /**
   * Type de la valeur du champ.
   * @deprecated Utilisez le champ `__typename` à la place.
   */
  type: TypeDeChamp;
};

export type ExplicationChampDescriptor = ChampDescriptor & {
  __typename?: 'ExplicationChampDescriptor';
  /**
   * Description des champs d’un bloc répétable.
   * @deprecated Utilisez le champ `RepetitionChampDescriptor.champ_descriptors` à la place.
   */
  champDescriptors?: Maybe<Array<ChampDescriptor>>;
  collapsibleExplanationEnabled?: Maybe<Scalars['Boolean']>;
  collapsibleExplanationText?: Maybe<Scalars['String']>;
  /** Description du champ. */
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  /** Est-ce que le champ est obligatoire ? */
  required: Scalars['Boolean'];
  /**
   * Type de la valeur du champ.
   * @deprecated Utilisez le champ `__typename` à la place.
   */
  type: TypeDeChamp;
};

export type File = {
  __typename?: 'File';
  /** @deprecated Utilisez le champ `byteSizeBigInt` à la place. */
  byteSize: Scalars['Int'];
  byteSizeBigInt: Scalars['BigInt'];
  checksum: Scalars['String'];
  contentType: Scalars['String'];
  filename: Scalars['String'];
  url: Scalars['URL'];
};

export type FindDemarcheInput =
  /** ID de la démarche. */
  { id: Scalars['ID']; number?: never; }
  |  /** Numero de la démarche. */
  { id?: never; number: Scalars['Int']; };

export type GeoArea = {
  description?: Maybe<Scalars['String']>;
  geometry: GeoJson;
  id: Scalars['ID'];
  source: GeoAreaSource;
};

export enum GeoAreaSource {
  /** Parcelle cadastrale */
  Cadastre = 'cadastre',
  /** Sélection utilisateur */
  SelectionUtilisateur = 'selection_utilisateur'
}

export type GeoJson = {
  __typename?: 'GeoJSON';
  coordinates: Scalars['Coordinates'];
  type: Scalars['String'];
};

/** Un groupe instructeur */
export type GroupeInstructeur = {
  __typename?: 'GroupeInstructeur';
  /** L’état du groupe instructeur. */
  closed: Scalars['Boolean'];
  id: Scalars['ID'];
  instructeurs: Array<Profile>;
  /** Libellé du groupe instructeur. */
  label: Scalars['String'];
  /** Le numero du groupe instructeur. */
  number: Scalars['Int'];
};

/** Autogenerated input type of GroupeInstructeurAjouterInstructeurs */
export type GroupeInstructeurAjouterInstructeursInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Groupe instructeur ID. */
  groupeInstructeurId: Scalars['ID'];
  /** Instructeurs à ajouter. */
  instructeurs: Array<ProfileInput>;
};

/** Autogenerated return type of GroupeInstructeurAjouterInstructeurs. */
export type GroupeInstructeurAjouterInstructeursPayload = {
  __typename?: 'GroupeInstructeurAjouterInstructeursPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  errors?: Maybe<Array<ValidationError>>;
  groupeInstructeur?: Maybe<GroupeInstructeur>;
  warnings?: Maybe<Array<WarningMessage>>;
};

/** Attributs pour l’ajout d'un groupe instructeur. */
export type GroupeInstructeurAttributes = {
  /** L’état du groupe instructeur. */
  closed?: InputMaybe<Scalars['Boolean']>;
  /** Instructeurs à ajouter. */
  instructeurs?: InputMaybe<Array<ProfileInput>>;
  /** Libelle du groupe instructeur. */
  label: Scalars['String'];
};

/** Autogenerated input type of GroupeInstructeurCreer */
export type GroupeInstructeurCreerInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Demarche ID ou numéro. */
  demarche: FindDemarcheInput;
  /** Groupes instructeur à ajouter. */
  groupeInstructeur: GroupeInstructeurAttributes;
};

/** Autogenerated return type of GroupeInstructeurCreer. */
export type GroupeInstructeurCreerPayload = {
  __typename?: 'GroupeInstructeurCreerPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  errors?: Maybe<Array<ValidationError>>;
  groupeInstructeur?: Maybe<GroupeInstructeur>;
  warnings?: Maybe<Array<WarningMessage>>;
};

/** Autogenerated input type of GroupeInstructeurModifier */
export type GroupeInstructeurModifierInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** L’état du groupe instructeur. */
  closed?: InputMaybe<Scalars['Boolean']>;
  /** Groupe instructeur ID. */
  groupeInstructeurId: Scalars['ID'];
  /** Libellé du groupe instructeur. */
  label?: InputMaybe<Scalars['String']>;
};

/** Autogenerated return type of GroupeInstructeurModifier. */
export type GroupeInstructeurModifierPayload = {
  __typename?: 'GroupeInstructeurModifierPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  errors?: Maybe<Array<ValidationError>>;
  groupeInstructeur?: Maybe<GroupeInstructeur>;
};

/** Autogenerated input type of GroupeInstructeurSupprimerInstructeurs */
export type GroupeInstructeurSupprimerInstructeursInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Groupe instructeur ID. */
  groupeInstructeurId: Scalars['ID'];
  /** Instructeurs à supprimer. */
  instructeurs: Array<ProfileInput>;
};

/** Autogenerated return type of GroupeInstructeurSupprimerInstructeurs. */
export type GroupeInstructeurSupprimerInstructeursPayload = {
  __typename?: 'GroupeInstructeurSupprimerInstructeursPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  errors?: Maybe<Array<ValidationError>>;
  groupeInstructeur?: Maybe<GroupeInstructeur>;
};

/** Un groupe instructeur avec ses dossiers */
export type GroupeInstructeurWithDossiers = {
  __typename?: 'GroupeInstructeurWithDossiers';
  /** L’état du groupe instructeur. */
  closed: Scalars['Boolean'];
  /** Liste de tous les dossiers supprimés d’un groupe instructeur. */
  deletedDossiers: DeletedDossierConnection;
  /** Liste de tous les dossiers d’un groupe instructeur. */
  dossiers: DossierConnection;
  id: Scalars['ID'];
  instructeurs: Array<Profile>;
  /** Libellé du groupe instructeur. */
  label: Scalars['String'];
  /** Le numero du groupe instructeur. */
  number: Scalars['Int'];
  /** Liste de tous les dossiers en attente de suppression définitive d’un groupe instructeur. */
  pendingDeletedDossiers: DeletedDossierConnection;
};


/** Un groupe instructeur avec ses dossiers */
export type GroupeInstructeurWithDossiersDeletedDossiersArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  deletedSince?: InputMaybe<Scalars['ISO8601DateTime']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Order>;
};


/** Un groupe instructeur avec ses dossiers */
export type GroupeInstructeurWithDossiersDossiersArgs = {
  after?: InputMaybe<Scalars['String']>;
  archived?: InputMaybe<Scalars['Boolean']>;
  before?: InputMaybe<Scalars['String']>;
  createdSince?: InputMaybe<Scalars['ISO8601DateTime']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  maxRevision?: InputMaybe<Scalars['ID']>;
  minRevision?: InputMaybe<Scalars['ID']>;
  order?: InputMaybe<Order>;
  revision?: InputMaybe<Scalars['ID']>;
  state?: InputMaybe<DossierState>;
  updatedSince?: InputMaybe<Scalars['ISO8601DateTime']>;
};


/** Un groupe instructeur avec ses dossiers */
export type GroupeInstructeurWithDossiersPendingDeletedDossiersArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  deletedSince?: InputMaybe<Scalars['ISO8601DateTime']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Order>;
};

export type HeaderSectionChampDescriptor = ChampDescriptor & {
  __typename?: 'HeaderSectionChampDescriptor';
  /**
   * Description des champs d’un bloc répétable.
   * @deprecated Utilisez le champ `RepetitionChampDescriptor.champ_descriptors` à la place.
   */
  champDescriptors?: Maybe<Array<ChampDescriptor>>;
  /** Description du champ. */
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  /** Est-ce que le champ est obligatoire ? */
  required: Scalars['Boolean'];
  /**
   * Type de la valeur du champ.
   * @deprecated Utilisez le champ `__typename` à la place.
   */
  type: TypeDeChamp;
};

export type IbanChampDescriptor = ChampDescriptor & {
  __typename?: 'IbanChampDescriptor';
  /**
   * Description des champs d’un bloc répétable.
   * @deprecated Utilisez le champ `RepetitionChampDescriptor.champ_descriptors` à la place.
   */
  champDescriptors?: Maybe<Array<ChampDescriptor>>;
  /** Description du champ. */
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  /** Est-ce que le champ est obligatoire ? */
  required: Scalars['Boolean'];
  /**
   * Type de la valeur du champ.
   * @deprecated Utilisez le champ `__typename` à la place.
   */
  type: TypeDeChamp;
};

export type IntegerNumberChamp = Champ & {
  __typename?: 'IntegerNumberChamp';
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  /** La valeur du champ sous forme texte. */
  stringValue?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['BigInt']>;
};

export type IntegerNumberChampDescriptor = ChampDescriptor & {
  __typename?: 'IntegerNumberChampDescriptor';
  /**
   * Description des champs d’un bloc répétable.
   * @deprecated Utilisez le champ `RepetitionChampDescriptor.champ_descriptors` à la place.
   */
  champDescriptors?: Maybe<Array<ChampDescriptor>>;
  /** Description du champ. */
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  /** Est-ce que le champ est obligatoire ? */
  required: Scalars['Boolean'];
  /**
   * Type de la valeur du champ.
   * @deprecated Utilisez le champ `__typename` à la place.
   */
  type: TypeDeChamp;
};

export type LinkedDropDownListChamp = Champ & {
  __typename?: 'LinkedDropDownListChamp';
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  primaryValue?: Maybe<Scalars['String']>;
  secondaryValue?: Maybe<Scalars['String']>;
  /** La valeur du champ sous forme texte. */
  stringValue?: Maybe<Scalars['String']>;
};

export type LinkedDropDownListChampDescriptor = ChampDescriptor & {
  __typename?: 'LinkedDropDownListChampDescriptor';
  /**
   * Description des champs d’un bloc répétable.
   * @deprecated Utilisez le champ `RepetitionChampDescriptor.champ_descriptors` à la place.
   */
  champDescriptors?: Maybe<Array<ChampDescriptor>>;
  /** Description du champ. */
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  /** List des options d’un champ avec selection. */
  options?: Maybe<Array<Scalars['String']>>;
  /** Est-ce que le champ est obligatoire ? */
  required: Scalars['Boolean'];
  /**
   * Type de la valeur du champ.
   * @deprecated Utilisez le champ `__typename` à la place.
   */
  type: TypeDeChamp;
};

export type MesriChampDescriptor = ChampDescriptor & {
  __typename?: 'MesriChampDescriptor';
  /**
   * Description des champs d’un bloc répétable.
   * @deprecated Utilisez le champ `RepetitionChampDescriptor.champ_descriptors` à la place.
   */
  champDescriptors?: Maybe<Array<ChampDescriptor>>;
  /** Description du champ. */
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  /** Est-ce que le champ est obligatoire ? */
  required: Scalars['Boolean'];
  /**
   * Type de la valeur du champ.
   * @deprecated Utilisez le champ `__typename` à la place.
   */
  type: TypeDeChamp;
};

export type Message = {
  __typename?: 'Message';
  /** @deprecated Utilisez le champ `attachments` à la place. */
  attachment?: Maybe<File>;
  attachments: Array<File>;
  body: Scalars['String'];
  createdAt: Scalars['ISO8601DateTime'];
  email: Scalars['String'];
  id: Scalars['ID'];
};

export type MultipleDropDownListChamp = Champ & {
  __typename?: 'MultipleDropDownListChamp';
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  /** La valeur du champ sous forme texte. */
  stringValue?: Maybe<Scalars['String']>;
  values: Array<Scalars['String']>;
};

export type MultipleDropDownListChampDescriptor = ChampDescriptor & {
  __typename?: 'MultipleDropDownListChampDescriptor';
  /**
   * Description des champs d’un bloc répétable.
   * @deprecated Utilisez le champ `RepetitionChampDescriptor.champ_descriptors` à la place.
   */
  champDescriptors?: Maybe<Array<ChampDescriptor>>;
  /** Description du champ. */
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  /** List des options d’un champ avec selection. */
  options?: Maybe<Array<Scalars['String']>>;
  /** Est-ce que le champ est obligatoire ? */
  required: Scalars['Boolean'];
  /**
   * Type de la valeur du champ.
   * @deprecated Utilisez le champ `__typename` à la place.
   */
  type: TypeDeChamp;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** File information required to prepare a direct upload */
  createDirectUpload?: Maybe<CreateDirectUploadPayload>;
  /** Cloner une démarche. */
  demarcheCloner?: Maybe<DemarcheClonerPayload>;
  /** Accepter le dossier. */
  dossierAccepter?: Maybe<DossierAccepterPayload>;
  /** Archiver le dossier. */
  dossierArchiver?: Maybe<DossierArchiverPayload>;
  /** Changer le grope instructeur du dossier. */
  dossierChangerGroupeInstructeur?: Maybe<DossierChangerGroupeInstructeurPayload>;
  /** Classer le dossier sans suite. */
  dossierClasserSansSuite?: Maybe<DossierClasserSansSuitePayload>;
  /** Envoyer un message à l'usager du dossier. */
  dossierEnvoyerMessage?: Maybe<DossierEnvoyerMessagePayload>;
  dossierModifierAnnotationAjouterLigne?: Maybe<DossierModifierAnnotationAjouterLignePayload>;
  /** Modifier l’annotation au format oui/non. */
  dossierModifierAnnotationCheckbox?: Maybe<DossierModifierAnnotationCheckboxPayload>;
  /** Modifier l’annotation au format date. */
  dossierModifierAnnotationDate?: Maybe<DossierModifierAnnotationDatePayload>;
  /** Modifier l’annotation au format date et heure. */
  dossierModifierAnnotationDatetime?: Maybe<DossierModifierAnnotationDatetimePayload>;
  /** Modifier l’annotation au format nombre entier. */
  dossierModifierAnnotationIntegerNumber?: Maybe<DossierModifierAnnotationIntegerNumberPayload>;
  /** Modifier l’annotation au format text. */
  dossierModifierAnnotationText?: Maybe<DossierModifierAnnotationTextPayload>;
  /** Passer le dossier en instruction. */
  dossierPasserEnInstruction?: Maybe<DossierPasserEnInstructionPayload>;
  /** Refuser le dossier. */
  dossierRefuser?: Maybe<DossierRefuserPayload>;
  /** Re-passer le dossier en construction. */
  dossierRepasserEnConstruction?: Maybe<DossierRepasserEnConstructionPayload>;
  /** Re-passer le dossier en instruction. */
  dossierRepasserEnInstruction?: Maybe<DossierRepasserEnInstructionPayload>;
  /** Ajouter des instructeurs à un groupe instructeur. */
  groupeInstructeurAjouterInstructeurs?: Maybe<GroupeInstructeurAjouterInstructeursPayload>;
  /** Crée un groupe instructeur. */
  groupeInstructeurCreer?: Maybe<GroupeInstructeurCreerPayload>;
  /** Modifier un groupe instructeur. */
  groupeInstructeurModifier?: Maybe<GroupeInstructeurModifierPayload>;
  /** Supprimer des instructeurs d’un groupe instructeur. */
  groupeInstructeurSupprimerInstructeurs?: Maybe<GroupeInstructeurSupprimerInstructeursPayload>;
};


export type MutationCreateDirectUploadArgs = {
  input: CreateDirectUploadInput;
};


export type MutationDemarcheClonerArgs = {
  input: DemarcheClonerInput;
};


export type MutationDossierAccepterArgs = {
  input: DossierAccepterInput;
};


export type MutationDossierArchiverArgs = {
  input: DossierArchiverInput;
};


export type MutationDossierChangerGroupeInstructeurArgs = {
  input: DossierChangerGroupeInstructeurInput;
};


export type MutationDossierClasserSansSuiteArgs = {
  input: DossierClasserSansSuiteInput;
};


export type MutationDossierEnvoyerMessageArgs = {
  input: DossierEnvoyerMessageInput;
};


export type MutationDossierModifierAnnotationAjouterLigneArgs = {
  input: DossierModifierAnnotationAjouterLigneInput;
};


export type MutationDossierModifierAnnotationCheckboxArgs = {
  input: DossierModifierAnnotationCheckboxInput;
};


export type MutationDossierModifierAnnotationDateArgs = {
  input: DossierModifierAnnotationDateInput;
};


export type MutationDossierModifierAnnotationDatetimeArgs = {
  input: DossierModifierAnnotationDatetimeInput;
};


export type MutationDossierModifierAnnotationIntegerNumberArgs = {
  input: DossierModifierAnnotationIntegerNumberInput;
};


export type MutationDossierModifierAnnotationTextArgs = {
  input: DossierModifierAnnotationTextInput;
};


export type MutationDossierPasserEnInstructionArgs = {
  input: DossierPasserEnInstructionInput;
};


export type MutationDossierRefuserArgs = {
  input: DossierRefuserInput;
};


export type MutationDossierRepasserEnConstructionArgs = {
  input: DossierRepasserEnConstructionInput;
};


export type MutationDossierRepasserEnInstructionArgs = {
  input: DossierRepasserEnInstructionInput;
};


export type MutationGroupeInstructeurAjouterInstructeursArgs = {
  input: GroupeInstructeurAjouterInstructeursInput;
};


export type MutationGroupeInstructeurCreerArgs = {
  input: GroupeInstructeurCreerInput;
};


export type MutationGroupeInstructeurModifierArgs = {
  input: GroupeInstructeurModifierInput;
};


export type MutationGroupeInstructeurSupprimerInstructeursArgs = {
  input: GroupeInstructeurSupprimerInstructeursInput;
};

export type NumberChampDescriptor = ChampDescriptor & {
  __typename?: 'NumberChampDescriptor';
  /**
   * Description des champs d’un bloc répétable.
   * @deprecated Utilisez le champ `RepetitionChampDescriptor.champ_descriptors` à la place.
   */
  champDescriptors?: Maybe<Array<ChampDescriptor>>;
  /** Description du champ. */
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  /** Est-ce que le champ est obligatoire ? */
  required: Scalars['Boolean'];
  /**
   * Type de la valeur du champ.
   * @deprecated Utilisez le champ `__typename` à la place.
   */
  type: TypeDeChamp;
};

export enum Order {
  /** L’ordre ascendant. */
  Asc = 'ASC',
  /** L’ordre descendant. */
  Desc = 'DESC'
}

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']>;
};

export type ParcelleCadastrale = GeoArea & {
  __typename?: 'ParcelleCadastrale';
  /** @deprecated Utilisez le champ `prefixe` à la place. */
  codeArr: Scalars['String'];
  /** @deprecated Utilisez le champ `commune` à la place. */
  codeCom: Scalars['String'];
  /** @deprecated Utilisez le champ `commune` à la place. */
  codeDep: Scalars['String'];
  commune: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  /** @deprecated L’information n’est plus disponible. */
  feuille: Scalars['Int'];
  geometry: GeoJson;
  id: Scalars['ID'];
  /** @deprecated Utilisez le champ `commune` à la place. */
  nomCom: Scalars['String'];
  numero: Scalars['String'];
  prefixe: Scalars['String'];
  section: Scalars['String'];
  source: GeoAreaSource;
  surface: Scalars['String'];
  /** @deprecated L’information n’est plus disponible. */
  surfaceIntersection: Scalars['Float'];
  /** @deprecated Utilisez le champ `surface` à la place. */
  surfaceParcelle: Scalars['Float'];
};

export type Pays = {
  __typename?: 'Pays';
  code: Scalars['String'];
  name: Scalars['String'];
};

export type PaysChamp = Champ & {
  __typename?: 'PaysChamp';
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  pays?: Maybe<Pays>;
  /** La valeur du champ sous forme texte. */
  stringValue?: Maybe<Scalars['String']>;
};

export type PaysChampDescriptor = ChampDescriptor & {
  __typename?: 'PaysChampDescriptor';
  /**
   * Description des champs d’un bloc répétable.
   * @deprecated Utilisez le champ `RepetitionChampDescriptor.champ_descriptors` à la place.
   */
  champDescriptors?: Maybe<Array<ChampDescriptor>>;
  /** Description du champ. */
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  /** List des pays. */
  options?: Maybe<Array<Pays>>;
  /** Est-ce que le champ est obligatoire ? */
  required: Scalars['Boolean'];
  /**
   * Type de la valeur du champ.
   * @deprecated Utilisez le champ `__typename` à la place.
   */
  type: TypeDeChamp;
};

export type PersonneMorale = Demandeur & {
  __typename?: 'PersonneMorale';
  address: Address;
  /** @deprecated Utilisez le champ `address.label` à la place. */
  adresse: Scalars['String'];
  association?: Maybe<Association>;
  /** @deprecated Utilisez le champ `address.city_code` à la place. */
  codeInseeLocalite: Scalars['String'];
  /** @deprecated Utilisez le champ `address.postal_code` à la place. */
  codePostal: Scalars['String'];
  /** @deprecated Utilisez le champ `address` à la place. */
  complementAdresse?: Maybe<Scalars['String']>;
  entreprise?: Maybe<Entreprise>;
  id: Scalars['ID'];
  libelleNaf: Scalars['String'];
  /** @deprecated Utilisez le champ `address.city_name` à la place. */
  localite: Scalars['String'];
  naf?: Maybe<Scalars['String']>;
  /** @deprecated Utilisez le champ `address.street_name` à la place. */
  nomVoie?: Maybe<Scalars['String']>;
  /** @deprecated Utilisez le champ `address.street_number` à la place. */
  numeroVoie?: Maybe<Scalars['String']>;
  siegeSocial: Scalars['Boolean'];
  siret: Scalars['String'];
  /** @deprecated Utilisez le champ `address.street_address` à la place. */
  typeVoie?: Maybe<Scalars['String']>;
};

export type PersonneMoraleIncomplete = Demandeur & {
  __typename?: 'PersonneMoraleIncomplete';
  id: Scalars['ID'];
  siret: Scalars['String'];
};

export type PersonnePhysique = Demandeur & {
  __typename?: 'PersonnePhysique';
  civilite?: Maybe<Civilite>;
  dateDeNaissance?: Maybe<Scalars['ISO8601Date']>;
  id: Scalars['ID'];
  nom: Scalars['String'];
  prenom: Scalars['String'];
};

export type PhoneChampDescriptor = ChampDescriptor & {
  __typename?: 'PhoneChampDescriptor';
  /**
   * Description des champs d’un bloc répétable.
   * @deprecated Utilisez le champ `RepetitionChampDescriptor.champ_descriptors` à la place.
   */
  champDescriptors?: Maybe<Array<ChampDescriptor>>;
  /** Description du champ. */
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  /** Est-ce que le champ est obligatoire ? */
  required: Scalars['Boolean'];
  /**
   * Type de la valeur du champ.
   * @deprecated Utilisez le champ `__typename` à la place.
   */
  type: TypeDeChamp;
};

export type PieceJustificativeChamp = Champ & {
  __typename?: 'PieceJustificativeChamp';
  /** @deprecated Utilisez le champ `files` à la place. */
  file?: Maybe<File>;
  files: Array<File>;
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  /** La valeur du champ sous forme texte. */
  stringValue?: Maybe<Scalars['String']>;
};

export type PieceJustificativeChampDescriptor = ChampDescriptor & {
  __typename?: 'PieceJustificativeChampDescriptor';
  /**
   * Description des champs d’un bloc répétable.
   * @deprecated Utilisez le champ `RepetitionChampDescriptor.champ_descriptors` à la place.
   */
  champDescriptors?: Maybe<Array<ChampDescriptor>>;
  /** Description du champ. */
  description?: Maybe<Scalars['String']>;
  /** Modèle de la pièce justificative. */
  fileTemplate?: Maybe<File>;
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  /** Est-ce que le champ est obligatoire ? */
  required: Scalars['Boolean'];
  /**
   * Type de la valeur du champ.
   * @deprecated Utilisez le champ `__typename` à la place.
   */
  type: TypeDeChamp;
};

export type PoleEmploiChampDescriptor = ChampDescriptor & {
  __typename?: 'PoleEmploiChampDescriptor';
  /**
   * Description des champs d’un bloc répétable.
   * @deprecated Utilisez le champ `RepetitionChampDescriptor.champ_descriptors` à la place.
   */
  champDescriptors?: Maybe<Array<ChampDescriptor>>;
  /** Description du champ. */
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  /** Est-ce que le champ est obligatoire ? */
  required: Scalars['Boolean'];
  /**
   * Type de la valeur du champ.
   * @deprecated Utilisez le champ `__typename` à la place.
   */
  type: TypeDeChamp;
};

export type Profile = {
  __typename?: 'Profile';
  email: Scalars['String'];
  id: Scalars['ID'];
};

export type ProfileInput =
  /** Email */
  { email: Scalars['String']; id?: never; }
  |  /** ID */
  { email?: never; id: Scalars['ID']; };

export type Query = {
  __typename?: 'Query';
  /** Informations concernant une démarche. */
  demarche: Demarche;
  demarcheDescriptor?: Maybe<DemarcheDescriptor>;
  /** Informations sur un dossier d’une démarche. */
  dossier: Dossier;
  /** Informations sur un groupe instructeur. */
  groupeInstructeur: GroupeInstructeurWithDossiers;
};


export type QueryDemarcheArgs = {
  number: Scalars['Int'];
};


export type QueryDemarcheDescriptorArgs = {
  demarche: FindDemarcheInput;
};


export type QueryDossierArgs = {
  number: Scalars['Int'];
};


export type QueryGroupeInstructeurArgs = {
  number: Scalars['Int'];
};

export type RnaChampDescriptor = ChampDescriptor & {
  __typename?: 'RNAChampDescriptor';
  /**
   * Description des champs d’un bloc répétable.
   * @deprecated Utilisez le champ `RepetitionChampDescriptor.champ_descriptors` à la place.
   */
  champDescriptors?: Maybe<Array<ChampDescriptor>>;
  /** Description du champ. */
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  /** Est-ce que le champ est obligatoire ? */
  required: Scalars['Boolean'];
  /**
   * Type de la valeur du champ.
   * @deprecated Utilisez le champ `__typename` à la place.
   */
  type: TypeDeChamp;
};

export type Region = {
  __typename?: 'Region';
  code: Scalars['String'];
  name: Scalars['String'];
};

export type RegionChamp = Champ & {
  __typename?: 'RegionChamp';
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  region?: Maybe<Region>;
  /** La valeur du champ sous forme texte. */
  stringValue?: Maybe<Scalars['String']>;
};

export type RegionChampDescriptor = ChampDescriptor & {
  __typename?: 'RegionChampDescriptor';
  /**
   * Description des champs d’un bloc répétable.
   * @deprecated Utilisez le champ `RepetitionChampDescriptor.champ_descriptors` à la place.
   */
  champDescriptors?: Maybe<Array<ChampDescriptor>>;
  /** Description du champ. */
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  /** List des regions. */
  options?: Maybe<Array<Region>>;
  /** Est-ce que le champ est obligatoire ? */
  required: Scalars['Boolean'];
  /**
   * Type de la valeur du champ.
   * @deprecated Utilisez le champ `__typename` à la place.
   */
  type: TypeDeChamp;
};

export type RepetitionChamp = Champ & {
  __typename?: 'RepetitionChamp';
  /** @deprecated Utilisez le champ `rows` à la place. */
  champs: Array<Champ>;
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  rows: Array<Row>;
  /** La valeur du champ sous forme texte. */
  stringValue?: Maybe<Scalars['String']>;
};

export type RepetitionChampDescriptor = ChampDescriptor & {
  __typename?: 'RepetitionChampDescriptor';
  /** Description des champs d’un bloc répétable. */
  champDescriptors?: Maybe<Array<ChampDescriptor>>;
  /** Description du champ. */
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  /** Est-ce que le champ est obligatoire ? */
  required: Scalars['Boolean'];
  /**
   * Type de la valeur du champ.
   * @deprecated Utilisez le champ `__typename` à la place.
   */
  type: TypeDeChamp;
};

export type Revision = {
  __typename?: 'Revision';
  annotationDescriptors: Array<ChampDescriptor>;
  champDescriptors: Array<ChampDescriptor>;
  /** Date de la création. */
  dateCreation: Scalars['ISO8601DateTime'];
  /** Date de la publication. */
  datePublication?: Maybe<Scalars['ISO8601DateTime']>;
  id: Scalars['ID'];
};

export type Row = {
  __typename?: 'Row';
  champs: Array<Champ>;
  id: Scalars['ID'];
};

export type SelectionUtilisateur = GeoArea & {
  __typename?: 'SelectionUtilisateur';
  description?: Maybe<Scalars['String']>;
  geometry: GeoJson;
  id: Scalars['ID'];
  source: GeoAreaSource;
};

export type Service = {
  __typename?: 'Service';
  id: Scalars['ID'];
  /** nom du service qui met en oeuvre la démarche */
  nom: Scalars['String'];
  /** nom de l'organisme qui met en oeuvre la démarche */
  organisme: Scalars['String'];
  /** n° siret du service qui met en oeuvre la démarche */
  siret?: Maybe<Scalars['String']>;
  /** type d'organisme qui met en oeuvre la démarche */
  typeOrganisme: TypeOrganisme;
};

export type SiretChamp = Champ & {
  __typename?: 'SiretChamp';
  etablissement?: Maybe<PersonneMorale>;
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  /** La valeur du champ sous forme texte. */
  stringValue?: Maybe<Scalars['String']>;
};

export type SiretChampDescriptor = ChampDescriptor & {
  __typename?: 'SiretChampDescriptor';
  /**
   * Description des champs d’un bloc répétable.
   * @deprecated Utilisez le champ `RepetitionChampDescriptor.champ_descriptors` à la place.
   */
  champDescriptors?: Maybe<Array<ChampDescriptor>>;
  /** Description du champ. */
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  /** Est-ce que le champ est obligatoire ? */
  required: Scalars['Boolean'];
  /**
   * Type de la valeur du champ.
   * @deprecated Utilisez le champ `__typename` à la place.
   */
  type: TypeDeChamp;
};

export type TextChamp = Champ & {
  __typename?: 'TextChamp';
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  /** La valeur du champ sous forme texte. */
  stringValue?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type TextChampDescriptor = ChampDescriptor & {
  __typename?: 'TextChampDescriptor';
  /**
   * Description des champs d’un bloc répétable.
   * @deprecated Utilisez le champ `RepetitionChampDescriptor.champ_descriptors` à la place.
   */
  champDescriptors?: Maybe<Array<ChampDescriptor>>;
  /** Description du champ. */
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  /** Est-ce que le champ est obligatoire ? */
  required: Scalars['Boolean'];
  /**
   * Type de la valeur du champ.
   * @deprecated Utilisez le champ `__typename` à la place.
   */
  type: TypeDeChamp;
};

export type TextareaChampDescriptor = ChampDescriptor & {
  __typename?: 'TextareaChampDescriptor';
  /**
   * Description des champs d’un bloc répétable.
   * @deprecated Utilisez le champ `RepetitionChampDescriptor.champ_descriptors` à la place.
   */
  champDescriptors?: Maybe<Array<ChampDescriptor>>;
  /** Description du champ. */
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  /** Est-ce que le champ est obligatoire ? */
  required: Scalars['Boolean'];
  /**
   * Type de la valeur du champ.
   * @deprecated Utilisez le champ `__typename` à la place.
   */
  type: TypeDeChamp;
};

export type TitreIdentiteChamp = Champ & {
  __typename?: 'TitreIdentiteChamp';
  filled: Scalars['Boolean'];
  grantType: TitreIdentiteGrantType;
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  /** La valeur du champ sous forme texte. */
  stringValue?: Maybe<Scalars['String']>;
};

export type TitreIdentiteChampDescriptor = ChampDescriptor & {
  __typename?: 'TitreIdentiteChampDescriptor';
  /**
   * Description des champs d’un bloc répétable.
   * @deprecated Utilisez le champ `RepetitionChampDescriptor.champ_descriptors` à la place.
   */
  champDescriptors?: Maybe<Array<ChampDescriptor>>;
  /** Description du champ. */
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  /** Est-ce que le champ est obligatoire ? */
  required: Scalars['Boolean'];
  /**
   * Type de la valeur du champ.
   * @deprecated Utilisez le champ `__typename` à la place.
   */
  type: TypeDeChamp;
};

export enum TitreIdentiteGrantType {
  /** Françe Connect */
  FranceConnect = 'france_connect',
  /** Pièce justificative */
  PieceJustificative = 'piece_justificative'
}

export type Traitement = {
  __typename?: 'Traitement';
  dateTraitement: Scalars['ISO8601DateTime'];
  emailAgentTraitant?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  motivation?: Maybe<Scalars['String']>;
  state: DossierState;
};

export enum TypeDeChamp {
  /** Adresse */
  Address = 'address',
  /** Annuaire de l’éducation */
  AnnuaireEducation = 'annuaire_education',
  /** Carte */
  Carte = 'carte',
  /** Case à cocher seule */
  Checkbox = 'checkbox',
  /** Civilité */
  Civilite = 'civilite',
  /** Données de la Caisse nationale des allocations familiales */
  Cnaf = 'cnaf',
  /** Communes */
  Communes = 'communes',
  /** Date */
  Date = 'date',
  /** Date et Heure */
  Datetime = 'datetime',
  /** Nombre décimal */
  DecimalNumber = 'decimal_number',
  /** Départements */
  Departements = 'departements',
  /** Données de la Direction générale des Finances publiques */
  Dgfip = 'dgfip',
  /** Lien vers un autre dossier */
  DossierLink = 'dossier_link',
  /** Choix simple */
  DropDownList = 'drop_down_list',
  /** Adresse électronique */
  Email = 'email',
  /** EPCI */
  Epci = 'epci',
  /** Explication */
  Explication = 'explication',
  /** Titre de section */
  HeaderSection = 'header_section',
  /** Numéro Iban */
  Iban = 'iban',
  /** Nombre entier */
  IntegerNumber = 'integer_number',
  /** Deux menus déroulants liés */
  LinkedDropDownList = 'linked_drop_down_list',
  /** Données du Ministère de l’Enseignement Supérieur, de la Recherche et de l’Innovation */
  Mesri = 'mesri',
  /** Choix multiple */
  MultipleDropDownList = 'multiple_drop_down_list',
  /** Nombre */
  Number = 'number',
  /** Pays */
  Pays = 'pays',
  /** Téléphone */
  Phone = 'phone',
  /** Pièce justificative */
  PieceJustificative = 'piece_justificative',
  /** Situation Pôle emploi */
  PoleEmploi = 'pole_emploi',
  /** Régions */
  Regions = 'regions',
  /** Bloc répétable */
  Repetition = 'repetition',
  /** RNA */
  Rna = 'rna',
  /** Numéro Siret */
  Siret = 'siret',
  /** Texte court */
  Text = 'text',
  /** Texte long */
  Textarea = 'textarea',
  /** Titre identité */
  TitreIdentite = 'titre_identite',
  /** Oui/Non */
  YesNo = 'yes_no'
}

export enum TypeOrganisme {
  /** Administration centrale */
  AdministrationCentrale = 'administration_centrale',
  /** Association */
  Association = 'association',
  /** Autre */
  Autre = 'autre',
  /** Collectivité territoriale */
  CollectiviteTerritoriale = 'collectivite_territoriale',
  /** Établissement d’enseignement */
  EtablissementEnseignement = 'etablissement_enseignement',
  /** Opérateur d’État */
  OperateurDEtat = 'operateur_d_etat',
  /** Service déconcentré de l’État */
  ServiceDeconcentreDeLEtat = 'service_deconcentre_de_l_etat'
}

/** Éreur de validation */
export type ValidationError = {
  __typename?: 'ValidationError';
  /** A description of the error */
  message: Scalars['String'];
};

/** Message d’alerte */
export type WarningMessage = {
  __typename?: 'WarningMessage';
  /** La description de l’alerte */
  message: Scalars['String'];
};

export type YesNoChampDescriptor = ChampDescriptor & {
  __typename?: 'YesNoChampDescriptor';
  /**
   * Description des champs d’un bloc répétable.
   * @deprecated Utilisez le champ `RepetitionChampDescriptor.champ_descriptors` à la place.
   */
  champDescriptors?: Maybe<Array<ChampDescriptor>>;
  /** Description du champ. */
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /** Libellé du champ. */
  label: Scalars['String'];
  /** Est-ce que le champ est obligatoire ? */
  required: Scalars['Boolean'];
  /**
   * Type de la valeur du champ.
   * @deprecated Utilisez le champ `__typename` à la place.
   */
  type: TypeDeChamp;
};
