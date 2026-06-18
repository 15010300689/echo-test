import Fastify from 'fastify';
import { ok, fail } from './utils/response.js';
const app = Fastify({ logger: true });
app.setErrorHandler((error, _request, reply) => {
    app.log.error(error);
    reply.code(500).send(fail(50000, '服务异常'));
});
app.get('/health', async () => {
    return ok({ ok: true, time: Date.now() });
});
app.get('/users/:id', async (request, reply) => {
    const params = request.params;
    const id = Number(params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return reply.code(400).send({
            code: 400,
            message: 'id 必须是正整数',
        });
    }
    // 先用 mock 数据，后面第2周再替换成数据库查询
    return ok({
        id,
        name: `user_${id}`,
        role: 'guest',
    });
});
const start = async () => {
    try {
        await app.listen({ port: 3000, host: '0.0.0.0' });
        console.log('server running at http://localhost:3000');
    }
    catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};
start();
//# sourceMappingURL=index.js.map