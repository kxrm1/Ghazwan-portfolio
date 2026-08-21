<?php
require_once __DIR__ . '/config.php';
header('Content-Type: application/json');
setCorsHeaders();

$file = __DIR__ . '/taxonomy.json';

if (!file_exists($file)) {
    $default = [
        'categories' => ['Sculpture', 'Painting', 'Jewelry', 'Monument'],
        'materials' => ['Bronze', 'Marble', 'Wood', 'Stone & Basalt', 'Clay & Terracotta', 'Silver', 'Gold', 'Mixed Media', 'Oil & Charcoal', 'Ceramics', 'Glass', 'Steel & Iron']
    ];
    file_put_contents($file, json_encode($default, JSON_PRETTY_PRINT));
}

function getTaxonomy($f) {
    return json_decode(file_get_contents($f), true) ?: ['categories' => [], 'materials' => []];
}

function saveTaxonomy($f, $data) {
    return file_put_contents($f, json_encode($data, JSON_PRETTY_PRINT));
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    echo json_encode(getTaxonomy($file));
    exit;
}

checkAuth();
$input = json_decode(file_get_contents('php://input'), true);

if ($method === 'POST') {
    $type = $input['type'] ?? 'material';
    $name = trim($input['name'] ?? '');
    if (!$name) {
        http_response_code(400);
        echo json_encode(['error' => 'Name is required']);
        exit;
    }
    $tax = getTaxonomy($file);
    $key = $type === 'category' ? 'categories' : 'materials';
    if (!in_array($name, $tax[$key])) {
        $tax[$key][] = $name;
        saveTaxonomy($file, $tax);
    }
    echo json_encode(['success' => true, 'taxonomy' => $tax]);
    exit;
}

if ($method === 'PUT') {
    $type = $input['type'] ?? 'material';
    $oldName = trim($input['oldName'] ?? '');
    $newName = trim($input['newName'] ?? '');
    if (!$oldName || !$newName) {
        http_response_code(400);
        echo json_encode(['error' => 'Both old and new names required']);
        exit;
    }
    $tax = getTaxonomy($file);
    $key = $type === 'category' ? 'categories' : 'materials';
    $idx = array_search($oldName, $tax[$key]);
    if ($idx !== false) {
        $tax[$key][$idx] = $newName;
        saveTaxonomy($file, $tax);
        echo json_encode(['success' => true, 'taxonomy' => $tax]);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Item not found']);
    }
    exit;
}

if ($method === 'DELETE') {
    $type = $_GET['type'] ?? ($input['type'] ?? 'material');
    $name = trim($_GET['name'] ?? ($input['name'] ?? ''));
    if (!$name) {
        http_response_code(400);
        echo json_encode(['error' => 'Name is required']);
        exit;
    }
    $tax = getTaxonomy($file);
    $key = $type === 'category' ? 'categories' : 'materials';
    $tax[$key] = array_values(array_filter($tax[$key], function($i) use ($name) {
        return $i !== $name;
    }));
    saveTaxonomy($file, $tax);
    echo json_encode(['success' => true, 'taxonomy' => $tax]);
    exit;
}
