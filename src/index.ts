import 'dotenv/config';
import { httpServer } from './http_server/static-server';

const HTTP_PORT = process.env.HTTP_PORT;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);
