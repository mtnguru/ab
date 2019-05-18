// import { dialogC } from './dialog.js';

(function ($) {

  Drupal.atomizer.pteC = function (_viewer) {
    let viewer = _viewer;
    let elements;
    let camera, scene, renderer, controls;

    let $container;
    let elementPopup;
    let displayedElements = {};

    let cells = {};
    let $cells;
    let type = 'none';  // pte or sam

    const setElementColor = (elementName, className) => {
      if (elementName) {
        displayedElements[elementName] = className;
        $(`.element#${elementName}`).addClass(className);
      } else {
        displayedElements = {};
        let $elements = $('.element');
        $elements.removeClass('color-red');
        $elements.removeClass('color-orange');
        $elements.removeClass('color-yellow');
        $elements.removeClass('color-green');
        $elements.removeClass('color-blue');
        $elements.removeClass('color-purple');
      }
    };

    const setType = (_type) => {
      if (type != _type) {
        type = _type;
        if ($container) {
          create();
        }
      }
    };

    const onMouseDown = function (event) {
      let nid = $(event.target.parentNode).data('nid');
      switch (event.button) {
        case 0:     // Select element as new atom.
          if (nid) {
            viewer.atom_select.setSelectedAtom(nid);
            viewer.atom.loadObject({nid: nid});
            if (elementPopup) {
              let $popup = $(`.az-pte-dialog .element.nid-${nid} .element-popup-hidden`);
              elementPopup.innerHTML = $popup.html();
            }
          }
          break;
        case 1:     // Nothing?
          break;
        case 2:     // Display the elementPopup
          if (!elementPopup) {
            elementPopup = document.createElement('div');
            elementPopup.className = 'element-popup-dialog';
            $(elementPopup).draggable({
              drag: function(){
                $(this).addClass("inmotion");
              }
            });
            $('.az-wrapper').append($(elementPopup));
          }

          // Position the popup - if it's 'inmotion' then leave it alone.
          if (!$(elementPopup).hasClass('inmotion')) {
            elementPopup.style.top = (event.pageY - 300) + "px";
            if (event.clientX + 250 > $(viewer.context).width()) {
              elementPopup.style.left =  (event.pageX - 300) + "px";
            } else {
              elementPopup.style.left =  (event.pageX + 20) + "px";
            }
          }
          elementPopup.style.position = 'absolute';

          // Copy the contents from the isotope to the popup dialog.
          let $popup = $(event.target).siblings('.element-popup-hidden');
          elementPopup.innerHTML = $popup.html();
          $(elementPopup).show();

          // When the user clicks on an isotope name - load it.
          $(elementPopup).find('.atom-name').click(function (event) {
            event.preventDefault();
            let nid = $(event.target).data('nid');
            viewer.atom_select.setSelectedAtom(nid);
            viewer.atom.loadObject({nid: nid});
            return false;
          });

          $(elementPopup).find('.close-button').click((event) => {
            $(elementPopup).hide();
          });
          break;
      }
    };

    const createElementsTable  = () => {
      for (let e in elements) {
        let element = elements[e];
        if (element.pte_column == 0) continue;

        let html = `
          <div class="symbol" title="${element.name} - ${element.atomic_number}">${element.symbol}</div>
          <div class="element-popup-hidden">
            <i class="close-button fas fa-times"></i>
            <h5 class="element-name">${element.symbol} - ${element.name}</h5> 
            <div class="element-atomic-number">Atomic Number: ${element.atomic_number}</div> 
            <div class="element-valence">Valence: ${element.valence}</div> 
        `;

        if (element.num_isotopes) {
          html += `
            <div class="isotopes">
              <table class="isotopes-list">
          `;
          for (let isotope of element.isotopes) {
            let abundance = (isotope.field_abundance_value) ? isotope.field_abundance_value + '%' : '';
            html += `
              <tr class="isotope">
                <td><a 
                  href="#" 
                  class="atom-name stability-${isotope.name.toLowerCase()}" 
                  data-nid="${isotope.nid}" 
                  data-stability="${isotope.name.toLowerCase()}"
                >
                  ${isotope.title}
                </a></td>
                
                <td><a 
                  href="#" 
                  class="atom-abundance" 
                  data-nid="${isotope.nid}" 
                  data-stability="${isotope.name.toLowerCase()}"
                >
                  ${abundance}
                </a></td>
              </tr>
            `;
          }
          html += `
              </table>
            </div>`;
        }

        html += '</div>';

        var wrapper = document.createElement( 'div' );
        wrapper.className = `element nid-${element.default_atom_nid}`;
        wrapper.id = element.name.toLowerCase();
        if (element.default_atom_nid) {
          wrapper.setAttribute('data-nid', element.default_atom_nid);
        }
        wrapper.innerHTML = html;

        // Create a 3D Object for this element.  Provides for positioning, rotation.
        var cell = new THREE.CSS3DObject( wrapper );

        // Assign position in periodic table for this element
        let x, y;
        if (type == 'pte') {
          x =   (element.pte_column * 142) - 1350;
          y = - (element.pte_row    * 142) + 790;
        } else {
          x =   (element.sam_column * 142) - 1350;
          y = - (element.sam_row    * 142) + 790;
        }
        cell.position.x = x;
        cell.position.y = y;
        cell.position.z = 0;

        scene.add( cell );
        element.cell = cell;
        cells[element.name.toLowerCase()] = cell;
      }
    };


    const create = ($_container, _elements) => {
      if ($_container) $container = $_container;
      if (_elements) elements = _elements;

      camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 10000 );
      camera.position.z = 2380;

      scene = new THREE.Scene();

      renderer = new THREE.CSS3DRenderer();

      let {width, height} = findWindowSize();
      renderer.setSize( width, height);
      $container.html(renderer.domElement);


      $container[0].addEventListener( 'resize', onResize, false );

      // Mouse enters the PTE table - change controls to the PTE
      $container[0].addEventListener('mouseenter', (event) => {
        viewer.controls.changeControlsMode('none');

        controls = new THREE.TrackballControls( camera, renderer.domElement );
        controls.noRotate = true;
        controls.minDistance = 500;
        controls.maxDistance = 6000;
        controls.addEventListener( 'change', render );
      });

      // Mouse leaves the PTE - change controls back to the scene.
      $container[0].addEventListener('mouseleave', (event) => {
        controls.dispose();
        delete controls;
        viewer.controls.changeControlsMode('scene');
      });

      createElementsTable();
      render();

      // Set mousedown event listener on all cells in table.
      $cells = $('#periodic-table-of-elements-dialog-container .element');
      $cells.mousedown(onMouseDown);

      // Set colors on any cells preinitialized with a color.
      for (let elementName in displayedElements) {
        setElementColor(elementName, displayedElements[elementName]);
      }
    };

    function findWindowSize() {
      let width, height;
      let aspect = 2.10;
      $container.css({
        'width': 'auto',
        'height': 'auto',
      });
      width = $container.width();
      height = width / aspect + 36;
      return {width, height};
    }

    function onResize() {
      let {width, height} = findWindowSize();
      console.log(`onResize: ${width} ${height}`);
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      render();
    }

    function render() {
      renderer.render( scene, camera );
    }

    return {
      create,
      setElementColor,
      setType,
      onResize,
    }
  }
})(jQuery);


