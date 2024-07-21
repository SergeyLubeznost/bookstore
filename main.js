import authModal from "./auth.js";
import sliderModal from "./modal-slider.js";


// Глобальные переменные
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

        createSlider(books); // Вызываем функцию createSlider с передачей данных
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
function createSlider(arr) {
    if (Array.isArray(arr)) {
        arr.forEach(item => {
            const sliderWrapper = document.createElement('div');
            sliderWrapper.className = 'swiper-slide';

            sliderWrapper.innerHTML = `
            <img class="sliderImage" src="${item.img__path}" alt="${item.img__path}">
            <p class="title__book">${item.book__title}</p>
            <p class="author__book">Автор: <b>${item.author}</b></p>
            <p class="author__book">Год написания: <b>${item.year}</b></p>
            <p class="book__price">Стоимость: <b>${item.price} руб</b></p>
            <button id="order__slider" class="order" data-id="${item.id}">Заказать</button>
            `;

            sliderContainer.appendChild(sliderWrapper);
        });
        swiper.update();
        const orderSlider = document.querySelectorAll('.order');
        orderSlider.forEach(slider => {
            slider.addEventListener('click',  sliderModal);
        });
        orderSlider.forEach(button => {
            button.addEventListener('click', function() {
            productId = button.getAttribute('data-id');
            //   window.productId = productId; // Глобальная переменная для передачи productId в другой файл
          
            console.log(productId)
            });
          });
    }
}





// Применение фильтрации по категории
function applyCategoryFilter() {
    selectElement.addEventListener("change", function() {
        var selectedCategory = selectElement.value;
        var filteredBooks = filterBooksByCategory(selectedCategory);
        sortDate.value = "";
        sliderContainer.innerHTML = ""; 
        createSlider(filteredBooks); // Создать слайды для отфильтрованных книг
        swiper.update();
    });
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
    exit.classList.add('none');
    enter.classList.remove('none')
} )

if (userRole){
    enter.classList.add('none');
    exit.classList.remove('none');
}else{
 
}

