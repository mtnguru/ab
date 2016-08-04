<?php

namespace Drupal\atomizer\Ajax;
use Drupal\Core\Ajax\CommandInterface;

class LoadYmlCommand implements CommandInterface {
  public function __construct($filepath, $component, $ymlContents) {
    $this->filepath = $filepath;
    $this->component = $component;
    $this->ymlContents = $ymlContents;
  }

  public function render() {
    return array(
      'command' => 'loadYmlCommand',
      'filepath' => $this->filepath,
      'component' => $this->component,
      'ymlContents' => $this->ymlContents,
    );
  }
}


