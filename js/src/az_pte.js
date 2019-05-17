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
          viewer.atom_select.setSelectedAtom(nid);
          viewer.atom.loadObject({nid: nid});
          if (elementPopup) {
            let $popup = $(`.az-pte-dialog .element.nid-${nid} .element-popup`);
            elementPopup.innerHTML = $popup.html();
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

            // If the user clicks anywhere else, hide the popup.
            $(document).on('mousedown', function(event) {
              event.preventDefault();

              let $pte = $(event.target).parents('.az-pte-dialog');
              let $eDialog = $(event.target).parents('.element-popup-dialog');
              if ($pte.length || $eDialog.length) {
                console.log(`Click is within the pte`);
              } else {
                $(elementPopup).hide();
              }
            })
          }


          let $popup = $(event.target).siblings('.element-popup');

          console.log(`clientX: ${event.clientX}  offsetX: ${event.offsetX}  pageX: ${event.pageX}`);
          console.log(`clientY: ${event.clientY}  offsetY: ${event.offsetY}  pageY: ${event.pageY}`);
          elementPopup.style.top = (event.pageY - 300) + "px";
          elementPopup.style.left =  event.pageX + "px";
          elementPopup.style.position = 'absolute';
          elementPopup.innerHTML = $popup.html();
          $(elementPopup).show();
          $(elementPopup).find('.atom-name').click(function (event) {
            event.preventDefault();
            let nid = $(event.target).data('nid');
            viewer.atom_select.setSelectedAtom(nid);
            viewer.atom.loadObject({nid: nid});
            return false;
          });
          break;
      }
    };

    const createTable  = (type) => {

    };


    const create = ($_container, _elements) => {
      if ($_container) $container = $_container;
      if (_elements) elements = _elements;

      camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 10000 );
      camera.position.z = 2380;

      scene = new THREE.Scene();

      for (let e in elements) {
        let element = elements[e];
        if (element.pte_column == 0) continue;

        let html = `
          <div class="symbol" title="${element.name} - ${element.atomic_number}">${element.symbol}</div>
          <div class="element-popup">
            <h5 class="element-name">${element.symbol} - ${element.name}</h5> 
            <div class="element-atomic-number">Atomic Number: ${element.atomic_number}</div> 
            <div class="element-valence">Valence: ${element.valence}</div> 
        `;

        if (element.num_isotopes) {
          html += `
            <div class="isotopes">
              <div class="isotopes-title">Isotopes</div>
                <ul class="isotopes-list">
          `;
          for (let isotope of element.isotopes) {
            html += `
                  <li class="isotope">
                    <a href="#" class="atom-name" data-nid="${isotope.nid}" data-stability="${isotope.name.toLowerCase()}">${isotope.title}</a>
                  </li>
          `;
          }
          html += `
                </ul>
              </div>
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

      renderer = new THREE.CSS3DRenderer();

      let {width, height} = findWindowSize();
      renderer.setSize( width, height);
      $container.html(renderer.domElement);

      controls = new THREE.TrackballControls( camera, renderer.domElement );
      controls.noRotate = true;
      controls.minDistance = 500;
      controls.maxDistance = 6000;
      controls.addEventListener( 'change', render );

      $container[0].addEventListener( 'resize', onResize, false );

      render();

      $cells = $('#periodic-table-of-elements-dialog-container .element');
      $cells.mousedown(onMouseDown);

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


