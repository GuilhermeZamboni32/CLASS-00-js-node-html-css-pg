const express = require('express');
const cors    = require('cors');
const dotenv  = require('dotenv');
dotenv.config();

const DbService = require('./dbService');
const db        = DbService.getDbServiceInstance();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/insert', async (req, res) => {
  try {
    const newClient = await db.insertData(req.body);
    res.json({ data: newClient });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Insert failed' });
  }
});

app.get('/getAll', async (_req, res) => {
  try {
    const clients = await db.getAllData();
    res.json({ data: clients });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fetch failed' });
  }
});

app.patch('/update', async (req, res) => {
  try {
    const success = await db.updateData(req.body);
    res.json({ success });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  }
});

app.delete('/delete/:cpf', async (req, res) => {
  try {
    const deleted = await db.deleteDataByCPF(req.params.cpf);
    res.json({ data: deleted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Delete failed' });
  }
});

app.get('/search/:nome', async (req, res) => {
  try {
    const results = await db.searchByName(req.params.nome);
    res.json({ data: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Search failed' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
