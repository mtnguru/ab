<?php

namespace Drupal\atomizer\Ajax;
use Drupal\Core\Ajax\CommandInterface;

class LoadYmlCommand implements CommandInterface {
  public function __construct($directory, $filename, $component, $ymlContents) {
    $this->directory = $directory;
    $this->filename = $filename;
    $this->component = $component;
    $this->ymlContents = $ymlContents;
  }

  public function render() {
    return array(
      'command' => 'loadYmlCommand',
      'directory' => $this->directory,
      'filename' => $this->filename,
      'component' => $this->component,
      'ymlContents' => $this->ymlContents,
    );
  }
}


