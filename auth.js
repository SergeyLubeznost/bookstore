
 let admin;
let userID;
let userName;
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

  const submitButton = document.querySelector("#submit");
  submitButton.addEventListener('click', handleSubmitData);
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
}

function handleSubmitData(event) {
  event.preventDefault();
  let password = document.querySelector("#exampleInputPassword1").value;
  let name = document.querySelector("#exampleInputEmail1").value;




  console.log(name)
  console.log(password)


  const formData = new FormData();
  formData.append('name', name);
  formData.append('password', password);

  fetch("http://bookmarket/auth.php", {
      method: 'POST',
      body: formData
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === "Ok") { // Проверяем успешность авторизации
      admin = data.role; // Устанавливаем роль пользователя
      userID = data.id;
      userName = data.name
      // Сохраняем роль в localStorage
      localStorage.setItem('userRole', admin);
      localStorage.setItem('userID', userID);
      localStorage.setItem('userName', userName);
      console.log(data);

      let sectionAdmin = document.querySelector('#admin_section');
      // Управляем видимостью административного раздела
      if (admin === "админ") {
          sectionAdmin.classList.remove('none');
          sectionAdmin.classList.add('addbook__section');
      } else {
          sectionAdmin.classList.remove('addbook__section');
          sectionAdmin.classList.add('none');
      }

      // Обновляем видимость кнопок
      enter.classList.add('none'); // скрываем кнопку "Войти"
      exit.classList.remove('none'); // показываем кнопку "Выход"
      location.reload(true);
  } else {
      // Если авторизация не удалась
      alert("Неверные данные. Попробуйте снова.");
      enter.classList.remove('none'); // показываем кнопку "Войти"
      exit.classList.add('none'); // скрываем кнопку "Выход"
  }
})
  .catch(error => {
      console.error('Error response', error);
  });
}

