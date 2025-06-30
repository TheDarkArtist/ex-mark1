function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is required but was not provided.`);
  }
  return value;
}

export default {
  email: {
    host: getEnvVar('EMAIL_HOST'),
    port: Number(getEnvVar('EMAIL_PORT')),
    secure: getEnvVar('EMAIL_SECURE') === 'true',
    user: getEnvVar('EMAIL_USER'),
    pass: getEnvVar('EMAIL_PASS'),
  },
  app: {
    baseUrl: getEnvVar('APP_BASE_URL'),
  },
};

