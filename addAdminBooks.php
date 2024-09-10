<?php
$author = isset($_POST['author']) ? $_POST['author'] : '';
$title = isset($_POST['title']) ? $_POST['title'] : '';
$description = isset($_POST['description']) ? $_POST['description'] : '';
$category = isset($_POST['category']) ? $_POST['category'] : '';
$year = isset($_POST['year']) ? $_POST['year'] : '';
$price = isset($_POST['price']) ? $_POST['price'] : '';
$imageBook = isset($_FILES['imageBook']) ? $_FILES['imageBook'] : '';
$imageFileName = isset($imageBook['name']) ? $imageBook['name'] : "No file uploaded";
$tmp_image_name = isset($imageBook['tmp_name']) ? $imageBook['tmp_name'] : '';

// Обработка текстового файла
$txtBook = isset($_FILES['txtBook']) ? $_FILES['txtBook'] : '';
$txtFileName = isset($txtBook['name']) ? $txtBook['name'] : "No file uploaded";
$tmp_txt_name = isset($txtBook['tmp_name']) ? $txtBook['tmp_name'] : '';

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
    
    // Перемещение загруженного изображения
    move_uploaded_file($tmp_image_name, "image/".$imageFileName); 
    
    // Перемещение загруженного текстового файла
    if (!empty($txtFileName)) {
        move_uploaded_file($tmp_txt_name, "text/".$txtFileName);
    }

    if ($price === '') {
        $price = 0; 
    }
    if (!is_numeric($year)) {
        $year = 0; 
    }

    $sql = "INSERT INTO `favorite__books` (`author`, `book__title`, `book__description`, `img__path`, `price`, `year`, `category`, `books_path`) VALUES ('$author', '$title', '$description', 'image/$imageFileName', '$price', '$year', '$category', 'text/$txtFileName')";

    if(mysqli_query($link, $sql)) {
        header('Content-Type: application/json');
        echo json_encode(["status" => "Ok", "message" => "Book data added successfully."], JSON_UNESCAPED_UNICODE);    
    } else {
        header('Content-Type: application/json');
        echo json_encode(["error" => 'Ошибка при добавлении данных в базу данных: ' . mysqli_error($link)]);
    }

    mysqli_close($link);
}
?>
