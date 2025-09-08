import muysql from 'mysql';

class Database {
    constructor() {
        this.pool = muysql.createPool({
            host: 'localhost',
            user: 'root',
            password: 'password',
            database: 'mydb',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }

    async execute(query, params = []) {
        const [rows] = await this.pool.execute(query, params);
        return rows;
    }

    async close() {
        await this.pool.end();
    }
}

export default Database;
