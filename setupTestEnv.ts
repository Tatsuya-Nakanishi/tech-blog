import { loadEnvConfig } from '@next/env';

const setupTestEnv = async (): Promise<void> => {
  const projectDir = process.cwd();
  loadEnvConfig(projectDir);
};

export default setupTestEnv;
