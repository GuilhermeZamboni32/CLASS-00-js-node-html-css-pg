require('dotenv').config();
const { Pool } = require('pg');

let serviceInstance = null;

class DbService {
  constructor() {
    this.pool = new Pool({
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
        port: process.env.DB_PORT,
    });
  }


  // singleton
  static getDbServiceInstance() {
    if (!serviceInstance) {
      serviceInstance = new DbService();
    }
    return serviceInstance;
  }

  // fechando pool
  async closeConnection() {
    await this.pool.end();
    console.log('PostgreSQL pool has been closed');
  }

  async getAllData() {
    const sql    = 'SELECT * FROM client;';
    const result = await this.pool.query(sql);
    return result.rows;
  }

  async getDataByCPF(cpf) {
    const sql    = 'SELECT * FROM client WHERE cpf = $1;';
    const result = await this.pool.query(sql, [cpf]);
    return result.rows[0];
  }

  async insertData({ cpf, nome, email, idade, profissao }) {
    const sql = `
      INSERT INTO client (cpf, nome, email, idade, profissao)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [cpf, nome, email, idade, profissao];
    const result = await this.pool.query(sql, values);
    return result.rows[0];
  }

  async updateData({ cpf, nome, email, idade, profissao }) {
    const sql = `
      UPDATE client
        SET nome = $2,
            email = $3,
            idade = $4,
            profissao = $5
      WHERE cpf = $1;
    `;
    const values = [cpf, nome, email, idade, profissao];
    const result = await this.pool.query(sql, values);
    return result.rowCount === 1;
  }

  async deleteDataByCPF(cpf) {
    const sql    = 'DELETE FROM client WHERE cpf = $1 RETURNING *;';
    const result = await this.pool.query(sql, [cpf]);
    return result.rows[0];
  }

  async searchByName(nome) {
    const sql    = 'SELECT * FROM client WHERE nome ILIKE $1;';
    const values = [`%${nome}%`];
    const result = await this.pool.query(sql, values);
    return result.rows;
  }
}

module.exports = DbService;
