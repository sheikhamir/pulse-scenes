<?php

class DataStore {
    private $data;
    private $lastId;
    private $filePath;

    public function __construct($filePath = "../db.json") {
        $this->filePath = $filePath;
        $this->loadData();
    }

    private function loadData() {
        $jsonData = file_get_contents($this->filePath);
        $this->data = json_decode($jsonData, true) ?: [];
        /*
        $this->lastId = isset($this->data["controllers"]) && isset( end($this->data["controllers"])['id'] )
            ? end($this->data["controllers"])['id']
            : 0;
         */
        $this->lastId = isset($this->data["lastId"]) ? $this->data["lastId"] : 0;
    }

    public function whatWasLast() {
        return $this->lastId;
    }

    public function storeController($data) {
        $this->lastId++;
        $data["id"] = $this->lastId;
        $this->data["controllers"][] = $data;
        $this->saveData();
        return $data;
    }

    public function updateController($id, $data) {
        foreach ($this->data["controllers"] as &$controller) {
            if ($controller["id"] == $id) {
                $controller = array_merge($controller, $data); // Update existing data
                $this->saveData();
                return $controller;  // Update successful, exit the loop
            }
        }
        throw new ValueError("Controller with ID $id not found");
    }

    public function storeCSS($data) {
        $this->lastId++;
        $this->data["css"][] = $data;
        $this->saveData();
        return $data;
    }

    public function updateCSS($pageId, $data) {
        foreach ($this->data["css"] as &$css) {
            if ($css["pageId"] == $pageId) {
                $css = array_merge($css, $data); // Update existing data
                $this->saveData();
                return $css;  // Update successful, exit the loop
            }
        }
        throw new ValueError("CSS for Page Id $pageId not found");
    }

    private function saveData() {
        $this->data["lastId"] = $this->lastId;
        $encodedData = json_encode($this->data, JSON_PRETTY_PRINT);
        $saved = file_put_contents($this->filePath, $encodedData);
        return $saved;
    }

    public function deleteController($id) {
        $controllers = &$this->data["controllers"]; // Get reference for modification
        $index = null;
        foreach ($controllers as $key => $controller) {
            if ($controller["id"] == $id) {
                $index = $key;
                break;
            }
        }

        if ($index !== null) {
            unset($controllers[$index]);
            $controllers = array_values($controllers); // Re-index array keys
            $this->saveData();
        } else {
            throw new ValueError("Controller with ID $id not found");
        }
    }
}