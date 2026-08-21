<?php
require_once __DIR__ . '/config.php';
header('Content-Type: application/json');
setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

checkAuth();

$uploadDir = __DIR__ . '/../uploads/';
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$urls = [];
$allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'];
$maxSize = 10 * 1024 * 1024; // 10MB

// 1. Multipart form files
if (!empty($_FILES['files'])) {
    $files = $_FILES['files'];
    $fileCount = is_array($files['name']) ? count($files['name']) : 1;

    for ($i = 0; $i < $fileCount; $i++) {
        $name = is_array($files['name']) ? $files['name'][$i] : $files['name'];
        $tmp = is_array($files['tmp_name']) ? $files['tmp_name'][$i] : $files['tmp_name'];
        $size = is_array($files['size']) ? $files['size'][$i] : $files['size'];
        $error = is_array($files['error']) ? $files['error'][$i] : $files['error'];

        if ($error === UPLOAD_ERR_OK && $size <= $maxSize) {
            $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
            if (in_array($ext, $allowed)) {
                $filename = 'art_' . round(microtime(true) * 1000) . '_' . bin2hex(random_bytes(4)) . '.' . ($ext === 'jpeg' ? 'jpg' : $ext);
                $dest = $uploadDir . $filename;
                if (move_uploaded_file($tmp, $dest)) {
                    $urls[] = '/uploads/' . $filename;
                }
            }
        }
    }
}

// 2. Base64 payload upload
$rawInput = file_get_contents('php://input');
$json = json_decode($rawInput, true);

if (!empty($json['images']) && is_array($json['images'])) {
    foreach ($json['images'] as $imgData) {
        if (preg_match('/^data:image\/(\w+);base64,/', $imgData, $type)) {
            $data = substr($imgData, strpos($imgData, ',') + 1);
            $ext = strtolower($type[1]);
            if ($ext === 'jpeg') $ext = 'jpg';
            if (in_array($ext, $allowed)) {
                $decoded = base64_decode($data);
                if ($decoded !== false && strlen($decoded) <= $maxSize) {
                    $filename = 'art_' . round(microtime(true) * 1000) . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
                    file_put_contents($uploadDir . $filename, $decoded);
                    $urls[] = '/uploads/' . $filename;
                }
            }
        }
    }
}

if (!empty($urls)) {
    echo json_encode(['success' => true, 'urls' => $urls]);
} else {
    http_response_code(400);
    echo json_encode(['error' => 'No valid images uploaded or file exceeds 10MB limit']);
}
