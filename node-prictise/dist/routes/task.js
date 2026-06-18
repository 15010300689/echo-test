import { ok, fail } from '../utils/response.js';
let idSeed = 1;
const tasks = [];
export async function registerTaskRoutes(app) {
    app.get('/tasks', async () => {
        return ok({ list: tasks, total: tasks.length });
    });
    app.post('/tasks', async (request, reply) => {
        const body = request.body;
        const title = body?.title?.trim();
        if (!title) {
            return reply.code(400).send(fail(40002, 'title 不能为空'));
        }
        const task = {
            id: idSeed++,
            title,
            done: false,
            createdAt: Date.now(),
        };
        tasks.push(task);
        return ok(task, 'created');
    });
    app.patch('/tasks/:id', async (request, reply) => {
        const params = request.params;
        const body = request.body;
        const id = Number(params.id);
        if (!Number.isInteger(id) || id <= 0) {
            return reply.code(400).send(fail(40001, 'id 必须是正整数'));
        }
        if (typeof body?.done !== 'boolean') {
            return reply.code(400).send(fail(40003, 'done 必须是 boolean'));
        }
        const task = tasks.find((item) => item.id === id);
        if (!task) {
            return reply.code(404).send(fail(40401, '任务不存在'));
        }
        task.done = body.done;
        return ok(task, 'updated');
    });
    app.delete('/tasks/:id', async (request, reply) => {
        const params = request.params;
        const id = Number(params.id);
        if (!Number.isInteger(id) || id <= 0) {
            return reply.code(400).send(fail(40001, 'id 必须是正整数'));
        }
        const index = tasks.findIndex((item) => item.id === id);
        if (index < 0) {
            return reply.code(404).send(fail(40401, '任务不存在'));
        }
        const [deleted] = tasks.splice(index, 1);
        return ok(deleted, 'deleted');
    });
}
//# sourceMappingURL=task.js.map