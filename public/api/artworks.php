<?php
require_once __DIR__ . '/config.php';
header('Content-Type: application/json');
setCorsHeaders();

$dbFile = __DIR__ . '/artworks.json';

if (!file_exists($dbFile)) {
    file_put_contents($dbFile, json_encode([], JSON_PRETTY_PRINT));
}

function getArtworks($file) {
    $data = file_get_contents($file);
    return json_decode($data, true) ?: [];
}

function saveArtworks($file, $items) {
    return file_put_contents($file, json_encode(array_values($items), JSON_PRETTY_PRINT));
}

$method = $_SERVER['REQUEST_METHOD'];

// GET artworks (Public)
if ($method === 'GET') {
    $artworks = getArtworks($dbFile);
    echo json_encode($artworks);
    exit;
}

// Write operations require valid authorization
checkAuth();
$input = json_decode(file_get_contents('php://input'), true);

// CREATE (POST)
if ($method === 'POST') {
    $artworks = getArtworks($dbFile);
    $newId = 'art-' . round(microtime(true) * 1000);
    $images = is_array($input['images'] ?? null) ? array_filter($input['images']) : [];
    $mainImg = trim($input['imageUrl'] ?? ($images[0] ?? ''));
    if (empty($images) && !empty($mainImg)) {
        $images = [$mainImg];
    }
    
    $newItem = [
        'id' => $newId,
        'title' => trim($input['title'] ?? 'Untitled Artwork'),
        'category' => trim($input['category'] ?? 'Sculpture'),
        'material' => trim($input['material'] ?? 'Bronze'),
        'year' => intval($input['year'] ?? date('Y')),
        'status' => in_array($input['status'] ?? '', ['Available', 'Sold', 'Reserved']) ? $input['status'] : 'Available',
        'dimensions' => trim($input['dimensions'] ?? '50 x 30 x 30 cm'),
        'location' => trim($input['location'] ?? 'Studio Damascus'),
        'series' => trim($input['series'] ?? 'Contemporary Works'),
        'aspectRatio' => trim($input['aspectRatio'] ?? 'aspect-[3/4]'),
        'imageUrl' => $mainImg,
        'images' => array_values($images)
    ];
    array_unshift($artworks, $newItem);
    saveArtworks($dbFile, $artworks);
    echo json_encode(['success' => true, 'item' => $newItem]);
    exit;
}

// UPDATE (PUT)
if ($method === 'PUT') {
    $id = $_GET['id'] ?? ($input['id'] ?? null);
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing artwork id']);
        exit;
    }
    $artworks = getArtworks($dbFile);
    $found = false;
    foreach ($artworks as &$item) {
        if ($item['id'] === $id) {
            $item['title'] = isset($input['title']) ? trim($input['title']) : $item['title'];
            $item['category'] = isset($input['category']) ? trim($input['category']) : $item['category'];
            $item['material'] = isset($input['material']) ? trim($input['material']) : $item['material'];
            $item['year'] = isset($input['year']) ? intval($input['year']) : $item['year'];
            $item['status'] = isset($input['status']) ? $input['status'] : $item['status'];
            $item['dimensions'] = isset($input['dimensions']) ? trim($input['dimensions']) : $item['dimensions'];
            $item['location'] = isset($input['location']) ? trim($input['location']) : $item['location'];
            $item['series'] = isset($input['series']) ? trim($input['series']) : $item['series'];
            $item['aspectRatio'] = isset($input['aspectRatio']) ? trim($input['aspectRatio']) : $item['aspectRatio'];
            
            if (isset($input['imageUrl'])) {
                $item['imageUrl'] = trim($input['imageUrl']);
            }
            if (isset($input['images']) && is_array($input['images'])) {
                $item['images'] = array_values(array_filter($input['images']));
                if (!empty($item['images']) && empty($item['imageUrl'])) {
                    $item['imageUrl'] = $item['images'][0];
                }
            }
            
            $found = true;
            break;
        }
    }
    if ($found) {
        saveArtworks($dbFile, $artworks);
        echo json_encode(['success' => true]);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Artwork not found']);
    }
    exit;
}

// DELETE (DELETE)
if ($method === 'DELETE') {
    $id = $_GET['id'] ?? ($input['id'] ?? null);
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing artwork id']);
        exit;
    }
    $artworks = getArtworks($dbFile);
    $initialCount = count($artworks);
    $artworks = array_filter($artworks, function($item) use ($id) {
        return $item['id'] !== $id;
    });
    if (count($artworks) < $initialCount) {
        saveArtworks($dbFile, $artworks);
        echo json_encode(['success' => true]);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Artwork not found']);
    }
    exit;
}
