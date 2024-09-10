function validateFields() {
    let author = document.querySelector("#author__book").value;
    let title__book = document.querySelector("#title__book").value;
    let description = document.querySelector("#description__book").value;
    let category = document.querySelector("#category__book").value;
    let year = document.querySelector("#year__book").value;
    let price = document.querySelector("#price__book").value;
    let imageInput = document.querySelector("#image__book");
    let image = imageInput.files[0];  // Получаем файл, выбранный пользователем
    let txtInput = document.querySelector("#txt__book");
    let txt = txtInput.files[0];  // Получаем файл, выбранный пользователем

    let errors = [];

    if (!author) errors.push("Поле 'Автор' не может быть пустым.");
    if (!title__book) errors.push("Поле 'Название' не может быть пустым.");
    if (!description) errors.push("Поле 'Описание' не может быть пустым.");
    if (!category) errors.push("Поле 'Категория' не может быть пустым.");
    if (!year) errors.push("Поле 'Год' не может быть пустым.");
    if (!price) errors.push("Поле 'Цена' не может быть пустым.");
    if (!image) errors.push("Выберите изображение.");
    if (!txt) errors.push("Выберите файл с текстом.");

    if (errors.length > 0) {
        alert(errors.join("\n")); // Выводим все ошибки
        return false; // Возвращаем false, если есть ошибки
    }

    return true; // Все поля заполнены корректно
}

function addBooks (){
    let btnAddbook = document.querySelector("#addbook");
 
    btnAddbook.addEventListener("click", function(event) {
        if (!validateFields()) {
            event.preventDefault(); // Предотвращаем отправку формы, если есть ошибки
        }else{
        event.preventDefault();
        let author = document.querySelector("#author__book").value;
        let title__book = document.querySelector("#title__book").value;
        let description = document.querySelector("#description__book").value;
        let category = document.querySelector("#category__book").value;
        let year = document.querySelector("#year__book").value;
        let price = document.querySelector("#price__book").value;
        let imageInput = document.querySelector("#image__book");
        let image = imageInput.files[0];  // Получаем файл, выбранный пользователем
        let txtInput = document.querySelector("#txt__book");
        let txt = txtInput.files[0];  // Получаем файл, выбранный пользователеq


        const formData = new FormData();
        formData.append('author', author);
        formData.append('title', title__book);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('year', year);
        formData.append('price', price);
        formData.append('imageBook', image);
        formData.append('txtBook', txt);

              
                  console.log(author, title__book, description, category, year, price, image,txt);
        
        fetch("http://bookmarket/addAdminBooks.php", {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            mySwiper.update(); 
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    } 
    });
    
}
addBooks ()
