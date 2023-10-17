import fastify from 'fastify';
import fastifyEnv from '@fastify/env';
import cors from '@fastify/cors';
import formbody from '@fastify/formbody';
import router from './router';

const schema = {
    type: 'object',
    required: ['FASTIFY_PORT', 'BOX_BERRY_TOKEN', 'AIR_TABLE_API_KEY', 'AIR_TABLE_BASE', 'AIR_TABLE_ORDER_TABLE'],
    properties: {
        FASTIFY_PORT: {
            type: 'number',
            default: 3003,
        },
        BOX_BERRY_TOKEN: {
            type: 'string'
        },
        AIR_TABLE_API_KEY: {
            type: 'string'
        },
        AIR_TABLE_BASE: {
            type: 'string'
        },
        AIR_TABLE_ORDER_TABLE: {
            type: 'string'
        },
    }
}

const options = {
    confKey: 'config',
    schema,
    dotenv: true,
    data: process.env
}

const server = fastify();

server.register(formbody, { parser: str => JSON.parse(str) });
server.register(fastifyEnv, options);
server.register(router);
server.register(cors, {
    origin: [
        'https://bonyasbox.ru',
        'https://bonyasbox.ru/'
    ],
});

export default server;