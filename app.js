import server from './models/server.js';
import {config} from 'dotenv';

config({path: '.env'});

const app = new server();

app.listen;