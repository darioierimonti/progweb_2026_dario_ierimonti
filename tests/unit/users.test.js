const { it } = require('node:test');
const assert = require('node:assert');
const User = require('../../models/user');
const test = require("node:test");

const name = 'Test User';
const email = 'test@example.com';
const password = 'password';

it('can create a user', async () => {
    /**
     * @type {null|User}
     */
    const user = await User.create({
        name: name,
        email: email,
        password: password,
    });

    assert.equal(user.name, name);
    assert.equal(user.email, email);
});

it('can authenticate a user', async () => {
    /**
     * @type {null|User}
     */
    const user = await User.create({
        name: name,
        email: email,
        password: password,
    });

    assert.notEqual(null, await User.authenticate(user.email, password));
});

it('can not authenticate a user with wrong password', async () => {
    /**
     * @type {null|User}
     */
    const user = await User.create({
        name: name,
        email: email,
        password: password,
    });

    assert.equal(null, await User.authenticate(user.email, 'wrongpassword'));
})

it('can not authenticate a user with wrong email', async () => {
    /**
     * @type {null|User}
     */
    const user = await User.create({
        name: name,
        email: email,
        password: password,
    });

    assert.equal(null, await User.authenticate('wrong@email@com', password))
})

it('can not authenticate a user with wrong email and password', async () => {
    /**
     * @type {null|User}
     */
    const user = await User.create({
        name: name,
        email: email,
        password: password,
    });

    assert.equal(null, await User.authenticate('wrong@email@com', 'wrongpassword'))
})


it('can not authenticate a user with no password', async () => {
    /**
     * @type {null|User}
     */
    const user = await User.create({
        name: name,
        email: email,
        password: password,
    });

    assert.equal(null, await User.authenticate(user.email, ''))
})

it('can not authenticate a user with no email', async () => {
    /**
     * @type {null|User}
     */
    const user = await User.create({
        name: name,
        email: email,
        password: password,
    })

    assert.equal(null, await User.authenticate('', password))
})

it('can not authenticate a user with no email and password', async () => {
    /**
     * @type {null|User}
     */
    const user = await User.create({
        name: name,
        email: email,
        password: password,
    })

    assert.equal(null, await User.authenticate('', ''))
})

it('assigns a default role to a user', async () => {
    /**
     * @type {null|User}
     */
    const user = await User.create({
        name: name,
        email: email,
        password: password,
    })

    assert.equal(user.role, User.defaultRole)
})

it('does not assign a default role to a user with a role', async () => {
    /**
     * @type {null|User}
     */
    const user = await User.create({
        name: name,
        email: email,
        password: password,
        role: User.ADMIN
    })

    assert.equal(user.role, User.ADMIN)
})

test('isAdmin returns true if user is admin', async () => {
    /**
     * @type {null|User}
     */
    const user = await User.create({
        name: name,
        email: email,
        password: password,
        role: User.ADMIN
    })

    assert.ok(user.isAdmin());
})

test('isAdmin returns false if user is not admin', async () => {
    /**
     * @type {null|User}
     */
    const user = await User.create({
        name: name,
        email: email,
        password: password,
    })

    assert.ok(!user.isAdmin());
})

test('tokenAuthenticate returns null if token is invalid', async () => {
    assert.equal(null, await User.tokenAuthenticate('invalidtoken'));
})

test('tokenAuthenticate returns null if token is missing', async () => {
    assert.equal(null, await User.tokenAuthenticate(null));
})

test('tokenAuthenticate returns null if token is empty', async () => {
    assert.equal(null, await User.tokenAuthenticate(''));
})

test('tokenAuthenticate returns user if token is valid', async () => {
    /**
     * @type {null|User}
     */
    const user = await User.create({
        name: name,
        email: email,
        password: password,
    })

    /**
     * @type {null|User}
     */
    const authenticatedUser = await User.tokenAuthenticate(user.token);
    assert.equal(user.id, authenticatedUser.id);
})
