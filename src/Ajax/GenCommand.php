<?php

namespace Drupal\atomizer\Ajax;
use Drupal\Core\Ajax\CommandInterface;

class GenCommand implements CommandInterface {
  public function __construct($data) {
    $this->data = $data;
  }

  public function render() {
    return array(
      'command' => 'GenCommand',
      'data' => $this->data,
    );
  }
}


