// import { dialogC } from './dialog.js';
// zowie

(function ($) {

  Drupal.atomizer.pteC = function (_viewer) {
    let viewer = _viewer;
    let elements;
    let camera, scene, renderer;

    let $container;
    let elementPopup;
    let displayedElements = {};

    let cells = {};
    let $cells;
    let layout = 'pte';  // pte or sam

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

    /**
     * Change the layout of the table - Conventional or SAM.
     *
     * @param _layout
     */
    const setLayout = (_layout) => {
      if (layout != _layout) {
        layout = _layout;
        if ($container) {
          create();
        }
      }
    };

    /**
     * Set click event handler on isotopes in the element popup dialog.
     */
    function setElementPopupEventHandlers() {

      // When the user clicks on an isotope name - load it.
      $(elementPopup).find('.atom-name').click(function (event) {
        event.preventDefault();
        let nid = $(event.target).data('nid');
        viewer.atom_select.setSelectedAtom({nid: nid});
        viewer.atom.loadObject({nid: nid});
        return false;
      });

      // User clicks on close (X) in the element popup
      $(elementPopup).find('.close-button').click((event) => {
        $(elementPopup).hide();
      });
    }

    /**
     * User has clicked on a cell in the periodic table.
     *
     * @param event
     */
    const onMouseDown = function (event) {
      let $element = $(event.target).hasClass('element') ? $(event.target) : $(event.target).parents('.element');
      let nid = $element.data('nid');
      console.log(`onMouseDown - ${$element[0].className}`);
      switch (event.button) {
        case 0:     // Display the elementPopup
          if (nid) {
            if (viewer.atom_select) {
              viewer.atom_select.setSelectedAtom({nid: nid});
            }
            if (viewer.atom) {
              viewer.atom.loadObject({nid: nid});
            }
            if (elementPopup) {
              let $popup = $(`.pte-container .element.nid-${nid} .popup`);
              elementPopup.innerHTML = $popup.html();
            }
            setElementPopupEventHandlers();
          }
          break;
        case 1:     // Nothing?
          break;
        case 2:     // Select element as new atom.
          // If it doesn't exist then create it.
          if (event.shiftKey) {   // highlight the cell
            if ($element.hasClass('dark-red')) {
              $element.removeClass('dark-red').addClass('dark-blue');
            } else if ($element.hasClass('dark-blue')) {
              $element.removeClass('dark-blue').addClass('dark-purple');
            } else if ($element.hasClass('dark-purple')) {
              $element.removeClass('dark-purple').addClass('dark-green');
            } else if ($element.hasClass('dark-green')) {
              $element.removeClass('dark-green').addClass('dark-grey');
            } else if ($element.hasClass('dark-grey')) {
              $element.removeClass('dark-grey');
            } else {
              $element.addClass('dark-red')
            }
          } else {                // popup an information dialog
            if (!elementPopup) {
              elementPopup = document.createElement('div');
              elementPopup.className = 'element-popup-dialog';
              $(elementPopup).draggable({
                drag: function () {
                  $(this).addClass('inmotion');
                }
              });
              $('.az-wrapper').append($(elementPopup));
            }

            // Position the popup - if it's 'inmotion' then leave it alone.
            if (!$(elementPopup).hasClass('inmotion')) {
              elementPopup.style.top = (event.pageY - 300) + "px";
              if (event.clientX + 250 > $(viewer.context).width()) {
                elementPopup.style.left = (event.pageX - 300) + "px";
              } else {
                elementPopup.style.left = (event.pageX + 20) + "px";
              }
            }
            elementPopup.style.position = 'absolute';

            // Copy the contents from the isotope to the popup dialog.
            let $popup = $element.find('.popup');
            $(elementPopup).empty();
            elementPopup.innerHTML = $popup.html();
            $(elementPopup).show();

            setElementPopupEventHandlers();
          }
          break;
      }
    };

    const createElementsTable  = () => {
      for (let e in elements) {
        let element = elements[e];
        if (element.pte_column == 0) continue;

        let items = element.valence.split(/, */g);
        let valence = '';
        let valence_primary = '';
        for (let item of items.reverse()) {
//        if (valence) valence += ' ';
          if (item.indexOf('*') > -1) {
            valence         += `<span class="primary">${item.replace('*','')}</span>`;
            valence_primary += `<span class="primary">${item.replace('*','')}</span>`;
          } else {
            valence += `<span class="secondary">${item}</span>`;
          }
        }

        let html = `
          <div class="symbol-large az-hidden" title="${element.name} - ${element.atomic_number}">${element.symbol}</div>
          <div class="symbol az-hidden">${element.symbol}</div>
          <div class="atomic-number az-hidden">${element.atomic_number}</div>
          <div class="valence-primary-xlg az-hidden">${valence_primary}</div>
          <div class="valence-primary-lg az-hidden">${valence_primary}</div>
          <div class="footer">
            <div class="valence-primary az-hidden">${valence_primary}</div>
            <div class="valence az-hidden">${valence}</div>
            <div class="name az-hidden">${element.name}</div>
          </div>
         `;
        if (element.image_url) {
          html += `
            <div class="image-primary az-hidden">
              <img src="${element.image_url}">
            </div>
          `;
        }
        html +=` 
          <div class="popup az-hidden">
            <i class="close-button fas fa-times"></i>
            <h5 class="popup-name">${element.symbol} - ${element.name}</h5> 
            <div class="popup-atomic-number">Atomic Number: ${element.atomic_number}</div> 
            <div class="popup-valence">Ox #: ${valence}</div> 
        `;

        if (element.num_isotopes) {
          html += `
            <div class="isotopes">
              <table class="isotopes-list">
          `;
          for (let isotope of element.isotopes) {
            let abundance = (isotope.field_abundance_value) ? isotope.field_abundance_value + '%' : '';
            let approvalClass = (isotope.field_approval_value == 'stats') ? 'disabled' : 'enabled';
            html += `
              <tr class="isotope ${approvalClass}">
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

        if (element.num_isotopes == 0) {
          $(wrapper).addClass('no-isotopes')
        }

        wrapper.innerHTML = html;

        // Create a 3D Object for this element.  Provides for positioning, rotation.
        var cell = new THREE.CSS3DObject( wrapper );

        // Assign position in periodic table for this element
        let x, y;
        if (layout == 'pte') {
          let row = element.pte_row > 8 ? element.pte_row - .5 : element.pte_row;
          let col = element.pte_row > 8 ? element.pte_column - 1 : element.pte_column;
          x =   (col * 142) - 1350;
          y = - (row * 142) + 750;
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
        if (viewer.producer.setCellContent) {
          viewer.producer.setCellContent();
        }
      }
    };

    const create = ($_container, _elements) => {
      if ($_container) $container = $_container;
      if (_elements) elements = _elements;

//    camera = new THREE.OrthographicCamera(window.innerWidth / window.innerHeight, 1, 10000);
      camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 10000);
      camera.position.z = 2230;

      scene = new THREE.Scene();
      renderer = new THREE.CSS3DRenderer();
      renderer.name = 'CSS3D';

      let {width, height} = findWindowSize();
      height = width / 1.86;
      renderer.setSize( width, height);

      $container.html(renderer.domElement);
//    $container[0].appendChild( renderer.domElement );

      window.addEventListener('resize', onResize, false);

      // Mouse enters the PTE table - change controls to the PTE
      $container[0].addEventListener('mouseenter', (event) => {
        viewer.controls.changeControlsMode('az_pte::create mouseenter', 'css3d', scene, camera, renderer);
      });

      // Mouse leaves the PTE - change controls back to the scene.
      $container[0].addEventListener('mouseleave', (event) => {
        viewer.controls.changeControlsMode('az_pte::create mouseleave', 'scene');
      });
      viewer.controls.changeControlsMode('az_pte::initial', 'css3d', scene, camera, renderer);

      createElementsTable();
      onResize();

      // Set mousedown event listener on all cells in table.
      $cells = $('.pte-container .element');
      $cells.mousedown(onMouseDown);

      // Set colors on any cells preinitialized with a color.
      for (let elementName in displayedElements) {
        setElementColor(elementName, displayedElements[elementName]);
      }
    };

    function findWindowSize() {
      let width, height;
      $container.css({
        'width': 'auto',
        'height': 'auto',
      });
      width = $container.width();
      height = width / 1.86;
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
      setLayout,
      onResize,
    }
  }
})(jQuery);


