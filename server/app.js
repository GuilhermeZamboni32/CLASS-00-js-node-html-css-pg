const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const dbService = require('./dbService');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/insert', (request, response) => {
  console.log("app.post('/insert' =====>>>>> ", request.body)
  const db = dbService.getDbServiceInstance();

  const result = db.insertNewName(request.body);
  result
    .then(data => response.json({ data: data }))
    .catch(err => console.error(err));
});

app.get('/getAll', (request, response) => {
  const db = dbService.getDbServiceInstance();

  const result = db.getAllData();
// console.dir("Route getAll ====>>>>> ", result);
  
  result
    .then(data => response.json({ data: data }))
    .catch(err => console.error(err));
});


app.patch('/update', (request, response) => {

  const db = dbService.getDbServiceInstance();

  const result = db.updateNameById(request.body);
  result
    .then(data => response.json({ success: data }))
    .catch(err => console.error(err));
});

app.delete('/delete/:id', (request, response) => {
  const { id } = request.params;
  const db = dbService.getDbServiceInstance();

  const result = db.deleteRowById(id);
  result
    .then(data => response.json({ success: data }))
    .catch(err => console.error(err));
});


app.get('/search/:name', (request, response) => {
  const { name } = request.params;
  const db = dbService.getDbServiceInstance();

  const result = db.searchByName(name);
  result
    .then(data => response.json({ data: data }))
    .catch(err => console.error(err));
});

app.listen(process.env.PORT, () => {
  console.log(`Servidor Rodando Na Porta ${process.env.PORT}`);
});
