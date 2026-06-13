
export function getEnvFileName(): string {
  const env = process.env.NODE_ENV;
  console.log(env);
  if (env === 'development') {
    return '.env.development.local';
  } else if (env === 'test') {
    return '.env.test.local'; }
  else if (env === 'production') {
    return '.env';
  } else {
    throw new Error('No .env file specified');
  }
}
