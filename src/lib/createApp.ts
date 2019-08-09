import 'reflect-metadata';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { createConnection } from 'typeorm';
require('dotenv').config();
import * as YAML from 'yamljs';

import { authentication } from '../middleware/auth';

import routes from '../routes';

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = YAML.load('docs/swagger.yaml');

export async function createApp() {
 const app = express();

 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({ extended: true }));
 app.use(cors());

 app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

 app.use('/api/*', authentication);

 app.use('/api', routes);
 app.use('*', (req: any, res: any) => {
  res.status(404);
  // respond with json
  return res.send({
   status: 404,
   message: 'Page Not Found',
   docs: '/api-docs/'
  });
 });

 const NODE_ENV = process.env.NODE_ENV;
 const { username, password, host } = process.env;
 let database = process.env.TODO;
 let entities = ['dist/entity/**/*.js'];

 if (NODE_ENV === 'test') {
  database = process.env.DB_TEST;
  entities = ['src/entity/**/*.ts'];
 }
 if (NODE_ENV === 'dev') {
  entities = ['src/entity/**/*.ts'];
 }

 try {
  let conn = await createConnection({
   username,
   password,
   database,
   host,
   type: 'postgres',
   port: 5432,
   synchronize: true,
   logging: false,
   entities
  });

  // Its important to drop database first when running tests
  if (NODE_ENV === 'test') {
   await conn.dropDatabase();
   await conn.synchronize();
  }
 } catch (error) {}

 return app;
}
