/**
 * @file - az_atom_list.js
 *
 * Manage atom's - load, save, create
 */

(function ($) {

  Drupal.atomizer.atom_listC = function (_viewer) {

    let viewer = _viewer;

    let elements = {};
    let atomListSequence = [];   // List of atoms so we can step through them
    let includeIsotopes = false;

    const getAtomList = ($access = 'permissions') => {
      return new Promise(function(resolve, reject) {
        Drupal.atomizer.base.promiseAjax('/ajax/loadAtomList',{access: $access}).then(function(response) {
          resolve(response[0].data.list);
        }, function(error) {
          reject(`getAtomList: ERROR - ${error}`);
        })
      });
    };

    /**
     * Interface to this atom_selectC.
     */
    return {
      getAtomList,
/*    setIncludeIsotopes: (include) => {
        includeIsotopes = include;
        buildList();
      }
*/
    };
  };

})(jQuery);
