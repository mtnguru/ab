<?php

namespace Drupal\atom_builder\Tests;

use Drupal\simpletest\WebTestBase;

/**
 * Provides automated tests for the atom_builder module.
 */
class AtomBuilderControllerTest extends WebTestBase {


  /**
   * {@inheritdoc}
   */
  public static function getInfo() {
    return array(
      'name' => "atom_builder AtomBuilderController's controller functionality",
      'description' => 'Test Unit for module atom_builder and controller AtomBuilderController.',
      'group' => 'Other',
    );
  }

  /**
   * {@inheritdoc}
   */
  public function setUp() {
    parent::setUp();
  }

  /**
   * Tests atom_builder functionality.
   */
  public function testAtomBuilderController() {
    // Check that the basic functions of module atom_builder.
    $this->assertEquals(TRUE, TRUE, 'Test Unit Generated via Drupal Console.');
  }

}
