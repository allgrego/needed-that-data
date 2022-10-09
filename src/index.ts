import express, { Express, Request, Response } from 'express';
import './setup/env'
import routes from './routes'

const app: Express = express();
const port = process.env.PORT;

// All Routes
app.use("/", routes);

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});