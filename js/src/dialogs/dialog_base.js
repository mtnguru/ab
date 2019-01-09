// @file - Base dialog 'class'

(function ($) { // Wrap in jQuery

  Drupal.atomizer.dialogs = {};
  Drupal.atomizer.dialogs.getDialog = function (viewer, name) {
    if (!Drupal.atomizer.dialogs[name]) {
      Drupal.atomizer.dialogs[name] = Drupal.atomizer.dialogs[name + 'C'](viewer);
    }
    return Drupal.atomizer.dialogs[name];
  };

  Drupal.atomizer.dialogs.baseC = {
    name: function (newName) {
      if (newName) {
        this._name = newName;
      }
      return this._name;
    },

    create: function create (settings) {
//  var settings = response[0].data;

      let dialog = this;
      Drupal.atomizer.dialogs[settings.name] = dialog;
      this.elements = {};
      this.settings = settings;
      this.isOpen = (settings.isOpen);
      this.isLoaded = (settings.isLoaded);

      // Create the wrapper for this dialog.
      this.elements.wrapper = document.createElement('DIV');
      this.elements.wrapper.id = settings.id.toLowerCase().replace(' ', '-');
      this.elements.wrapper.classList.add(settings.class);
      document.querySelector(settings.containerSelector).appendChild(this.elements.wrapper);
      let $dialog = this.$dialog = $('.az-dialog');

      let html;

      if (settings.title) {
        html =  '<div class="title-pane">';
        html += '<div class="az-fa-close button"></div>';
        html += `<h2>${settings.title}</h2>`;
        html += '</div>';
        this.elements.wrapper.innerHTML += html;

        if (settings.closeButton) {
          $(settings.containerSelector).on('click', '.title-pane .button', function (event) {
            dialog.close();
          });
        }
      }

      if (settings.content) {
        html = `<div class="content-pane">${settings.content}</div>`;
        this.elements.wrapper.innerHTML += html;
      }

      if (settings.buttonpane) {
        html = `<div class="button-pane">\n`;
        for (let key in settings.buttonpane) {
          let value = settings.buttonpane[key];
          html += `<button class="button-${key}>" name="${key}">${settings.buttonpane[key]}</button>`;
        }
        html += `</div>`;
        this.elements.wrapper.innerHTML += html;

        $dialog.find('.button-pane button').click(function (event) {
          if (event.target.name == 'close') {
            dialog.close();
          }
          if (dialog.onButtonClick) {
            dialog.onButtonClick(event.target);
          }
        });
      }

      // Make the dialog resizable.
      if (settings.resizeable) {
        $dialog.resizable({
          resize: function (event, ui) {
//        if (this.onResize) {
//          this.onResize(event, ui);
//        }
          }
        });
      }

      // Make the dialog draggable.
      if (settings['draggable']) {
        $dialog.draggable();
      }

      // Set the zIndex.
      if (settings.zIndex) {
        $dialog.css('zindex', settings.zIndex);
      }

      // Set CSS styles on the dialog
      if (settings.css) {
        $dialog.css(settings.css);
      }
      else {
//    this.$dialog.css({left: '75px', bottom: '100px'});
      }

      if (settings.selectButtonId) {
        this.elements.selectButton = document.getElementById(settings.selectButtonId);
        this.elements.selectButton.addEventListener('click', (ev) => {
          dialog.toggle();
        });
      }

      // Let inheriting class make any final changes
      if (this.onCreate)  {
        this.onCreate();
      }

      if (this.isOpen) {
        $dialog.show();
        if (this.onOpen) {
          this.onOpen();
        }
      } else {
        $dialog.hide();
      }
    },

    toggle: function toggle () {
      if (this.isLoaded) {
        if (this.isOpen) {
          this.close();
        } else {
          this.open();
        }
      }
      else {
        this.load();
      }
    },

    load: function load() {
//  Drupal.imager.core.ajaxProcess(popup,
//    Drupal.imager.settings.actions.renderDialog.url,
//    {
//      action: 'render-dialog',
//      popupName: popup.spec.name
//    },
//    this.create);
    },

    open: function open () {
      if (this.isLoaded) {
        if (!this.isOpen) {
          if (this.elements.selectButton) {
            this.elements.selectButton.classList.add('az-selected');
          }
          this.$dialog.show().addClass('az-open');
          this.isOpen = true;
          if (this.onOpen) {
            this.onOpen();
          }
        }
      } else {
        this.load();
      }
    },

    close: function close () {
      if (this.isOpen) {
        if (this.elements.selectButton) {
          this.elements.selectButton.classList.remove('az-selected');
        }
        this.$dialog.hide().removeClass('az-open');
        this.isOpen = false;
        if (this.onClose) {
          this.onClose();
        }
      }
    },

  };

})(jQuery);
