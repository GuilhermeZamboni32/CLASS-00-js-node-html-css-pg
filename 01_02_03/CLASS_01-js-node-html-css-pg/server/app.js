const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const DbService = require('./dbService');
const db = DbService.getDbServiceInstance();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/insert', async (req, res) => {
  try {
    const insertedRow = await db.insertData(req.body);
    res.json({ data: insertedRow });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to insert data' });
  }
});

app.get('/getAll', async (_req, res) => {
  try {
    const rows = await db.getAllData();
    res.json({ data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.patch('/update', async (req, res) => {
  try {
    const success = await db.updateData(req.body);
    res.json({ success });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update data' });
  }
});

app.delete('/delete/:cpf', async (req, res) => {
  const { cpf } = req.params;
  try {
    const deletedRow = await db.deleteDataByCPF(cpf);
    res.json({ data: deletedRow });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete data' });
  }
});

app.get('/search/:nome', async (req, res) => {
  const { nome } = req.params;
  try {
    const rows = await db.searchByName(nome);
    res.json({ data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Search failed' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor Rodando Na Porta ${PORT}`);
});
