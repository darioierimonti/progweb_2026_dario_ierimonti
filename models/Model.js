const { query } = require('../db');

class Model {

    static get table() {
        throw new Error('tableName must be implemented');
    }

    static get primaryKey() {
        throw new Error('primaryKey must be implemented');
    }

    static get fields() {
        throw new Error('fields must be implemented');
    }

    static findAll() {
        return query(`SELECT * FROM ${this.table}`);

    }

    static async findById(id) {
        const rows = await query(
            `SELECT ${this.fields} FROM ${this.table} WHERE ${this.primaryKey} = ?`,
            [id]
        );

        if(rows.length === 0) {
            return null;
        }

        return new this(rows[0]);
    }

    static async create(data) {
        const keys = Object.keys(data);
        const cols = keys.join(', ');
        const placeholders = keys.map(() => '?').join(', ');
        const values = keys.map(k => data[k]);
        const result = await query(
            `INSERT INTO ${this.table} (${cols}) VALUES (${placeholders})`,
            values
        );
        return this.findById(result.insertId);
    }

    static async update(id, data) {
        const keys = Object.keys(data);
        const assignments = keys.map(k => `${k} = ?`).join(', ');
        const values = keys.map(k => data[k]);
        await query(
            `UPDATE ${this.table} SET ${assignments} WHERE id = ${this.primaryKey}`,
            [...values, id]
        );
        return this.findById(id);
    }

    static async delete(id) {
        const result = await query(
            `DELETE FROM ${this.table} WHERE id = ?`,
            [id]
        );
        return result.affectedRows > 0;
    }

    constructor(data) {
        this.populate(data);
    }

    populate(data) {
        Object.assign(this, data);
    }
}

module.exports = Model;
