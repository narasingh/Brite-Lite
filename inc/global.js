(function() { "use strict";
	// REMOVE BLANK CHARS FROM BEGINNING AND END OF STRING
	String.prototype.trim = function () {
		return this.replace(/^\s*(\S*(\s+\S+)*)\s*$/, "$1");
	};


	var liteBrite = function() {
		var PARENT = document.getElementById('content'),
			PARENTWIDTH = PARENT.clientWidth,
			PARENTHEIGHT = PARENT.clientHeight,
			NODEWIDTH = 61, // update this after a node element is added
			NODEHEIGHT = 61, // update this after a node element is added
			ROWS = [],
			COLOR = document.body.className,
			MOUSEDOWN = 0,
			ARTWORK = []; // an array tracking what you drew

		this.init = function() {
			var row_count = PARENTHEIGHT / NODEHEIGHT >>> 0,
				self = this;

			// initiate controls
			Event.add(document.body, 'mousedown', function() { MOUSEDOWN = true } );
			Event.add(document.body, 'mouseup', function() { MOUSEDOWN = false } );

			var colors = document.getElementById('colors').getElementsByTagName('li');
			for( var i = 0, length=colors.length; i < length; i++) {
				Event.add(colors[i], 'click', self.colorSelect( colors, colors[i]) );
			}

			// generate rows
			for(var i = 0; i < row_count; i++) {
				var row = document.createElement('div')
				row.setAttribute('id', 'r'+i);
				row.setAttribute('class', 'row');
				ROWS.push(row);
				PARENT.appendChild(row);
			}
			this.draw();
		}

		this.colorSelect = function( list, el ) {
			var self = this;
			return function() {
				self.clearList(list, 'selected');
				el.className = 'selected';
				COLOR = document.body.className = el.id;
			}
		}

		// DRAW OR ERASE COLOR NODE, STORE IN ARTWORK ARRAY
		this.togglePeg = function ( el, click ) {
			var root = 80, // top left note
				col = 0, // add half step to the right
				row = 0, // drop a 5th every row
				note = 0;
			return function() {
				if(MOUSEDOWN > 0 || click === true) { // initiate click
					col = parseInt( el.id.substr(1), 10 ); // fret = column number
					row = parseInt( el.parentNode.id.substr(1), 10 ); // row = row number (5th)
					note = (root-(row*5))+col;
					if(el.className === COLOR) {  // delete pin
						el.className = '';
						ARTWORK[row][col] = null;
						MIDI.noteOff(0, note, 0); // stop playing (if sustained)
					} else { // add/modify pin
						el.className = COLOR; // eventually send artwork to draw() for rendering
						if( typeof(ARTWORK[row]) === 'undefined' ) {
							ARTWORK[row] = [];
						}
						ARTWORK[row][col] = COLOR; // STORE POSITION & COLOR
						MIDI.noteOn(0, note, 127, 0); // plays note (channel, note, velocity, delay)
					}
					console.log(ARTWORK);
				}
			}
		}

		this.clearList = function ( list, className ) {
			for(var i = 0, length = list.length; i < length; i++) {
				list[i].className = list[i].className.replace(className, '').trim();
			}
		}

		this.draw = function( shape ) { // SHAPE = INPUT GRID ARRAY TO DRAW
			var col_count = PARENTWIDTH / NODEWIDTH  >>> 0,
				self = this;
			// fill rows with nodes
			for(var i = 0, limit = ROWS.length; i < limit; i++) {
				var column = 0;
				// add columns to rows
				for(var column = 0; column < col_count; column++) {
					var node = document.createElement('div');
					node.setAttribute('id', 'c'+column)
					Event.add(node, 'mousedown', self.togglePeg( node, true ) );
					Event.add(node, 'mouseover', self.togglePeg( node ) );
					ROWS[i].appendChild(node);
				}
			}
			PARENT.style.width = col_count * NODEWIDTH + 'px';
		}
	}


//	MIDI.loadPlugin(callback, soundfont);
	// simple example to get started;
	MIDI.loadPlugin(function() {
		var grid = new liteBrite;
		grid.init();

	}, "piano", "./inc/MIDI.js/"); // specifying a path doesn't work



})();
