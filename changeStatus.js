
let roleAdmin =localStorage.getItem('userRole');
console.log(roleAdmin)
let statusContainer = document.querySelector(".clientsCont");
let viewStatus = document.querySelector('#status');

if (roleAdmin !== 'админ') {
    viewStatus.style.display = 'none';
}

function changeStatus (){
fetch("http://bookmarket/chngSts.php", {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
})
.then(response => response.json())
.then(data => {
   let status = data;
   console.log(status)
if (roleAdmin === 'админ'){
   displayStatus(status)
}
})
.catch(error => {
    console.error('Error response', error);
});
}

let displayStatus =(arr) =>{
    const tableBody = document.getElementById('data-table').querySelector('tbody');

    arr.forEach(item => {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.textContent = item.name;
        row.appendChild(nameCell);

        const secondNameCell = document.createElement('td');
        secondNameCell.textContent = item.secondname;
        row.appendChild(secondNameCell);

        const titleCell = document.createElement('td');
        titleCell.textContent = item.book__title;
        row.appendChild(titleCell);

        const authorCell = document.createElement('td');
        authorCell.textContent = item.author;
        row.appendChild(authorCell);

        const startCell = document.createElement('td');
        startCell.textContent = item.order__start;
        row.appendChild(startCell);

        const endCell = document.createElement('td');
        endCell.textContent = item.order__end;
        row.appendChild(endCell);

        const statusCell = document.createElement('td');
        statusCell.textContent = item.status;
        row.appendChild(statusCell);

       

        let divButton = document.createElement('div');
    
        divButton.innerHTML = `   <div class="accordion-item">
                <h6 class="accordion-header">
                    <button id="chageStatus" data-id="${item.id}" class="changeStatusBtn" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${item.id}">
                        Изменить статус
                    </button>
                </h6>
                <div id="collapse${item.id}" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                    <div class="accordion-body">
                     <button data-id="${item.id}" class="changeStatusOrder"> Закончить аренду?</button>
                    </div>
                </div>
            </div>`;
         row.appendChild(divButton)


        tableBody.appendChild(row);
    });

    
    const statusID = document.querySelectorAll('.changeStatusOrder');

    statusID.forEach(button => {
        button.addEventListener('click', function() {
        productId = button.getAttribute('data-id');
        console.log(productId)
        updateStatus(productId)
        location.reload(true);
        });
    })
}

let updateStatus = (id)=>{
  let textStatus = "Аренда завершена"
    if (id) {
        const formData = new FormData();
        formData.append('id', id);
        formData.append('status', textStatus);

        // Отправляем запрос на сервер для изменения цены книги
        fetch("http://bookmarket/statusAdd.php", {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error response', error);
        });
    } else {
        console.log(`Статус с ID = ${id} не существует.`);
    }
}

changeStatus ()