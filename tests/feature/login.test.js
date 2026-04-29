const { it } = require('node:test');
const assert = require('node:assert');
const page = require('../site');
const User = require('../../models/User');

function getToken(res) {
    const tokenCookie = res.headers.getSetCookie().find(cookie => cookie.startsWith('token='));
    return tokenCookie.split(';')[0].split('=')[1];
}

it('can login a user', async () => {
    const email = "test@example.com";
    const password = "test1234";

    const user = User.create({
        name: "Test User",
        email: email,
        password: password,
    })

    const res = await page.post('/api/login', {
        email: email,
        password: password,
    })

    assert.strictEqual(res.status, 200);

    const token = getToken(res);
    const authenticatedUser = User.tokenAuthenticate(token);
    assert.equal(authenticatedUser.id, user.id);
})

it('doesnt login non existing user', async () => {
    const res = await page.post('/api/login', {
        email: "test@example.com",
        password: "test1234",
    })

    assert.strictEqual(res.status, 401);
})
