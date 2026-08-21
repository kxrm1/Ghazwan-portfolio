<?php
require_once __DIR__ . '/config.php';
header('Content-Type: application/json');
setCorsHeaders();

$input = json_decode(file_get_contents('php://input'), true);
$action = isset($_GET['action']) ? $_GET['action'] : ($input['action'] ?? 'login');

if ($action === 'login') {
    $username = trim($input['username'] ?? '');
    $password = trim($input['password'] ?? '');

    if ($username === ADMIN_USER && $password === ADMIN_PASS) {
        $token = hash('sha256', $username . ':' . SECRET_SALT . ':' . date('Y-m-d'));
        echo json_encode([
            'success' => true,
            'token' => $token,
            'user' => $username
        ]);
        exit;
    } else {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid username or password.']);
        exit;
    }
}

if ($action === 'verify') {
    checkAuth();
    echo json_encode(['valid' => true, 'user' => ADMIN_USER]);
    exit;
}

http_response_code(400);
echo json_encode(['error' => 'Invalid action']);
