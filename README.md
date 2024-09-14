![Описание изображения](/Снимок экрана (44).png)
![Описание изображения](/Снимок экрана (45).png)

# Кейс-задача № 4
## Создать Web-версию книжного магазина

- Необходимо создать web-страницу.
- Создать 2 интерфейса: администратора и пользователя.
- Создать базу данных Ваших любимых книг.
- Для пользовательского интерфейса добавить возможность просмотра книги из библиотеки.
- Добавить возможность сортировки на основе:
  - Категории
  - Автора
  - Года написания
- Добавить функцию покупки или аренды книги сроком на 2 недели / месяц / 3 месяца.
- Для администратора добавить возможность:
  - Изменения списка книг
  - Управления ценой
  - Управления статусами книг и их доступностью
  - Напоминания пользователям об окончании срока аренды (автоматически).
  
Ответом на задание будет ссылка на репозиторий GitHub, где хранится Ваша программа.

## Подробный анализ по выполненной задаче

1. Был разработан интерфейс для администратора и пользователя сайта книг. Логин и пароль для администратора - Сергей: `admin`, а для пользователя - Иван: `user`.
  
2. При авторизации браузер запоминает пользователя с помощью local storage, и пока пользователь не выйдет, данные остаются и корректно отображаются. При выходе из системы все данные стираются из хранилища.
  
3. Мной были использованы такие технологии, как: HTML, CSS, JavaScript, local storage, PHP, MySQL, Bootstrap, Swiper.
  
4. Тематика сайта была посвящена классической литературе.
  
5. Интерфейс пользователя: пока он не зарегистрирован, он не может заказать книгу, только просматривать список книг, сортировать по автору (по алфавиту), по году написания, по категориям. На странице есть кнопка "Войти в систему". Только после входа в систему ему предоставляется возможность скачать книгу или арендовать книгу на 2 недели, на месяц и на 3 месяца. Уведомления осуществляются с помощью стандартных браузерных функций уведомлений. Затем на страницу выводятся блоки с информацией о статусе книг и кнопки для чтения книги. Если аренда завершена, то блоки становятся неактивными.

6. Интерфейс администратора: ему доступны те же функции, что и обычному пользователю. Интерфейс администратора раскрывается путем добавления книг через выпадающий список, вывода таблицы заказов и изменения статуса книг, а также изменения стоимости и удаления книги.

7. При аренде книги информация попадает в таблицу заказов с указанием срока аренды. В таблице книг содержатся: название книги, описание, id, путь к изображению и путь к текстовому файлу книги, а также автор и год написания.

## Рекомендации по устранению выявленных ошибок в ходе выполнения задачи

1. При удалении книги из списка отображаемых, если книга находится в списке заказов, её удалить нельзя, так как она находится в нормализованной таблице заказов, где индексы связаны с другими таблицами. Для решения этой проблемы нужно сначала удалить книгу из списка заказов, а затем из списка отображаемых.

2. Удаление неактивных аренд пользователя, чтобы избавиться от избыточности информации. Либо создать отдельную страницу для истории заказов.
```

