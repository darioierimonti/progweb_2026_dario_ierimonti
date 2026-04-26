const Model = require('./Model');
const { query } = require("../db");
const { createHash } = require('node:crypto');

class User extends Model {
    static get table() {
        return 'users';
    }

    static get primaryKey() {
        return 'id';
    }

    static get fields() {
        return 'id, name, email';
    }

    static async create(data) {
        if (data.password) {
            data = { ...data, password: this.hashPassword(data.password) };
        }
        return super.create(data);
    }

    static hashPassword(password) {
        // Adds salt to the password to prevent rainbow table attacks
        password = password + (process.env.PASSWORD_SALT || '')

        return createHash('sha256')
            .update(password)
            .digest('hex');
    }
    static async authenticate(email, password) {
        password = this.hashPassword(password);
        const rows = await query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
        return rows[0] || null;
    }
}

module.exports = User;
