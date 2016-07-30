<?php

namespace Drupal\atom_builder\Ajax;
use Drupal\Core\Ajax\CommandInterface;

class LoadYmlCommand implements CommandInterface {
  public function __construct($filename, $component, $ymlContents) {
    $this->filename = $filename;
    $this->component = $component;
    $this->ymlContents = $ymlContents;
  }

  public function render() {
    return array(
      'command' => 'loadYmlCommand',
      'filename' => $this->filename,
      'component' => $this->component,
      'ymlContents' => $this->ymlContents,
    );
  }
}


