<?php

namespace Drupal\atomizer\Ajax;
use Drupal\Core\Ajax\CommandInterface;

class LoadMoleculeCommand implements CommandInterface {
  protected $data;
  public function __construct($data) {
    $this->data = $data;
  }

  public function render() {
    return array(
      'command' => 'loadMoleculeCommand',
      'data' => $this->data,
    );
  }
}


