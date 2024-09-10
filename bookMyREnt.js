let userName;
function viewMyBooks() {
    console.log('Запрос для загрузки книг');
    fetch("http://bookmarket/myREntBooks.php", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        userName = localStorage.getItem('userName');
console.log(userName);
if(!userName){
    let rentBooksBlock = document.querySelector('.ourBookRent');
    rentBooksBlock.classList.add('none')
    rentBooksBlock.classList.remove('bockRent')

}
        let myRent = Array.isArray(data) ? data : [];
        if(userName){
            viewRentMyBooks(myRent);
            let rentBooksBlock = document.querySelector('.ourBookRent');
            rentBooksBlock.classList.remove('none')
            rentBooksBlock.classList.add('bockRent')
        }
    
    })
    .catch(error => {
        console.error('Ошибка ответа', error);
    });
}

let viewRentMyBooks = (arr) => {
    let rentBooksBlock = document.querySelector('#containerBook');
    rentBooksBlock.innerHTML = '';
    if (arr.length === 0) {
        rentBooksBlock.innerHTML = '<p>Книги не найдены.</p>';
        return;
    }
    arr.forEach(item => {
        if (item.name === userName) {
            let buttonHTML;
    
            if (item.status === "Аренда завершена") {
                buttonHTML = `
                    <button class="buttonDisabled" disabled>Ну вот и всё</button>
                `;
            } else {
                buttonHTML = `
                    <a href="${item.books_path}" target="_blank">
                        <button id='buttonRead' class = 'read'>Читать книгу</button>
                    </a>
                `;
            }
    
            rentBooksBlock.innerHTML += `
            <div class='contBookList'>
                <div>${item.author}</div>
                <div>${item.book__title}</div>
                <div>${item.order__start}</div>
                <div>${item.order__end}</div>
                <div>${item.status}</div>
                ${buttonHTML}
            </div>
            `;
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    console.log('Страница загружена, запускаем загрузку книг');
    viewMyBooks();
});
