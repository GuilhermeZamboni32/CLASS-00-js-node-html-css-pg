module.exports = {
    getAllData: `
      SELECT
        *
      FROM client;
    `,
  
    getDataByCPF: `
      SELECT
        *
      FROM client
      WHERE cpf = $1;
    `,
  
    insertData: `
      INSERT INTO client
        (cpf, nome, email, idade, profissao)
      VALUES
        ($1, $2, $3, $4, $5)
      RETURNING
        *;
    `,
  
    updateData: `
      UPDATE client
      SET
        nome       = $2,
        email      = $3,
        idade      = $4,
        profissao  = $5
      WHERE
        cpf = $1;
    `,
  
    deleteDataByCPF: `
      DELETE FROM client
      WHERE cpf = $1
      RETURNING
        *;
    `,
  
    searchByName: `
      SELECT
        *
      FROM client
      WHERE nome ILIKE $1;
    `,
};
  