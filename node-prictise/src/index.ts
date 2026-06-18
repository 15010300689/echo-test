import Fastify from 'fastify';
import { randomUUID } from 'node:crypto';
import { ok, fail } from './utils/response.js';
import { registerTaskRoutes } from './routes/task.js';

const app = Fastify({ logger: true });

app.addHook('onRequest', async (request) => {
  const reqId = request.headers['x-request-id'];
  const traceId = typeof reqId === 'string' && reqId ? reqId : randomUUID();
  request.headers['x-request-id'] = traceId;
  (request as any).traceId = traceId;
  (request as any).startAt = Date.now();
});

app.addHook('onResponse', async (request, reply) => {
  const traceId = (request as any).traceId;
  const startAt = (request as any).startAt ?? Date.now();
  const cost = Date.now() - startAt;

  app.log.info({
    traceId,
    method: request.method,
    url: request.url,
    statusCode: reply.statusCode,
    costMs: cost,
  });
});

app.setErrorHandler((error, request, reply) => {
  const traceId = (request as any).traceId;
  app.log.error({ traceId, err: error }, 'request failed');
  reply.code(500).send(fail(50000, '服务异常', { traceId }));
});

app.get('/health', async (request) => {
  const traceId = (request as any).traceId;
  return ok({ ok: true, time: Date.now(), traceId });
});

app.get('/users/:id', async (request, reply) => {
  const traceId = (request as any).traceId;
  const params = request.params as { id: string };
  const id = Number(params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return reply.code(400).send(fail(40001, 'id 必须是正整数', { traceId }));
  }

  return ok({
    id,
    name: `user_${id}`,
    role: 'guest',
  });
});

await registerTaskRoutes(app);

const start = async () => {
  try {
    await app.listen({ port: 3000, host: '0.0.0.0' });
    console.log('server running at http://localhost:3000');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();