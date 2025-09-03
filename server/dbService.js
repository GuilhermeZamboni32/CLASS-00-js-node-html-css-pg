require('dotenv').config();
const { Pool } = require('pg');
const clientQueries = require('./queries/clientQueries');

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

  async closeConnection() {
    await this.pool.end();
    console.log('PostgreSQL pool has been closed');
  }

  async getAllData() {
    const result = await this.pool.query(clientQueries.getAllData);
    return result.rows;
  }

  async getDataByCPF(cpf) {
    const result = await this.pool.query(
      clientQueries.getDataByCPF,
      [cpf]
    );
    return result.rows[0];
  }

  async insertData({ cpf, nome, email, idade, profissao }) {
    const values = [cpf, nome, email, idade, profissao];
    const result = await this.pool.query(
      clientQueries.insertData,
      values
    );
    return result.rows[0];
  }

  async updateData({ cpf, nome, email, idade, profissao }) {
    const values = [cpf, nome, email, idade, profissao];
    const result = await this.pool.query(
      clientQueries.updateData,
      values
    );
    return result.rowCount === 1;
  }

  async deleteDataByCPF(cpf) {
    const result = await this.pool.query(
      clientQueries.deleteDataByCPF,
      [cpf]
    );
    return result.rows[0];
  }

  async searchByName(nome) {
    const pattern = `%${nome}%`;
    const result = await this.pool.query(
      clientQueries.searchByName,
      [pattern]
    );
    return result.rows;
  }
}

module.exports = DbService;
