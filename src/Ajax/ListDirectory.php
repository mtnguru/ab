<?php

namespace Drupal\atomizer\Ajax;
use Drupal\Core\Ajax\CommandInterface;

class ListDirectoryCommand implements CommandInterface {
  public function __construct($directory, $component) {
    $this->directory = $directory;
    $this->component = $component;
  }

  public function render() {
    return array(
      'command' => 'listDirectoryCommand',
      'directory' => $this->directory,
      'component' => $this->component,
    );
  }
}


