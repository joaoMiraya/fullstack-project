import { join } from 'path';
import AutoLoad, {AutoloadPluginOptions} from '@fastify/autoload';
import { FastifyPluginAsync, FastifyServerOptions } from 'fastify';
import mysql from 'mysql2/promise'; 
import cors from '@fastify/cors';
import pino from 'pino';
import dotenv from 'dotenv';
dotenv.config();

export interface AppOptions extends FastifyServerOptions, Partial<AutoloadPluginOptions> {
  logger: pino.Logger;
}

const logPath = join(__dirname, '../logfile.log');

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss Z',
      ignore: 'pid, hostname',
    }
  }
}, pino.destination({
  dest: logPath,
  sync: false,
}));

// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {
  logger, 
}

const app: FastifyPluginAsync<AppOptions> = async (
    fastify,
    opts
): Promise<void> => {
  // Place here your custom code!
    void fastify.register(cors, {
      origin: ['http://127.0.0.1:80', '172.18.0.1', 'http://127.0.0.1', 'http://localhost:80', 'http://localhost:5173', 'http://localhost'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization'],
      exposedHeaders: ['Content-Length', 'X-Foo'],
    });

    fastify.log.info('Fastify API Initialized');
    
    fastify.register(require('fastify-bcrypt'), {
      saltWorkFactor: 12,
    });
    
  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
    options: opts
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    options: opts
  })
};

declare module 'fastify' {
  interface FastifyInstance {
    database: mysql.Connection;
    bcrypt: {
      hash: (password: string) => Promise<string>;
      compare: (password: string, hashed: string) => Promise<boolean>;
    };
  }
}

export default app;
export { app, options }
