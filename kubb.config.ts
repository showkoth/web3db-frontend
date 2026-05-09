import { defineConfig } from '@kubb/core';
import { pluginOas } from '@kubb/plugin-oas';
import { pluginTs } from '@kubb/plugin-ts';
import { pluginClient } from '@kubb/plugin-client';
import { pluginReactQuery } from '@kubb/plugin-react-query';
import { pluginZod } from '@kubb/plugin-zod';

export default defineConfig({
  root: '.',
  input: { path: 'http://localhost:8000/openapi.json' },
  output: { path: './src/lib/api/generated', clean: true },
  plugins: [
    pluginOas({ validate: false }),
    pluginTs({ output: { path: 'types' } }),
    pluginZod({ output: { path: 'zod' }, typed: true }),
    pluginClient({
      output: { path: 'client' },
      importPath: '@/lib/api/http',
    }),
    pluginReactQuery({
      output: { path: 'hooks' },
      client: { importPath: '@/lib/api/http' },
      query: { methods: ['get'] },
      mutation: { methods: ['post', 'put', 'delete', 'patch'] },
    }),
  ],
});
