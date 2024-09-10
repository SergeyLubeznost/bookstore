import authModal from "./auth.js";
import sliderModal from "./modal-slider.js";



// Глобальные переменные
let adminRole;
let userID;
let userName;
let books;
let sliderContainer = document.querySelector(".swiper-wrapper");
let selectElement = document.getElementById("categorySelect");
let sortCheckbox = document.querySelector("#sort_author");
let sortDate = document.querySelector("#sort_date");
export let productId;

// Функция для обработки полученных данных о книгах
function responseBooks() {
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
        console.log(books);
        adminRole = localStorage.getItem('userRole');
console.log(adminRole); // Получаем значение из localStorage
userID = localStorage.getItem('userID');
console.log(userID);
userName = localStorage.getItem('userName');
console.log(userName);
 

        createSlider(books); // Вызываем функцию createSlider с передачей данных
        populateCategorySelect(books);
        applyCategoryFilter(); // Применяем фильтр по категории
        // Слушатель изменений состояния чекбокса для сортировки по автору
sortCheckbox.addEventListener("change", applyAuthorSort);

// Обработчик события изменения значения в поле ввода даты
sortDate .addEventListener("input", function() {
    let dateValue = this.value; // Получение только года из введенной даты
    updateSortedBooks(dateValue,books);
});
    })
    .catch(error => {
        console.error('Error response', error);
    });
}

// Создание слайдера на основе полученных данных
export function createSlider(arr) {
    if (Array.isArray(arr)) {
        arr.forEach(item => {
            const sliderWrapper = document.createElement('div');
            sliderWrapper.className = 'swiper-slide';

            sliderWrapper.innerHTML = `
            <button id="deleteBooks" data-id="${item.id}" class="delete"> Удалить </button>
            <img class="sliderImage" src="${item.img__path}" alt="${item.img__path}">
            <p class="title__book">${item.book__title}</p>
            <p class="author__book">Автор: <b>${item.author}</b></p>
            <p class="author__book">Год написания: <b>${item.year}</b></p>
            
            <div class="accordion-item">
                <h6 class="accordion-header">
                    <button id="chagePriceShow" data-id="${item.id}" class="chagePriceItem" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${item.id}">
                        Изменить стоимость
                    </button>
                </h6>
                <div id="collapse${item.id}" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                    <div class="accordion-body">
                        <input type="number" class="form-control changePriceInput" id="changePriceInput${item.id}" aria-describedby="emailHelp">
                        <button id="chagePrice" data-id="${item.id}" class="chagePrice"> Изменить</button>
                    </div>
                </div>
            </div>
            
            <p class="book__price">Стоимость: <b>${item.price} руб</b></p>
            <button id="order__slider" class="order" data-id="${item.id}">Заказать</button>
        `;

            if (adminRole === 'админ') {
                sliderWrapper.querySelector('.delete').style.display = 'block'; // Показываем кнопку
                sliderWrapper.querySelector('.chagePrice').style.display = 'block'; // Показываем кнопку
                sliderWrapper.querySelector('.accordion-item').style.display = 'block'; // Показываем кнопку
            } else {
                sliderWrapper.querySelector('.delete').style.display = 'none'; // Скрываем кнопку
                sliderWrapper.querySelector('.chagePrice').style.display = 'none'; // Скрываем кнопку
                sliderWrapper.querySelector('.accordion-item').style.display = 'none'; // Скрываем кнопку
            }
            if (adminRole) {
                sliderWrapper.querySelector('.order').style.display = 'block'; // Показываем кнопку
             
            } else {
                sliderWrapper.querySelector('.order').style.display = 'none'; // Скрываем кнопку
                
            }

            sliderContainer.appendChild(sliderWrapper);
   

            // Добавляем обработчик событий для кнопки изменения цены
            const changePriceButton = sliderWrapper.querySelector('.chagePrice');

            changePriceButton.addEventListener('click', function() {
                changeBookPrice(arr, item.id); // Передаем массив книг и ID книги
                location.reload(true);
                swiper.update(); // Обновляем слайдер
            });
        });

        swiper.update();
        const orderSlider = document.querySelectorAll('.order');
        orderSlider.forEach(slider => {
            slider.addEventListener('click',  sliderModal);
        });
        orderSlider.forEach(button => {
            button.addEventListener('click', function() {
            productId = button.getAttribute('data-id');
           
          
            console.log(productId)
            });
          });




          const deleteBooks = document.querySelectorAll(".delete");

            if (!adminRole === "админ"){
                deleteBooks.classList.add('none');
            }

          deleteBooks.forEach(button => {
              button.addEventListener('click', function() {
                  const booksID = button.getAttribute('data-id'); // Получаем ID книги
                  deleteBook(books, booksID); // Вызываем функцию удаления книги с переданным ID
                  location.reload(true);
                  swiper.update(); // Обновляем слайдер
              });
          });

      
          const changeBooks = document.querySelectorAll(".chagePrice");
  

            if (!adminRole === "админ"){
                changeBooks.classList.add('none');
            } 
        
    }
}

function changeBookPrice(arr, booksID) {
    const changeItem = arr.find(item => item.id == booksID);
    const changeBooksInput = document.getElementById(`changePriceInput${booksID}`); // Получаем конкретный input по ID

    if (changeItem && changeBooksInput) {
        const newPrice = changeBooksInput.value; // Получаем новое значение цены из input
        const formData = new FormData();
        formData.append('id', changeItem.id);
        formData.append('price', newPrice); // Передаем новую цену

        // Отправляем запрос на сервер для изменения цены книги
        fetch("http://bookmarket/changeBooks.php", {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            swiper.update(); // Обновляем слайдер
            console.log(`Цена книги с ID ${booksID} была изменена на ${newPrice}.`);
        })
        .catch(error => {
            console.error('Error response', error);
        });
    } else {
        console.log(`Книга с ID ${booksID} не найдена или input не существует.`);
    }
}


