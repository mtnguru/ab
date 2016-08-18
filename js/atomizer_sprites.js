/**
 * @file atomizer_sprites.js
 */

Drupal.atomizer.spritesC = function (_viewer, controlSet) {
	var viewer = _viewer;

	function computeCentroids(faces, vertices) {
		var f, fl, face;
		for ( f = 0, fl = faces.length; f < fl; f ++ ) {
			face = faces[ f ];
			face.centroid = new THREE.Vector3();
			face.centroid.set( 0, 0, 0 );

			face.centroid.add( vertices[ face.a ] );
			face.centroid.add( vertices[ face.b ] );
			face.centroid.add( vertices[ face.c ] );
			face.centroid.divideScalar( 3 );
		}
	}

// function for drawing rounded rectangles
	function roundRect(ctx, x, y, w, h, r)
	{
		ctx.beginPath();
		ctx.moveTo(x+r, y);
		ctx.lineTo(x+w-r, y);
		ctx.quadraticCurveTo(x+w, y, x+w, y+r);
		ctx.lineTo(x+w, y+h-r);
		ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
		ctx.lineTo(x+r, y+h);
		ctx.quadraticCurveTo(x, y+h, x, y+h-r);
		ctx.lineTo(x, y+r);
		ctx.quadraticCurveTo(x, y, x+r, y);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	}

	function makeTextSprite( message, parameters ) {

		if ( parameters === undefined ) parameters = {};
		var fontface = parameters.hasOwnProperty("fontface") ?  parameters["fontface"] : "Arial";
		var fontsize = parameters.hasOwnProperty("fontsize") ?  parameters["fontsize"] : 16;
		var borderThickness = parameters.hasOwnProperty("borderThickness") ?  parameters["borderThickness"] : 0;
		var borderColor = parameters.hasOwnProperty("borderColor") ?  parameters["borderColor"] : '#990099';
		var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?  parameters["backgroundColor"] : '#009999';
		var color = parameters.hasOwnProperty("color") ?  parameters["color"] : '#ffffff';

		var canvas = document.createElement('canvas');
		var context = canvas.getContext('2d');
		context.font = "Bold " + fontsize + "px " + fontface;

		// get size data (height depends only on font size)
		var metrics = context.measureText( message );
		var textWidth = metrics.width;
		var textHeight = 86;

		// background
		context.fillStyle   = backgroundColor;
		// border
		context.strokeStyle = borderColor;
		context.lineWidth = borderThickness;
		roundRect(context, 0, 0, textWidth, fontsize * 1.35 + borderThickness, 8);
		// text color
		context.fillStyle = color;
		context.fillText( message, borderThickness, fontsize);

		var imgData = context.getImageData(0, 0, textWidth, textHeight);
		canvas.width = textWidth;
		canvas.height = textHeight;
		context.putImageData(imgData, 0, 0);

		// canvas contents will be used for a texture
		var texture = new THREE.Texture(canvas)
		texture.needsUpdate = true;

		var spriteMaterial = new THREE.SpriteMaterial({map: texture});
		var sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(20, 20, 1);
		return sprite;
	}

	var createVerticeIds = function createVerticeIds (name, geometry) {
		geometry.mergeVertices();
		var verticeIds = new THREE.Group();
		verticeIds.name = name;

		var parameters = {
			fontsize: 60,
			backgroundColor: '#333333',
			color: viewer.style.get(name + '__color')
		};

		for (var i = 0; i < geometry.vertices.length; i++)
		{
			var spritey = makeTextSprite( " " + i + " ", parameters);
			var scale = 2.0;
			spritey.position.x = scale * geometry.vertices[i].x;
			spritey.position.y = scale * geometry.vertices[i].y;
			spritey.position.z = scale * geometry.vertices[i].z;
			verticeIds.add( spritey );
		}
		var scale = 1;
		verticeIds.scale.set(scale, scale, scale);

		return verticeIds;
	}

	var createFaceIds = function createFaceIds (name, geometry) {
		var faceIds = new THREE.Group();
		computeCentroids(geometry.faces, geometry.vertices);
		faceIds.name = name;

		var parameters = {
			fontsize: 60,
			backgroundColor: viewer.style.get(name + '__color'),
			color: '#333333'
		};

		for (var i = 0; i < geometry.faces.length; i++)
		{
			var spritey = makeTextSprite( " " + i + " ", parameters);

			var scale = 2.0;
			spritey.position.x = scale * geometry.faces[i].centroid.x;
			spritey.position.y = scale * geometry.faces[i].centroid.y;
			spritey.position.z = scale * geometry.faces[i].centroid.z;
			faceIds.add( spritey );
		}
		var scale = 1;
		faceIds.scale.set(scale, scale, scale);

		return faceIds;
	}

  return {
    createVerticeIds: createVerticeIds,
	  createFaceIds:    createFaceIds
  }
};


