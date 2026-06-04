const app = require('./app');
const { AppDataSource } = require('./database/data-source');
const { env } = require('./config/env');

async function bootstrap() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connected successfully');
    console.log('📊 Tables synchronized from entities');
    
    app.listen(env.PORT, () => {
      console.log(`Server is running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

bootstrap();
