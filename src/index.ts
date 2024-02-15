import 'dotenv/config';
import { httpServer } from './http_server/static-server';
import { initWsServer } from './backend/ws-server';

const HTTP_PORT = process.env.HTTP_PORT;
const WS_PORT = Number(process.env.WS_PORT);

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);
initWsServer(WS_PORT);