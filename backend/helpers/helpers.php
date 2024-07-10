<?php

use Psr\Http\Message\ResponseInterface as Response;

function response(Response $response, $result) {

    $response->getBody()->write(json_encode($result));
    return $response
            ->withHeader('Content-Type', 'application/json')
            ->withHeader("Access-Control-Allow-Origin", "*")
            ->withHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
            ->withHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
}