function deleteBook(arr, booksID) {
    const deleteItem = arr.find(item => item.id === booksID);
    console.log(deleteItem);

    if (deleteItem) {
        const formData = new FormData();
        formData.append('id', deleteItem.id);
        formData.append('titleBook', deleteItem.book__title);
        
        // Здесь можно добавить код для отправки formData на сервер для удаления книги
        fetch("http://bookmarket/deleteBooks.php", {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
                    swiper.update(); // Обновляем слайдер
        })
        .catch(error => {
            console.error('Error response', error);
        });
        swiper.update();
        console.log(`Книга с ID ${booksID} была удалена.`);
    } else {
        console.log(`Книга с ID ${booksID} не найдена.`);
    }
}



// Применение фильтрации по категории
function applyCategoryFilter() {
    selectElement.addEventListener("change", function() {
        var selectedCategory = selectElement.value;
        var filteredBooks = filterBooksByCategory(selectedCategory);
        sortDate.value = "";
        sliderContainer.innerHTML = ""; 
        createSlider(filteredBooks); 
        swiper.update();
    });
}

function populateCategorySelect(books) {
    const categorySelect = document.querySelector("#categorySelect");
    const categories = new Set(); // Используем Set для уникальных значений

    // Сбор всех уникальных категорий
    books.forEach(book => categories.add(book.category));

    // Добавление категорий в селект
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });

    // Добавление опции "Все"
    const allOption = document.createElement("option");
    allOption.value = "Все";
    allOption.textContent = "Все";
    allOption.selected = true;
    categorySelect.appendChild(allOption);
}




function filterBooksByCategory(category) {
    if (!books) return [];

    if (category === "Все") {
        return books;
    } else {
        return books.filter(book => book.category === category);
    }
}


// Применение сортировки по автору
function applyAuthorSort() {
    const isChecked = sortCheckbox.checked;
    if (isChecked) {
        let deepCopyArray = JSON.parse(JSON.stringify(books));
        deepCopyArray.sort((a, b) => a.author.localeCompare(b.author));
        sortDate.value = "";
        sliderContainer.innerHTML = "";
        createSlider(deepCopyArray);
        swiper.update();
    } else {
        // Если чекбокс не отмечен, восстанавливаем исходный порядок
        sortDate.value = "";
        sliderContainer.innerHTML = "";
        createSlider(books);
        swiper.update();
    }
}


function sortByYear(a, b) {
    return new Date(a.year) - new Date(b.year);
}

// Функция для обновления отображения отсортированного списка книг с учетом введенного года и последующих лет
function updateSortedBooks(dateValue,books) {
    // Создание копии неотсортированного массива
    let sortedBooks = books.slice();

       // Если введенное значение пустое, отобразить все книги
       if (dateValue === "") {
        sliderContainer.innerHTML = "";
        createSlider(books);
        swiper.update();
        console.log(books);
        return;
    }

    // Фильтрация отображаемого массива по введенной дате, включая год и последующие года
    sortedBooks = sortedBooks.filter(book => new Date(book.year).getFullYear() >= parseInt(dateValue));

    // Если ничего не найдено, вывести сообщение
    if (sortedBooks.length === 0) {
        console.log("Нет книг для выбранного года и последующих лет.");
        return  ;
    }


    // Сортировка массива по дате (году)
    sortedBooks.sort(sortByYear);

    // Обновление интерфейса с учетом отсортированных книг
    sliderContainer.innerHTML = "";
    createSlider(sortedBooks);
    swiper.update();
    console.log(sortedBooks);
    // Дополнительные действия по обновлению интерфейса/выводу


}


// Вызов функции для загрузки данных о книгах
responseBooks();

// Обработчик кнопки входа
let enter = document.querySelector("#enter");
enter.addEventListener("click", authModal);
let exit = document.querySelector('#exit')

const userRole = localStorage.getItem('userRole');

exit.addEventListener('click',() =>{
    localStorage.removeItem('userRole');
    localStorage.removeItem('userID');
    localStorage.removeItem('userName');
    exit.classList.add('none');
    enter.classList.remove('none')
    let sectionAdmin = document.querySelector('#admin_section');
    console.log(sectionAdmin);
    sectionAdmin.classList.remove('addbook__section');
    sectionAdmin.classList.add('none');
    location.reload(true);

} )


if (userRole){
    enter.classList.add('none');
    exit.classList.remove('none');
    document.querySelector('#infoUser').style.display = 'none'; // Скрываем кнопку

}else{
    exit.classList.add('none');
    enter.classList.remove('none');
 
    document.querySelector('#infoUser').style.display = 'block'; // Показываем кнопку
}




       

if (userRole === "админ"){
    let sectionAdmin = document.querySelector('#admin_section');
    console.log(sectionAdmin);
    sectionAdmin.classList.remove('none');
    sectionAdmin.classList.add('addbook__section');

    
  }else{
    let sectionAdmin = document.querySelector('#admin_section');
    console.log(sectionAdmin);
    sectionAdmin.classList.remove('addbook__section');
    sectionAdmin.classList.add('none');
  }


