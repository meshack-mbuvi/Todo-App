import 'reflect-metadata';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { createConnections } from 'typeorm';


export async function createApp() {
    const app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cors());

    await createConnections();

    app.get('/', (req, res) => res.send('Hello World!'));

    return app;
}
