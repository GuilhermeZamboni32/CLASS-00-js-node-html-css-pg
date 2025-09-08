document.addEventListener('DOMContentLoaded', function () {

  fetch('http://localhost:3000/getAll')
    .then((response) => response.json())
    .then((data) => loadHTMLTable(data['data']));

  document.querySelector('table tbody').addEventListener('click', function (event) {
    if (event.target.className === 'delete-row-btn') {
      deleteRowById(event.target.dataset.id);
    }
    if (event.target.className === 'edit-row-btn') {
      handleEditRow(event.target.dataset.id);
    }
  });

  document.getElementById('search-btn').onclick = function () {
    const searchValue = document.getElementById('search-input').value;
    fetch('http://localhost:3000/search/' + searchValue)
      .then((response) => response.json())
      .then((data) => loadHTMLTable(data['data']));
  };

  document.getElementById('add-btn').onclick = function () {
    const cpf = document.getElementById('cpf-input').value;
    const nome = document.getElementById('name-input').value;
    const email = document.getElementById('email-input').value;
    const idade = document.getElementById('age-input').value;
    const profissao = document.getElementById('profession-input').value;

    document.getElementById('cpf-input').value = "";
    document.getElementById('name-input').value = "";
    document.getElementById('email-input').value = "";
    document.getElementById('age-input').value = "";
    document.getElementById('profession-input').value = "";

    fetch('http://localhost:3000/insert', {
      headers: { 'Content-type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({
        cpf: cpf,
        nome: nome,
        email: email,
        idade: idade,
        profissao: profissao,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        insertRowIntoTable(data['data']);
        location.reload();
      });
  };

  document.getElementById('update-btn').onclick = function () {
    const updateCpf = document.getElementById('update-cpf-input').value;
    const updateName = document.getElementById('update-name-input').value;
    const updateEmail = document.getElementById('update-email-input').value;
    const updateAge = document.getElementById('update-age-input').value;
    const updateProfession = document.getElementById('update-profession-input').value;
    const id = document.getElementById('update-btn').dataset.id;

    fetch('http://localhost:3000/update', {
      method: 'PATCH',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        id: id,
        cpf: updateCpf,
        nome: updateName,
        email: updateEmail,
        idade: updateAge,
        profissao: updateProfession,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          location.reload();
        }
      });
    document.getElementById('modal').style.display = 'none';
  };

  document.getElementById('close-modal-btn').onclick = function () {
    document.getElementById('modal').style.display = 'none';
  };
});

function deleteRowById(id) {
  fetch('http://localhost:3000/delete/' + id, { method: 'DELETE' })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        location.reload();
      }
    });
}

function handleEditRow(id) {
  const row = document.querySelector(`tr[data-id="${id}"]`);
  if (!row) return;
  const cells = row.children;
  const cpf = cells[0].innerText;
  const nome = cells[1].innerText;
  const email = cells[2].innerText;
  const idade = cells[3].innerText;
  const profissao = cells[4].innerText;

  document.getElementById('update-cpf-input').value = cpf;
  document.getElementById('update-name-input').value = nome;
  document.getElementById('update-email-input').value = email;
  document.getElementById('update-age-input').value = idade;
  document.getElementById('update-profession-input').value = profissao;

  document.getElementById('update-btn').dataset.id = id;
  document.getElementById('modal').style.display = 'block';
}

function insertRowIntoTable(data) {
  const table = document.querySelector('table tbody');
  const isTableData = table.querySelector('.no-data');

  let tableHtml = "<tr data-id='" + data.cpf + "'>";
  tableHtml += `<td>${data.cpf}</td>`;
  tableHtml += `<td>${data.nome}</td>`;
  tableHtml += `<td>${data.email}</td>`;
  tableHtml += `<td>${data.idade}</td>`;
  tableHtml += `<td>${data.profissao}</td>`;
  tableHtml += `<td><button class="delete-row-btn" data-id='${data.cpf}'>Delete</button></td>`;
  tableHtml += `<td><button class="edit-row-btn" data-id='${data.cpf}'>Edit</button></td>`;
  tableHtml += '</tr>';

  if (isTableData) {
    table.innerHTML = tableHtml;
  } else {
    const newRow = table.insertRow();
    newRow.innerHTML = tableHtml;
  }
}

function loadHTMLTable(data) {
  const table = document.querySelector('table tbody');

  if (data.length === 0) {
    table.innerHTML =
      "<tr><td class='no-data' colspan='7'>No Data</td></tr>";
    return;
  }

  let tableHtml = '';
  data.forEach(function ({ cpf, nome, email, idade, profissao }) {
    tableHtml += `<tr data-id="${cpf}">`;
    tableHtml += `<td>${cpf}</td>`;
    tableHtml += `<td>${nome}</td>`;
    tableHtml += `<td>${email}</td>`;
    tableHtml += `<td>${idade}</td>`;
    tableHtml += `<td>${profissao}</td>`;
    tableHtml += `<td><button class="delete-row-btn" data-id="${cpf}">Delete</button></td>`;
    tableHtml += `<td><button class="edit-row-btn" data-id="${cpf}">Edit</button></td>`;
    tableHtml += `</tr>`;
  });

  table.innerHTML = tableHtml;
}
