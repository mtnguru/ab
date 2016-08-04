<?php

namespace Drupal\atomizer\Ajax;
use Drupal\Core\Ajax\CommandInterface;

class SaveYmlCommand implements CommandInterface {
  public function __construct($name, $filepath, $component, $filelist) {
    $this->filepath = $filepath;
    $this->name = $name;
    $this->component = $component;
    $this->filelist = $filelist;
  }

  public function render() {
    return array(
      'command' => 'saveYmlCommand',
      'name'      => $this->name,
      'filepath'  => $this->filepath,
      'component' => $this->component,
      'filelist'  => $this->filelist,
    );
  }
}


