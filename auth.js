export default function authModal() {



    const modalWindow = document.createElement('div');
    modalWindow.className = 'modal__window';

    const modalBody = document.createElement('div');
    modalBody.className = 'modal__body';
    modalBody.innerHTML = `<form>
  <div class="mb-3">
    <label for="exampleInputEmail1" class="form-label">Login</label>
    <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
    <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div class="mb-3">
    <label for="exampleInputPassword1" class="form-label">Password</label>
    <input type="password" class="form-control" id="exampleInputPassword1">
  </div>
  
  <button id="submit" type="submit" class="btn btn-primary">Submit</button>
 <button id="close" type="button" class="btn btn-bck">Close</button>
</form>`;
modalWindow.appendChild(modalBody);
  // Добавляем модальное окно в тело документа
  document.body.appendChild(modalWindow);
  let exit = document.querySelector('#exit')
  const submitButton = document.querySelector("#submit");
  submitButton.addEventListener('click', handleSubmitData);
  submitButton.addEventListener("click", () => {
    
    enter.classList.add('none');
    exit.classList.remove('none');

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
}

function handleSubmitData(event) {
  event.preventDefault();
  let password = document.querySelector("#exampleInputPassword1").value;
  let name = document.querySelector("#exampleInputEmail1").value;
  const loader = document.querySelector('.loader');



  console.log(name)
  console.log(password)


  const formData = new FormData();
  formData.append('name', name);
  formData.append('password', password);

  fetch("http://bookmarket/auth.php", {
      method: 'POST',
      body: formData
  })
  .then( loader.classList.add('block')
)
  .then(response => response.json())
  .then(data => {
      // Сохраняем данные в localStorage
localStorage.setItem('userRole', data.role);

// Получаем данные из localStorage и выводим их в консоль
console.log(localStorage.getItem('userRole'));

  })
  .then(loader.classList.add('none'),loader.classList.remove('block'))
  .catch(error => {
      console.error('Error response', error);
      loader.classList.add('none'),loader.classList.remove('block')
  });
}

