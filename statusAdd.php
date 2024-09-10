<?php
$idStatus = isset($_POST['id']) ? (int)$_POST['id'] : 0; // Приводим к integer
$status = isset($_POST['status']) ? $_POST['status'] : '';

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
    
    // Подготовка SQL-запроса для изменения статуса книги
    $sql = "UPDATE `books__orders` SET `status` = ? WHERE `id` = ?";

    // Подготовка и связывание
    if ($stmt = mysqli_prepare($link, $sql)) {
        mysqli_stmt_bind_param($stmt, "si", $status, $idStatus); // "si" означает: первый параметр -- string, второй -- integer

        // Выполнение запроса
        if (mysqli_stmt_execute($stmt)) {
            http_response_code(200); // Устанавливаем статус код 200
            if (mysqli_stmt_affected_rows($stmt) > 0) {
                echo json_encode(["status" => "success", "message" => "Статус изменен."]);
            } else {
                echo json_encode(["status" => "warning", "message" => "Упс."]);
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
