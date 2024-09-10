import { productId } from './main.js';
let product;
export default function sliderModal() {
    let books;
    fetch("http://bookmarket/books.php", {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        books = data; // Присваиваем данные к глобальной переменной books
        console.log(books)
        console.log(productId)

// Проверить, что массив books определен, прежде чем использовать метод find
if (Array.isArray(books)) {
     product = books.find(item => item.id === productId);
    if (product) {
        console.log(product);
        const modalWindow = document.createElement('div');
        modalWindow.className = 'modal__window';
    
        const modalBody = document.createElement('div');
        modalBody.className = 'modal__body';
        modalBody.innerHTML = `<form>
      <div class="mb-3">
    
                <img class="sliderImage" src="${product.img__path}" alt="${product.img__path}">
                <p class="title__book">${product.book__title}</p>
                <p class="author__book">Автор: <b>${product.author}</b></p>
                <p class="author__book">Категория: <b>${product.category}</b></p>
                <p class="author__book">Год написания: <b>${product.year}</b></p>
                <p class="author__book"><b>Описание:</b> ${product.book__description}</p>
                <p class="book__price">Стоимость: <b>${product.price} руб</b></p>
    
      <button id="submitOrder" type="submit" class="btn btn-primary red" data-id=${product.id}>Заказать книгу</button>
      <button id="rentFor2Weeks" type="submit" class="btn btn-primary modal-card" data-id=${product.id}>Арендовать на 2 недели</button>
      <button id="rentFor1Month" type="submit" class="btn btn-primary modal-card" data-id=${product.id}>Арендовать на 1 месяц</button>
      <button id="rentFor3Month" type="submit" class="btn btn-primary modal-card" data-id=${product.id}>Арендовать на 3 месяца</button>
      
     <button id="close" type="button" class="btn btn-bck">Close</button>
    </form>`;
    modalWindow.appendChild(modalBody);
      // Добавляем модальное окно в тело документа
      document.body.appendChild(modalWindow);
      
        let orderBtn = document.querySelector("#submitOrder")
        let modalCard = document.querySelectorAll(".modal-card")
        let rent2weeks = document.querySelector('#rentFor2Weeks');
        let rentFor1Month = document.querySelector('#rentFor1Month');
        let rentFor3Month = document.querySelector('#rentFor3Month');
        modalCard.forEach(button => {
            button.addEventListener('click', function () {
                let productId = orderBtn.getAttribute('data-id');
            });
        });

     
        rent2weeks.addEventListener('click', (e)=>{
                e.preventDefault();
                console.log(productId)
                rent2Weeks (books,productId,"в аренде на 2 недели",0)
                location.reload(true);
        })
        rentFor1Month.addEventListener('click', (e)=>{
                e.preventDefault();
             
                rent2Weeks (books,productId,"в аренде на 1 месяц",31)
                location.reload(true);
        })
        rentFor3Month.addEventListener('click', (e)=>{
                e.preventDefault();
               
                rent2Weeks (books,productId,"в аренде на 3 месяца",93)
                location.reload(true);
        })


        orderBtn.addEventListener('click', (e)=>{
            e.preventDefault();
            console.log(productId)
 
                downloadBook(books,productId)
        })

//функция загрузки
        function downloadBook(arr,productId) {
            const downloadItem = arr.find(item => item.id === productId);
            console.log(downloadItem);
        
            if (downloadItem) {
        // Создаем ссылку для скачивания
        const link = document.createElement('a');
        link.href = downloadItem.books_path; // Путь к файлу
        link.download = downloadItem.book__title; // Имя файла для скачивания
        document.body.appendChild(link); // Добавляем ссылку в DOM
        link.click(); // Симулируем клик по ссылке
        document.body.removeChild(link); // Удаляем ссылку из DOM
        modalWindow.remove();
    } else {
        console.log('Файл не найден');
    }
        }

        //функция аренды 
        function rent2Weeks (arr,product,stutus, daysRent){
            let userID = localStorage.getItem('userID');
            let status = stutus;
            const rentItem = arr.find(item => item.id === product);
            if (rentItem){
                const formData = new FormData();
                formData.append('idUser', userID);
                formData.append('idBooks', rentItem.id);
                formData.append('status', status);

                  // Получаем текущую дату
        const startRent = new Date();
        const endRent = new Date();
        endRent.setDate(startRent.getDate() + daysRent); // Добавляем 14 дней

          // Сохраняем дату окончания аренды в localStorage
          localStorage.setItem(`endRent_${userID}_${rentItem.id}`, endRent);

        // Приводим даты к нужному формату (YYYY-MM-DD)
        const formatDate = (date) => {
            return date.toISOString().split('T')[0]; // Формат YYYY-MM-DD
        };

        // Добавляем даты в форму
        formData.append('startRent', formatDate(startRent));
        formData.append('endRent', formatDate(endRent));
              
                fetch("http://bookmarket/rentBooks.php", {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    modalWindow.remove();
                })
                .catch(error => {
                    console.error('Error response', error);
                });
            }
        
    
        }


        // Запрос разрешения на уведомления
function requestNotificationPermission() {
    if (Notification.permission === "default") {
        Notification.requestPermission();
    }
}

// Функция для создания уведомления
function showNotification(message) {
    if (Notification.permission === "granted") {
        new Notification("Аренда закончилась", {
            body: message,
            // icon: "path/to/icon.png" // Укажите путь к значку, если нужно
        });
    }
}

// Функция проверки окончания аренды
function checkRentEnd() {
    const userID = localStorage.getItem('userID');
    const rentItems = Object.keys(localStorage).filter(key => key.startsWith(`endRent_${userID}`));

    const currentDate = new Date();
    rentItems.forEach(key => {
        const endRentDate = new Date(localStorage.getItem(key));
        if (endRentDate <= currentDate) {
            showNotification(`Аренда товара с ID ${key.split('_')[2]} закончилась.`);
            localStorage.removeItem(key); // Удаляем дату завершения из localStorage
        }
    });
}

// Запрос разрешения
requestNotificationPermission();

// Запускаем проверку каждые 60 секунд
setInterval(checkRentEnd, 60000);



    
      setTimeout(() => {
        modalWindow.classList.add('open');
    }, 70); // добавляем небольшую задержку для анимации
    
      const closeBtn = document.getElementById("close");
    
      // Обработчик события для закрытия модального окна
      closeBtn.addEventListener("click", () => {
        
        modalWindow.classList.remove('open');
        // Удаление модального окна из DOM после завершения анимации
        modalWindow.addEventListener('transitionend', () => {
            modalWindow.remove();
        });
    });
    } else {
        console.log('Product not found');
    }
}
    })
    .catch(error => {
        console.error('Error response', error);
    });


   
}
