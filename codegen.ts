import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema:
    'https://raw.githubusercontent.com/demarches-simplifiees/demarches-simplifiees.fr/main/app/graphql/schema.graphql',
  generates: {
    'src/generated/graphql.ts': {
      plugins: ['typescript'],
    },
  },
};

export default config;
