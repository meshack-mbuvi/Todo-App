import 'reflect-metadata';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { createConnection } from 'typeorm';
import * as YAML from 'yamljs';

import { authentication } from '../middleware/auth';

import routes from '../routes';

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = YAML.load('docs/swagger.yaml');;

export async function createApp() {
    const app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cors());

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    app.use('/api/*', authentication)

    app.use('/api', routes)
    app.use('*', (req, res) => {
        res.status(404);
        // respond with json
        return res.send({
            status: 404,
            message: 'Page Not Found',
            docs: '/api-docs/'
        });
    });

    const NODE_ENV = process.env.NODE_ENV;
    let conn = await createConnection();

    if (NODE_ENV === 'test') {
        await conn.dropDatabase();
        await conn.close();
        conn = await createConnection();
    }

    return app;
}
