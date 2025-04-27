<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . DIRECTORY_SEPARATOR . 'DataStore.php';

$app = AppFactory::create();

$jsonString = file_get_contents('../db.json');
$data = json_decode($jsonString, true);

$app->add(function ($request, $handler) {
    $response = $handler->handle($request);
    return $response
        ->withHeader('Access-Control-Allow-Origin', '*')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
});

$app->options('/{routes:.+}', function ($request, $response, $args) {
    return $response
        ->withHeader('Access-Control-Allow-Origin', '*')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
});

// Define endpoint for config object
$app->get('/config', function (Request $request, Response $response, array $args) use ($data) {
    $params = $request->getQueryParams();
    $active = isset($params['active']) ? filter_var($params['active'], FILTER_VALIDATE_BOOLEAN) : null;
    $result = [];
    foreach ($data['config'] as $item) {
        if ($active !== null && $item['active'] !== $active) {
            continue;
        }
        $result[] = $item;
    }
    return response($response, $result);
});

// Define endpoint for pages object
$app->get('/pages', function (Request $request, Response $response, array $args) use ($data) {
    $params = $request->getQueryParams();
    $active = isset($params['active']) ? filter_var($params['active'], FILTER_VALIDATE_BOOLEAN) : null;
    $pageId = isset($params['pageId']) ? intval($params['pageId']) : null;
    $result = [];
    foreach ($data['pages'] as $item) {
        if (($active !== null && $item['active'] !== $active) || ($pageId !== null && $item['id'] !== $pageId)) {
            continue;
        }
        $result[] = $item;
    }
    return response($response, $result);
});

// Define endpoint for areas object
$app->get('/areas', function (Request $request, Response $response, array $args) use ($data) {
    $params = $request->getQueryParams();
    $active = isset($params['active']) ? filter_var($params['active'], FILTER_VALIDATE_BOOLEAN) : null;
    $pageId = isset($params['pageId']) ? intval($params['pageId']) : null;
    $result = [];
    foreach ($data['areas'] as $item) {
        if (($active !== null && $item['active'] !== $active) || ($pageId !== null && $item['pageId'] !== $pageId)) {
            continue;
        }
        $result[] = $item;
    }
    return response($response, $result);
});

// Define endpoint for controllers object
$app->get('/css', function (Request $request, Response $response, $args) use ($data) {
    $params = $request->getQueryParams();
    $pageId = isset($params['pageId']) ? intval($params['pageId']) : null;
    $result = [];
    foreach ($data['css'] as $item) {
        if ($pageId !== null && $item['pageId'] !== $pageId) continue;
        $result[] = $item;
    }
    return response($response, $result[0] ?? '');
});
$app->post('/css', function (Request $request, Response $response, $args) {
    $dataStore = new DataStore();
    //$data = $request->getParsedBody();
    $data = json_decode($request->getBody()->getContents(), true);
    if (isset($data['id'])) unset($data['id']);
    if (isset($data['_draft'])) unset($data['_draft']);
    if (isset($data['selected'])) unset($data['selected']);
    $data['pageId'] = intval($data['pageId']);
    $css = $dataStore->storeCSS($data);
    return response($response, $css);
});

$app->put('/css/{pageId}', function (Request $request, Response $response, $args) {
    $dataStore = new DataStore();
    $data = json_decode($request->getBody()->getContents(), true);
    // Remove irrelevant data from data
    if (isset($data['id'])) unset($data['id']);
    if (isset($data['_draft'])) unset($data['_draft']);
    if (isset($data['selected'])) unset($data['selected']);
    $controller = $dataStore->updateCSS($args['pageId'], $data);
    return response($response, $controller);
});

$app->delete('/css/{id}', function (Request $request, Response $response, $args) {
    $dataStore = new DataStore();
    $dataStore->deleteController($args['id']);
    return response($response, "Deleted");
});

// Define endpoint for controllers object
$app->get('/controllers', function (Request $request, Response $response, $args) use ($data) {
    $params = $request->getQueryParams();
    $active = isset($params['active']) ? filter_var($params['active'], FILTER_VALIDATE_BOOLEAN) : null;
    $pageId = isset($params['pageId']) ? intval($params['pageId']) : null;
    $floorId = isset($params['floorId']) ? intval($params['floorId']) : null;
    $type = isset($params['type']) ? strval($params['type']) : null;
    $css = isset($params['css']) ? strval($params['css']) : null;
    $result = [];
    foreach ($data['controllers'] as $item) {
        if (
            ($active !== null && $item['active'] !== $active)
            || ($pageId !== null && $item['pageId'] !== $pageId)
            || ($floorId !== null && $item['floorId'] !== $floorId)
            || ($type !== null && $item['type'] !== $type)
            || ($css !== null && $item['css'] !== $css)
        ) {
            continue;
        }
        $result[] = $item;
    }
    return response($response, $result);
});

$app->post('/controllers', function (Request $request, Response $response, $args) {
    $dataStore = new DataStore();
    //$data = $request->getParsedBody();
    $data = json_decode($request->getBody()->getContents(), true);
    if (isset($data['id'])) unset($data['id']);
    if (isset($data['_draft'])) unset($data['_draft']);
    if (isset($data['selected'])) unset($data['selected']);
    $data['pageId'] = intval($data['pageId']);
    $controller = $dataStore->storeController($data);
    return response($response, $controller);
});

$app->put('/controllers/{id}', function (Request $request, Response $response, $args) {
    $dataStore = new DataStore();
    $data = json_decode($request->getBody()->getContents(), true);
    // Remove irrelevant data from data
    if (isset($data['id'])) unset($data['id']);
    if (isset($data['_draft'])) unset($data['_draft']);
    if (isset($data['selected'])) unset($data['selected']);
    $data['pageId'] = intval($data['pageId']);
    $controller = $dataStore->updateController($args['id'], $data);
    return response($response, $controller);
});

$app->delete('/controllers/{id}', function (Request $request, Response $response, $args) {
    $dataStore = new DataStore();
    $dataStore->deleteController($args['id']);
    return response($response, "Deleted");
});

// For CORS issue
/*$app->options('/{routes:.+}', function ($request, $response, $args) {
    $data = ['status' => 'ok'];
    return response($response, $data);
});*/

// Endpoint for "page_items" object
$app->get('/page_items', function (Request $request, Response $response, array $args) use ($data) {
    $active = $request->getQueryParam('active');
    $pageId = $request->getQueryParam('pageId');
    $result = [];
    foreach ($data['page_items'] as $item) {
        if (($active !== null && $item['active'] !== $active) || ($pageId !== null && $item['pageId'] !== $pageId)) {
            continue;
        }
        $result[] = $item;
    }
    return response($response, $result);
});

try {
    $app->run();     
} catch (Exception $e) {    
  // We display a error message
  die( json_encode(array("status" => "failed", "message" => "This action is not allowed", "error" => [
      $e->getCode(),
      $e->getTrace(),
      $e->getLine(),
      $e->getMessage(),
      $e->getTraceAsString(),
      $e->getFile()
  ])));
}