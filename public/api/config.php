<?php
// Ghazwan Portfolio PHP Backend Configuration

// Load custom env if available
$adminUser = getenv('ADMIN_USERNAME') ?: 'admin';
$adminPass = getenv('ADMIN_PASSWORD') ?: 'ghazwan2026!';
$secretSalt = getenv('AUTH_SECRET') ?: 'ghazwan_secret_salt_key_9988';

define('ADMIN_USER', $adminUser);
define('ADMIN_PASS', $adminPass);
define('SECRET_SALT', $secretSalt);

function setCorsHeaders() {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Credentials: true');

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}

function checkAuth() {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? ($headers['authorization'] ?? '');
    $token = str_replace('Bearer ', '', $authHeader);

    // Support both the daily hash token and HMAC style
    $validDailyToken = hash('sha256', ADMIN_USER . ':' . SECRET_SALT . ':' . date('Y-m-d'));
    
    // Also accept Node.js generated HMAC token if passed
    $isValid = false;
    if ($token && hash_equals($validDailyToken, $token)) {
        $isValid = true;
    } else if ($token && strpos($token, '.') !== false) {
        list($payloadB64, $sig) = explode('.', $token, 2);
        $expectedSig = hash_hmac('sha256', $payloadB64, SECRET_SALT);
        // Compare signature
        $expectedSigUrl = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode(hex2bin($expectedSig)));
        if (hash_equals($expectedSigUrl, $sig) || hash_equals($expectedSig, $sig)) {
            $payload = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $payloadB64)), true);
            if ($payload && isset($payload['exp']) && $payload['exp'] > (time() * 1000)) {
                $isValid = true;
            }
        }
    }

    if (!$isValid) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }
}
