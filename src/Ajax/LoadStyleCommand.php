<?php

namespace Drupal\atom_builder\Ajax;
use Drupal\Core\Ajax\CommandInterface;

class LoadStyleCommand implements CommandInterface {
  public function __construct($styleFile) {
    $this->styleFile = $styleFile;
  }

  public function render() {
    return array(
      'command' => 'loadStyle',
      'styleFile' => $this->styleFile,
    );
  }
}


