<?php

namespace Drupal\atomizer\Ajax;
use Drupal\Core\Ajax\CommandInterface;

class LoadDialogCommand implements CommandInterface {
  public function __construct($data) {
    $this->data = $data;
  }

  public function render() {
    return array(
      'command' => 'loadDialogCommand',
      'data' => $this->data,
    );
  }
}


