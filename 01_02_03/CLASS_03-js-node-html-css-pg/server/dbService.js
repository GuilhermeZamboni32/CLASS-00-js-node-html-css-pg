require('dotenv').config();
const fs   = require('fs');
const path = require('path');
const { Pool } = require('pg');

let serviceInstance = null;

// load each .sql file into a string
const queries = {
  getAllData:        fs.readFileSync(path.join(__dirname, 'queries', 'getAllData.sql'),        'utf8'),
  getDataByCPF:      fs.readFileSync(path.join(__dirname, 'queries', 'getDataByCPF.sql'),      'utf8'),
  insertData:        fs.readFileSync(path.join(__dirname, 'queries', 'insertData.sql'),        'utf8'),
  updateData:        fs.readFileSync(path.join(__dirname, 'queries', 'updateData.sql'),        'utf8'),
  deleteDataByCPF:   fs.readFileSync(path.join(__dirname, 'queries', 'deleteDataByCPF.sql'),   'utf8'),
  searchByName:      fs.readFileSync(path.join(__dirname, 'queries', 'searchByName.sql'),      'utf8'),
};

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

  // fechando tod@s pools de conexão
  async closeConnection() {
    await this.pool.end();
    console.log('PostgreSQL pool has been closed');
  }

  // MÓTODOS do CRUD
  async getAllData() {
    const result = await this.pool.query(queries.getAllData);
    return result.rows;
  }

  async getDataByCPF(cpf) {
    const result = await this.pool.query(queries.getDataByCPF, [cpf]);
    return result.rows[0];
  }

  async insertData({ cpf, nome, email, idade, profissao }) {
    const result = await this.pool.query(
      queries.insertData,
      [cpf, nome, email, idade, profissao]
    );
    return result.rows[0];
  }

  async updateData({ cpf, nome, email, idade, profissao }) {
    const result = await this.pool.query(
      queries.updateData,
      [cpf, nome, email, idade, profissao]
    );
    return result.rowCount === 1;
  }

  async deleteDataByCPF(cpf) {
    const result = await this.pool.query(queries.deleteDataByCPF, [cpf]);
    return result.rows[0];
  }

  async searchByName(nome) {
    const pattern = `%${nome}%`;
    const result  = await this.pool.query(queries.searchByName, [pattern]);
    return result.rows;
  }
}

module.exports = DbService;
