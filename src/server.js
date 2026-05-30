const app = require('./app');
const { AppDataSource } = require('./database/data-source');
const { seedRoles } = require('./database/seedRoles');
const { seedPermissions } = require('./database/seedPermissions');
const { env } = require('./config/env');

async function bootstrap() {
  try {
    await AppDataSource.initialize();
    const insertedRoles = await seedRoles();
    const insertedPermissions = await seedPermissions();
    console.log('Database connected successfully');
    console.log('Tables synchronized from entities');
    if (insertedRoles > 0) {
      console.log(`Seeded ${insertedRoles} default role(s)`);
    }
    if (insertedPermissions > 0) {
      console.log(`Seeded ${insertedPermissions} default permission(s)`);
    }

    const server = app.listen(env.PORT, () => {
      console.log(`Server is running on port ${env.PORT}`);
    });

    server.on('error', (error) => {
      if (error && error.code === 'EADDRINUSE') {
        console.error(
          `Port ${env.PORT} is already in use. Stop the process using it or change PORT in .env.`
        );
      } else {
        console.error('Failed to start server:', error);
      }

      process.exit(1);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
