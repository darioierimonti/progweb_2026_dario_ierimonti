const { it, test } = require('node:test');
const assert = require('node:assert');
const page = require('../site');
const User = require('../../models/User');

it('can register a user', async () => {

    assert.equal( (await User.findAll()).length, 0);

    const name = 'Test User';
    const email = 'test@example.com';
    const password = 'test1234';

    const res = await page.post('/api/register', {
        name: name,
        email: email,
        password: password,
    });

    const users = await User.findAll();
    assert.equal(users.length, 1);

    assert.equal(users[0].name, name);
    assert.equal(users[0].email, email)

    assert.strictEqual(res.status, 200);
});

it('returns 400 if name is missing', async () => {
    const res = await page.post('/api/register', {
        email: 'test@email.com',
        password: 'test1234',
    })

    assert.strictEqual(res.status, 400);
})

it('returns 400 if email is missing', async () => {
    const res = await page.post('/api/register', {
        name: 'Test user',
        password: 'test1234',
    })

    assert.strictEqual(res.status, 400);
})

it('returns 400 if password is missing', async () => {
    const res = await page.post('/api/register', {
        name: 'Test user',
        email: 'test@email.com',
    })

    assert.strictEqual(res.status, 400);
})

it('cannot register a user with an existing email', async () => {
    const name = 'Test User';
    const email = 'test@example.com';
    const password = 'test1234';

    const res1 = await page.post('/api/register', {
        name: name,
        email: email,
        password: password,
    });

    const res2 = await page.post('/api/register', {
        name: name,
        email: email,
        password: password,
    });

    assert.strictEqual(res2.status, 400);
})
