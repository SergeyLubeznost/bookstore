

<?php

$name = isset($_POST['name']) ? $_POST['name'] : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';

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
  
    $sql = "SELECT * FROM `users`;";
    $result = mysqli_query($link, $sql);

    if ($result === false) {
        echo json_encode(["error" => 'Ошибка: ' . mysqli_error($link)]);
        exit;
    }

    $users = []; // Создаем пустой массив для хранения всех пользователей

    while ($data = mysqli_fetch_array($result)) {
        $users[] = $data; // Добавляем каждого пользователя в массив $users
    }
    
    $authenticated = false;
    
    foreach ($users as $user) {
        if (password_verify($password, $user['password']) && $name == $user['name']) {
            $authenticated = true;
            header('Content-Type: application/json');
            echo json_encode(["status" => "Ok", "role" => $user['role'], "name" => $name, "id" => $user['id']], JSON_UNESCAPED_UNICODE);
            break; // После аутентификации нужно выйти из цикла
        }
    }
    
    if (!$authenticated) {
        header('Content-Type: application/json');
        echo json_encode(["status" => "Failed", "message" => "Неверные имя пользователя или пароль.", "name" => $name, "password" => $password], JSON_UNESCAPED_UNICODE);
    }



mysqli_close($link);
}
?>

