const Model = require('./Model');
const { query } = require("../db");
const { createHash } = require('node:crypto');

/**
 * @property {int} id
 * @property {string} name
 * @property {string} email
 * @property {string} role
 */
class User extends Model {

    static get ADMIN() {
       return 'admin';
    };

    static get USER() {
       return 'user';
    };

    static get defaultRole() {
        return User.USER;
    }

    static get table() {
        return 'users';
    }

    static get primaryKey() {
        return 'id';
    }

    static get fields() {
        return 'id, name, email, role';
    }

    static async create(data) {
        if (data.password) {
            data = { ...data, password: this.hashPassword(data.password) };
        }

        if (!data.role) {
            data = { ...data, role: this.defaultRole };
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

    isAdmin() {
        return this.role === User.ADMIN;
    }
}

module.exports = User;
