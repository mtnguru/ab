<?php

namespace Drupal\atomizer\Ajax;
use Drupal\Core\Ajax\CommandInterface;

class SaveYmlCommand implements CommandInterface {
  public function __construct($name, $directory, $filename, $component, $filelist) {
    $this->filename = $filename;
    $this->directory = $directory;
    $this->name = $name;
    $this->component = $component;
    $this->filelist = $filelist;
  }

  public function render() {
    return array(
      'command' => 'saveYmlCommand',
      'name' => $this->name,
      'filename' => $this->filename,
      'component' => $this->component,
      'filelist' => $this->filelist,
    );
  }
}


