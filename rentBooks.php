<?php

$idBook = isset($_POST['idBooks']) ? $_POST['idBooks'] : 1;
$idUser = isset($_POST['idUser']) ? $_POST['idUser'] : 2;
$status = isset($_POST['status']) ? $_POST['status'] : 'не определено';
$startRent = isset($_POST['startRent']) ? $_POST['startRent'] : date('Y-m-d H:i:s');
$endRent = isset($_POST['endRent']) ? $_POST['endRent'] : date('Y-m-d H:i:s');

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

    // Получение id книги из favorite__books
    if ($idBook) {
        $sql = "SELECT id FROM favorite__books WHERE id = ?";
        $stmt = mysqli_prepare($link, $sql);
        mysqli_stmt_bind_param($stmt, "i", $idBook);
        mysqli_stmt_execute($stmt);

        // Получение результата
        $result = mysqli_stmt_get_result($stmt);
        if ($result->num_rows > 0) {
            // Извлечение id книги
            $row = $result->fetch_assoc();
            $bookIDFetched = $row["id"];
        } else {
            echo json_encode(["error" => "Запись не найдена."]);
            mysqli_stmt_close($stmt);
            mysqli_close($link);
            exit;
        }

        // Закрытие подготовленного выражения
        mysqli_stmt_close($stmt);
    }
    // Получение id книги из favorite__books
    if ($idUser) {
        $sql = "SELECT id FROM users WHERE id = ?";
        $stmt = mysqli_prepare($link, $sql);
        mysqli_stmt_bind_param($stmt, "i", $idUser);
        mysqli_stmt_execute($stmt);

        // Получение результата
        $result = mysqli_stmt_get_result($stmt);
        if ($result->num_rows > 0) {
            // Извлечение id книги
            $row = $result->fetch_assoc();
            $userIDFetched = $row["id"];
        } else {
            echo json_encode(["error" => "Запись не найдена."]);
            mysqli_stmt_close($stmt);
            mysqli_close($link);
            exit;
        }

        // Закрытие подготовленного выражения
        mysqli_stmt_close($stmt);
    }

    // Подготовка SQL-запроса для добавления заказа
    $sql = "INSERT INTO `books__orders` (`bookID`, `clientID`, `order__start`, `order__end`, `status`) VALUES (?, ?, ?, ?, ?)";

    // Подготовка команды
    if ($stmt = mysqli_prepare($link, $sql)) {
        // Привязываем параметры (i - целое число, s - строка и т.д.)
        mysqli_stmt_bind_param($stmt, "iisss", $bookIDFetched, $userIDFetched, $startRent, $endRent, $status);

        // Выполняем запрос
        if (mysqli_stmt_execute($stmt)) {
            echo json_encode(["success" => "Заказ успешно добавлен!"]);
        } else {
            echo json_encode(["error" => "Ошибка при добавлении заказа: " . mysqli_error($link)]);
        }

        // Закрытие подготовленного выражения
        mysqli_stmt_close($stmt);
    } else {
        echo json_encode(["error" => "Ошибка подготовки SQL-запроса: " . mysqli_error($link)]);
    }

    // Закрываем соединение
    mysqli_close($link);
}
?>
