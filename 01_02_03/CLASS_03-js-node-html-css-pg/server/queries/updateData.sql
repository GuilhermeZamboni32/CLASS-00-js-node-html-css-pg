UPDATE client
SET nome       = $2,
    email      = $3,
    idade      = $4,
    profissao  = $5
WHERE cpf = $1;
