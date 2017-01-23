/**
 * @file - atomizer_base.js
 *
 * File that generates nuclets  proton, helium, lithium, helium - 1, 4, 7, 11
 */

(function ($) {

  Array.prototype.contains = function ( needle ) {
    for (var i in this) {
      if (this[i] == needle) return true;
    }
    return false;
  };

  Drupal.atomizer = {};

  Drupal.atomizer.baseC = function () {

    Drupal.AjaxCommands.prototype.loadYmlCommand = function(ajax, response, status) {
      Drupal.atomizer[response.component].loadYml(response);
    };

    Drupal.AjaxCommands.prototype.saveYmlCommand = function(ajax, response, status) {
      Drupal.atomizer[response.component].saveYml(response);
    };

    var doAjax = function doAjax (url, data, successCallback, errorCallback) {
      $.ajax({
        url: url,
        type: 'POST',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        processData: false,
        success: function (response) {
          if (successCallback) successCallback(response);
        },
        error: function (response) {
          alert('atomizer_base doAjax: ' + response.responseText);
          (errorCallback) ? errorCallback(response) : successCallback(response);
        }
      });
    }

    /**
     * Align the axis of an object to another axis.
     *
     * @param object
     * @param objectAxis
     * @param finalAxis
     * @param negate
     */
    function alignObjectToAxis(object, objectAxis, finalAxis, negate) {
      // Find the rotation axis.
      var rotationAxis = new THREE.Vector3();
      rotationAxis.crossVectors( objectAxis, finalAxis ).normalize();

      // calculate the angle between the element axis vector and rotation vector
      radians = Math.acos(objectAxis.dot(finalAxis) );

      // set the quaternion
      object.quaternion.setFromAxisAngle(rotationAxis, (negate) ? -radians : radians);
    }

    /*
    var mouseX,mouseY,windowWidth,windowHeight;
    var  popupLeft,popupTop;

      $(document).mousemove(function(e){
        mouseX = e.pageX;
        mouseY = e.pageY;
        //To Get the relative position
        if( this.offsetLeft !=undefined)
          mouseX = e.pageX - this.offsetLeft;
        if( this.offsetTop != undefined)
          mouseY = e.pageY; - this.offsetTop;

        if(mouseX < 0)
          mouseX =0;
        if(mouseY < 0)
          mouseY = 0;

        windowWidth  = $(window).width()+$(window).scrollLeft();
        windowHeight = $(window).height()+$(window).scrollTop();
      });

      $('html').click(function(){
        $('div').show();
        var popupWidth  = $('div').outerWidth();
        var popupHeight =  $('div').outerHeight();

        if(mouseX+popupWidth > windowWidth)
          popupLeft = mouseX-popupWidth;
        else
          popupLeft = mouseX;

        if(mouseY+popupHeight > windowHeight)
          popupTop = mouseY-popupHeight;
        else
          popupTop = mouseY;

        if( popupLeft < $(window).scrollLeft()){
          popupLeft = $(window).scrollLeft();
        }

        if( popupTop < $(window).scrollTop()){
          popupTop = $(window).scrollTop();
        }

        if(popupLeft < 0 || popupLeft == undefined)
          popupLeft = 0;
        if(popupTop < 0 || popupTop == undefined)
          popupTop = 0;

        $('div').offset({top:popupTop,left:popupLeft});
      });
    */

    function initDraggable($elem,name,initLeft,initTop) {
      /*
      var left;
      var top;
      var ww = window.innerWidth;
      var wh = window.innerHeight;
      var dw = ($elem.outerWidth() < 40) ? 200 : $elem.outerWidth();
      var dh = ($elem.outerHeight() < 40) ? 100 : $elem.outerHeight();
      if (localStorage[name]) {
        var pt = localStorage[name].split(",");
        left = parseInt(pt[0]);
        top  = parseInt(pt[1]);
        if (left + dw > ww) {
          left = ww - dw;
        }
        if (top + dh > wh) {
          top = wh - dh;
        }
      } else {
        left = initLeft;
        top  = initTop;
        if (initLeft < 0) {
          left = ww - dw + initLeft;
        }
        if (initTop < 0) {
          top = wh - dh + initTop;
        }
      }
      $.elem.css({'left': left,
        'top':  top});
      $.elem.draggable({
        stop: function(evt,ui) {
          var left = $(this).css('left');
          var top = $(this).css('top');
          if (parseInt(top) < 0)  top  = "0px";
          if (parseInt(left) < 0) left = "0px";
          localStorage[name] = left + ',' + top;
        }
      });
      */
    }

    return {
      doAjax: doAjax,
      alignObjectToAxis: alignObjectToAxis,
      initDraggable: initDraggable,
      constants: {
        visibleThresh: .03,
        transparentThresh: .97
      }
    };

  };

})(jQuery);
