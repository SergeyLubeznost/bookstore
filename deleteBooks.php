<?php
$idBook = isset($_POST['id']) ? $_POST['id'] : '';
$title = isset($_POST['titleBook']) ? $_POST['titleBook'] : '';




$link = mysqli_connect("localhost", "root", "", "bookmarket");

if ($link === false) {
    echo json_encode(["error" => "Невозможно подключиться к MySQL. Ошибка: " . mysqli_connect_error()]);
    exit;
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
    
 

     // Подготовка SQL-запроса для удаления книги
     $sql = "DELETE FROM `favorite__books` WHERE `id` = ? AND `book__title` = ?";

     // Подготовка и связывание
     if ($stmt = mysqli_prepare($link, $sql)) {
         mysqli_stmt_bind_param($stmt, "is", $idBook, $title); // "is" означает: первый параметр -- int, второй -- string
 
         // Выполнение запроса
         if (mysqli_stmt_execute($stmt)) {
             if (mysqli_stmt_affected_rows($stmt) > 0) {
                 echo json_encode(["status" => "success", "message" => "Книга успешно удалена."]);
             } else {
                 echo json_encode(["status" => "Warning", "message" => "Книга не найдена или уже удалена.", $title, $idBook]);
             }
         } else {
             echo json_encode(["error" => "Ошибка выполнения запроса: " . mysqli_stmt_error($stmt)]);
         }
 
         // Закрытие подготовленного запроса
         mysqli_stmt_close($stmt);
     } else {
         echo json_encode(["error" => "Ошибка подготовки запроса: " . mysqli_error($link)]);
     }

mysqli_close($link);
}
?>
