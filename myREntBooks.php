<?php

$link = mysqli_connect("localhost", "root", "", "bookmarket");

if ($link === false) {
    echo "Невозможно подключиться к MySQL. Ошибка: " . mysqli_connect_error();
} else {

    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type");
        header("Content-Type: application/json");
        http_response_code(200);
        exit;
    }

    mysqli_set_charset($link, "utf8");
    $sql = "SELECT users.id, users.name, users.secondname, favorite__books.author, favorite__books.book__title,favorite__books.books_path, books__orders.id, books__orders.order__start, books__orders.order__end, books__orders.status FROM 
    users JOIN favorite__books JOIN books__orders ON  clientID = users.id and bookID = favorite__books.id;";
    $result = mysqli_query($link, $sql);

    if ($result === false) {
        echo 'Ошибка: ' . mysqli_error($link);
    } else {
        $data = array();
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
        }

        // Преобразование данных в JSON
        $json = json_encode($data, JSON_UNESCAPED_UNICODE);
        

        // Устанавливаем заголовок Content-Type как application/json
        header('Content-Type: application/json');

        // Выводим JSON
        echo $json;
    }

    $link->close();
}
?>