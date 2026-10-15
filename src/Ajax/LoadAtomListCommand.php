<?php

namespace Drupal\atomizer\Ajax;
use Drupal\Core\Ajax\CommandInterface;

class LoadAtomListCommand implements CommandInterface {
  protected $data;
  public function __construct($data) {
    $this->data = $data;
  }

  public function render() {
    return array(
      'command' => 'loadAtomListCommand',
      'data' => $this->data,
    );
  }
}


