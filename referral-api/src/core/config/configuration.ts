export default () => ({
    port: parseInt(process.env.PORT ?? '4000', 10),
    allowedOrigins: (process.env.ALLOWED_ORIGINS ?? 'http://localhost:3000').split(','),
  });