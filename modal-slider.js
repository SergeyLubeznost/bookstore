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
    
    
        <label for="exampleInputEmail1" class="form-label">Login</label>
        <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
      </div>
      <div class="mb-3">
        <label for="exampleInputPassword1" class="form-label">Password</label>
        <input type="password" class="form-control" id="exampleInputPassword1">
      </div>
      
      <button id="submitSlider" type="submit" class="btn btn-primary">Submit</button>
     <button id="close" type="button" class="btn btn-bck">Close</button>
    </form>`;
    modalWindow.appendChild(modalBody);
      // Добавляем модальное окно в тело документа
      document.body.appendChild(modalWindow);
      
      const submitButton = document.querySelector("#submitSlider");
     
      submitButton.addEventListener("click", () => {
        
        modalWindow.classList.remove('open');
        // Удаление модального окна из DOM после завершения анимации
        modalWindow.addEventListener('transitionend', () => {
            modalWindow.remove();
        });
    });
    
    
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
