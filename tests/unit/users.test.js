const { it } = require('node:test');
const assert = require('node:assert');
const User = require('../../models/user');

const name = 'Test User';
const email = 'test@example.com';
const password = 'password';

it('can create a user', async () => {
    const user = await User.create({
        name: name,
        email: email,
        password: password,
    });

    assert.equal(user.name, name);
    assert.equal(user.email, email);
});

it('can authenticate a user', async () => {
    const user = await User.create({
        name: name,
        email: email,
        password: password,
    });

    assert.notEqual(null, await User.authenticate(user.email, password));
});
