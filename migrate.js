const fs = require('node:fs');
const path = require('node:path');
const mysql = require('mysql2/promise');
const readline = require('node:readline/promises');

async function migrate({ interactive = true } = {}) {
    const dbHost = process.env.DB_HOST;
    const dbUser = process.env.DB_USER;
    const dbPassword = process.env.DB_PASSWORD;

    const dbName = process.env.DB_NAME;

    // <editor-fold desc="Test Database Connection">

    /**
     * Ensure connection to the database and check if the database exists
     */
    const testConnection = await mysql.createConnection({
        host: dbHost,
        user: dbUser,
        password: dbPassword,
    });

    try {
        const [rows] = await testConnection.execute(
            'SELECT SCHEMA_NAME FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = ?',
            [dbName]
        );

        if (rows.length === 0) {
            let shouldCreate = !interactive;

            if (interactive) {
                const rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout,
                });

                const answer = await rl.question("Database does not exist. Do you want to create it? (y/n): ");
                rl.close();
                shouldCreate = answer.toLowerCase() === 'y';
            }

            if (!shouldCreate) {
                console.log("Exiting...");
                return;
            }

            console.log("Creating database...");
            await testConnection.query(`CREATE DATABASE IF NOT EXISTS ${mysql.escapeId(dbName)}`);
            console.log("Created");
        }
    } finally {
        await testConnection.end();
    }
    // </editor-fold>

    // <editor-fold desc="Migrations">

    /**
     * Run migrations
     */
    const connection = await mysql.createConnection({
        host: dbHost,
        user: dbUser,
        password: dbPassword,
        database: dbName,
    });

    try {
        await connection.execute(
            'CREATE TABLE IF NOT EXISTS migrations (id INT AUTO_INCREMENT PRIMARY KEY, migration_name VARCHAR(255), ran_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)'
        );

        const [rows] = await connection.execute('SELECT migration_name FROM migrations');
        const ranMigrations = rows.map(r => r.migration_name);

        const migrationsDir = path.join(__dirname, 'migrations');

        //TODO: Check if migrations directory exists
        const files = fs.readdirSync(migrationsDir);

        const sqlFiles = files.filter(file => file.endsWith('.sql')).sort();

        for (const sqlFile of sqlFiles) {
            const migrationName = path.basename(sqlFile, '.sql');

            if (ranMigrations.includes(migrationName)) {
                continue;
            }

            console.log(`Running migration: \x1b[32m ${migrationName} \x1b[0m`);

            const migrationSql = fs.readFileSync(path.join(migrationsDir, sqlFile), 'utf8');

            const statements = migrationSql
                .split(';')
                .map(s => s.trim())
                .filter(Boolean);

            for (const statement of statements) {
                await connection.execute(statement);
            }
            await connection.execute('INSERT INTO migrations (migration_name) VALUES (?)', [migrationName]);
        }
    } finally {
        await connection.end();
    }

    // </editor-fold>
}

module.exports = { migrate };

if (require.main === module) {
    migrate().catch(err => {
        console.error(err);
        process.exit(1);
    });
}