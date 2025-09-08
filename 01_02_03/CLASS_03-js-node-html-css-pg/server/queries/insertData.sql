INSERT INTO client (cpf, nome, email, idade, profissao)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;
