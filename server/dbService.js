const { Pool } = require('pg');
const dotenv = require('dotenv');
let instance = null;
dotenv.config();

const pool = new Pool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT,
});

pool.connect(err => {
  if (err) {
    console.log("CONNECTION ERROR. ERROR MESSAGE: ", err.message);
  } else {
    console.log("Conectado na Database Do PostgreSQL");
  }
});

class DbService {
  static getDbServiceInstance() {
    return instance ? instance : new DbService();
  }

  async getAllData() {
    try {
      const sql = "SELECT * FROM client;";
      const result = await pool.query(sql);
      
      return result.rows;
    } catch (error) {
      console.log(error);
    }
  }

  // MÉTODO PARA INSERIR
  async insertNewName(dados) {
    try {
      const dateAdded = new Date();

      const sql = "INSERT INTO client (cpf, nome, email, idade, profissao) VALUES ($1, $2, $3, $4, $5) RETURNING cpf;";
      const values = [dados.cpf, dados.nome, dados.email, dados.idade, dados.profissao]
      
      const result = await pool.query(sql, values);
      console.log("result of insertNewName ====>>>>> ", result);
      
      const cpf = result.rows[0].cpf;
      const nome = result.rows[0].nome;
      const  email = result.rows[0].email;
      
      const idade = result.rows[0].idade;
      const profissao = result.rows[0].profissao;
      
      return {
        cpf: cpf,
        name: nome,
        email: email,
        idade: idade,
        profissao: profissao
      };
    } catch (error) {
      console.log(error);
    }
  }

  // MÉTODO PARA DELETAR
  async deleteRowById(id) {
    try {
      id = parseInt(id, 10);
      const sql = "DELETE FROM client WHERE cpf = $1;";
      const result = await pool.query(sql, [id]);
      return result.rowCount === 1;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  // MÉTODO PARA ATUALIZAR
  async updateNameById(dados) {
    console.log("dados dados dados dados ===>>>>>> ", dados);
    
    try {
      const sql = "UPDATE client SET  nome=$2, email=$3, idade=$4, profissao=$5 WHERE cpf = $1;";
      const values = [dados.cpf, dados.nome, dados.email, dados.idade, dados.profissao]

      const result = await pool.query(sql, values);

      return result.rowCount === 1;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  // MÉTODO PARA BUSCAR
  async searchByName(name) {
    try {
      const sql = "SELECT * FROM client WHERE nome = $1;";
      const result = await pool.query(sql, [name]);
      return result.rows;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = DbService;
