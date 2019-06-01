const NODE_ENV = process.env.NODE_ENV;
let db = process.env.DB_TODO;

if (NODE_ENV === 'test') {
  db = process.env.DB_TEST;
}

module.exports = {
  name: 'default',
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: db,
  logging: false,
  synchronize: true,
  entities: ['src/entity/**/*.ts'],
  migrations: ['src/migration/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber',
  },
};
