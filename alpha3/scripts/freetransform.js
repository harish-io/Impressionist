/*
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 *
 */

Raphael.fn.freeTransform = function(subject, options, callback) {
	// Enable method chaining
	if ( subject.freeTransform ) return subject.freeTransform;

	// Add Array.map if the browser doesn't support it
	if ( !( 'map' in Array.prototype ) ) {
		Array.prototype.map = function(callback, arg) {
			var mapped = new Array();

			for ( var i in this ) {
				if ( this.hasOwnProperty(i) ) mapped[i] = callback.call(arg, this[i], i, this);
			}

			return mapped;
		};
	}

	var paper = this;

	var bbox = subject.getBBox(true);

	var ft = subject.freeTransform = {
		// Keep track of transformations
		attrs: {
			x: bbox.x,
			y: bbox.y,
			size: { x: bbox.width, y: bbox.height },
			center: { x: bbox.x + bbox.width  / 2, y: bbox.y + bbox.height / 2 },
			rotate: 0,
			scale: { x: 1, y: 1 },
			translate: { x: 0, y: 0 }
			},
		axes: null,
		bbox: null,
		callback: null,
		items: new Array,
		handles: { center: null, x: null, y: null },
		offset: {
			rotate: 0,
			scale: { x: 1, y: 1 },
			translate: { x: 0, y: 0 }
			},
		opts: {
			animate: false,
			attrs: { fill: '#000', stroke: '#000' },
			boundary: { x: paper._left ? paper._left : 0, y: paper._top  ? paper._top  : 0, width: paper.width, height: paper.height },
			delay: 700,
			distance: 1.2,
			drag: true,
			dragRotate: false,
			dragScale: false,
			dragSnap: false,
			dragSnapDist: 0,
			easing: 'linear',
			keepRatio: false,
			rotate: true,
			rotateRange: [ -180, 180 ],
			rotateSnap: false,
			rotateSnapDist: 0,
			scale: true,
			scaleSnap: false,
			scaleRange: false,
			showBBox: false,
			showBBoxHandles: false,
			size: 5
			},
		subject: subject
		};

	/**
	 * Update handles based on the element's transformations
	 */
	ft.updateHandles = function() {
		if ( ft.opts.showBBox || ft.opts.dragRotate ) {
			var corners = getBBox();
		}

		// Get the element's rotation
		var rad = {
			x: ( ft.attrs.rotate      ) * Math.PI / 180,
			y: ( ft.attrs.rotate + 90 ) * Math.PI / 180
			};

		var radius = {
			x: ft.attrs.size.x / 2 * ft.attrs.scale.x,
			y: ft.attrs.size.y / 2 * ft.attrs.scale.y
			};

		if ( ft.opts.showBBox && ft.bbox ) {
			ft.bbox.toFront().attr({
				path: [
					[ 'M', corners[0].x, corners[0].y ],
					[ 'L', corners[1].x, corners[1].y ],
					[ 'L', corners[2].x, corners[2].y ],
					[ 'L', corners[3].x, corners[3].y ],
					[ 'L', corners[0].x, corners[0].y ]
					]
				});

			if ( ft.handles.bbox ) {
				[ 0, 1, 2, 3 ].map(function(corner) {
					ft.handles.bbox[corner].disc.toFront().attr({
						cx: corners[corner].x,
						cy: corners[corner].y
					});
				});
			}
		}

		ft.axes.map(function(axis) {
			if ( ft.handles[axis] ) {
				var
					cx = ft.attrs.center.x + ft.attrs.translate.x + radius[axis] * ft.opts.distance * Math.cos(rad[axis]),
					cy = ft.attrs.center.y + ft.attrs.translate.y + radius[axis] * ft.opts.distance * Math.sin(rad[axis])
					;

				// Keep handle within boundaries
				if ( ft.opts.boundary ) {
					cx = Math.max(Math.min(cx, ft.opts.boundary.x + ft.opts.boundary.width),  ft.opts.boundary.x),
					cy = Math.max(Math.min(cy, ft.opts.boundary.y + ft.opts.boundary.height), ft.opts.boundary.y)
				}

				ft.handles[axis].disc.attr({ cx: cx, cy: cy });

				ft.handles[axis].line.toFront().attr({
					path: [ [ 'M', ft.attrs.center.x + ft.attrs.translate.x, ft.attrs.center.y + ft.attrs.translate.y ], [ 'L', ft.handles[axis].disc.attrs.cx, ft.handles[axis].disc.attrs.cy ] ]
					});

				ft.handles[axis].disc.toFront();
			}
		});

		if ( ft.handles.center ) {
			ft.handles.center.disc.toFront().attr({
				cx: ft.attrs.center.x + ft.attrs.translate.x,
				cy: ft.attrs.center.y + ft.attrs.translate.y
				});
		}

		if ( ft.opts.dragRotate ) {
			var radius = Math.max(
				Math.sqrt(Math.pow(corners[1].x - corners[0].x, 2) + Math.pow(corners[1].y - corners[0].y, 2)),
				Math.sqrt(Math.pow(corners[2].x - corners[1].x, 2) + Math.pow(corners[2].y - corners[1].y, 2))
				) / 2

			ft.circle.attr({
				cx: ft.attrs.center.x + ft.attrs.translate.x,
				cy: ft.attrs.center.y + ft.attrs.translate.y,
				r:  radius * ft.opts.distance
				});
		}
	};

	/**
	 * Add handles
	 */
	ft.showHandles = function() {
		ft.hideHandles();

		if ( ft.opts.showBBox ) {
			ft.bbox = paper
				.path('')
				.attr({
					stroke: ft.opts.attrs.stroke,
					'stroke-dasharray': '- ',
					opacity: .5
					})
				;
		}

		if ( ft.opts.rotate || ft.opts.scale ) {
			ft.axes.map(function(axis) {
				ft.handles[axis] = new Object;

				ft.handles[axis].line = paper
					.path([ 'M', ft.attrs.center.x, ft.attrs.center.y ])
					.attr({
						stroke: ft.opts.attrs.stroke,
						'stroke-dasharray': '- ',
						opacity: .5
						})
					;

				ft.handles[axis].disc = paper
					.circle(ft.attrs.center.x, ft.attrs.center.y, ft.opts.size)
					.attr(ft.opts.attrs)
					;
			});

			if ( ft.opts.showBBox && ft.opts.showBBoxHandles ) {
				if ( ft.opts.scale ) {
					ft.handles.bbox = new Array;

					[ 0, 1, 2, 3 ].map(function(corner) {
						ft.handles.bbox[corner] = new Object;

						ft.handles.bbox[corner].disc = paper
							.circle(ft.attrs.center.x, ft.attrs.center.y, ft.opts.size)
							.attr(ft.opts.attrs)
							;
					});
				}
			}
		}

		if ( ft.opts.drag ) {
			ft.handles.center = new Object;

			ft.handles.center.disc = paper
				.circle(ft.attrs.center.x, ft.attrs.center.y, ft.opts.size)
				.attr(ft.opts.attrs)
				;
		}

		if ( ft.opts.dragRotate || ft.opts.dragScale ) {
			ft.circle = paper
				.circle(0, 0, 0)
				.attr({
					stroke: ft.opts.attrs.stroke,
					'stroke-dasharray': '- ',
					opacity: .3
					})
				;
		}

		// Drag x, y handles
		ft.axes.map(function(axis) {
			if ( !ft.handles[axis] ) return;

			ft.handles[axis].disc.drag(function(dx, dy) {
				// viewBox might be scaled
				if ( ft.o.viewBoxRatio ) {
					dx *= ft.o.viewBoxRatio.x;
					dy *= ft.o.viewBoxRatio.y;
				}

				var
					cx = dx + ft.handles[axis].disc.ox,
					cy = dy + ft.handles[axis].disc.oy
					;

				var mirrored = {
					x: ft.o.scale.x < 0,
					y: ft.o.scale.y < 0
					};

				if ( ft.opts.rotate ) {
					var rad = Math.atan2(cy - ft.o.center.y - ft.o.translate.y, cx - ft.o.center.x - ft.o.translate.x);

					ft.attrs.rotate = rad * 180 / Math.PI - ( axis == 'y' ? 90 : 0 );

					if ( mirrored[axis] ) ft.attrs.rotate -= 180;
				}

				// Keep handle within boundaries
				if ( ft.opts.boundary ) {
					cx = Math.max(Math.min(cx, ft.opts.boundary.x + ft.opts.boundary.width),  ft.opts.boundary.x);
					cy = Math.max(Math.min(cy, ft.opts.boundary.y + ft.opts.boundary.height), ft.opts.boundary.y);
				}

				var radius = Math.sqrt(Math.pow(cx - ft.o.center.x - ft.o.translate.x, 2) + Math.pow(cy - ft.o.center.y - ft.o.translate.y, 2));

				if ( ft.opts.scale ) {
					ft.attrs.scale = {
						x: axis == 'x' ? radius / ( ft.o.size.x / 2 * ft.opts.distance ) : ft.o.scale.x,
						y: axis == 'y' ? radius / ( ft.o.size.y / 2 * ft.opts.distance ) : ft.o.scale.y
						};

					if ( mirrored[axis] ) ft.attrs.scale[axis] *= -1;
				}

				applyLimits();

				if ( ft.attrs.scale.x && ft.attrs.scale.y ) ft.apply();

				asyncCallback([ ft.opts.rotate ? 'rotate' : null, ft.opts.scale ? 'scale' : null ]);
			}, function() {
				// Offset values
				ft.o = cloneObj(ft.attrs);

				if ( paper._viewBox ) {
					ft.o.viewBoxRatio = {
						x: paper._viewBox[2] / paper.width,
						y: paper._viewBox[3] / paper.height
						};
				}

				ft.handles[axis].disc.ox = this.attrs.cx;
				ft.handles[axis].disc.oy = this.attrs.cy;

				asyncCallback([ ft.opts.rotate ? 'rotate start' : null, ft.opts.scale ? 'scale start' : null ]);
			}, function() {
				asyncCallback([ ft.opts.rotate ? 'rotate end'   : null, ft.opts.scale ? 'scale end'   : null ]);
			});
		});

		// Drag bbox corner handles
		if ( ft.handles.bbox ) {
			[ 0, 1, 2, 3 ].map(function(corner) {
				ft.handles.bbox[corner].disc.drag(function(dx, dy) {
					// viewBox might be scaled
					if ( ft.o.viewBoxRatio ) {
						dx *= ft.o.viewBoxRatio.x;
						dy *= ft.o.viewBoxRatio.y;
					}

					if ( ft.opts.keepRatio ) dx = dy * ft.o.rotation.x * ft.o.rotation.y * ft.o.rotation.r;

					if ( ft.opts.drag ) {
						ft.attrs.translate = {
							x: ft.o.translate.x + dx / 2,
							y: ft.o.translate.y + dy / 2
							};
					}

					if ( ft.opts.scale ) {
						var
							rdx = dx * ft.o.rotation.cos - dy * ft.o.rotation.sin,
							rdy = dx * ft.o.rotation.sin + dy * ft.o.rotation.cos;
						ft.attrs.scale = {
							x: ft.o.scale.x + rdx * ft.o.rotation.x / ft.o.size.x,
							y: ft.o.scale.y + rdy * ft.o.rotation.y / ft.o.size.y
							};
					}

					applyLimits();

					ft.apply();

					asyncCallback([ ft.opts.drag ? 'drag' : null, ft.opts.scale ? 'scale' : null ]);
				}, function() {
					var
						elementRotation = ft.attrs.rotate / 180 * Math.PI;
						handleAngle = Math.atan2(
										this.attrs.cy - ft.attrs.center.y - ft.attrs.translate.y,
										this.attrs.cx - ft.attrs.center.x - ft.attrs.translate.x);
					// Copy original state
					ft.o = cloneObj(ft.attrs);
					// Pre-compute rotation sin & cos for efficiency
					// and record handle x/y direction
					ft.o.rotation = {
						sin: Math.sin(elementRotation),
						cos: Math.cos(elementRotation),
						x: Math.cos(handleAngle + elementRotation) < 0 ? -1 : 1,
						y: Math.sin(handleAngle + elementRotation) < 0 ? -1 : 1,
						r: Math.sin(elementRotation) * Math.cos(elementRotation) < 0 ? -1 : 1
						};
					// Account for negative scale:
					if ( ft.o.scale.x < 0 ) ft.o.rotation.x *= -1;
					if ( ft.o.scale.y < 0 ) ft.o.rotation.y *= -1;

					if ( paper._viewBox ) {
						ft.o.viewBoxRatio = {
							x: paper._viewBox[2] / paper.width,
							y: paper._viewBox[3] / paper.height
							};
					}

					asyncCallback([ ft.opts.drag ? 'drag start' : null, ft.opts.scale ? 'scale start' : null ]);
				}, function() {
					asyncCallback([ ft.opts.drag ? 'drag end' : null, ft.opts.scale ? 'scale end'   : null ]);
				});
			});
		}

		// Drag element and center handle
		if ( ft.opts.drag ) {
			var draggables = new Array;

			if ( !ft.opts.dragRotate && !ft.opts.dragScale ) draggables.push(subject);

			if ( ft.handles.center ) draggables.push(ft.handles.center.disc);

			draggables.map(function(draggable) {
				draggable.drag(function(dx, dy) {
					// viewBox might be scaled
					if ( ft.o.viewBoxRatio ) {
						dx *= ft.o.viewBoxRatio.x;
						dy *= ft.o.viewBoxRatio.y;
					}

					ft.attrs.translate.x = ft.o.translate.x + dx;
					ft.attrs.translate.y = ft.o.translate.y + dy;

					var bbox = cloneObj(ft.o.bbox);

					bbox.x += dx;
					bbox.y += dy;

					applyLimits(bbox);

					ft.apply();

					asyncCallback([ 'drag' ]);
				}, function() {
					// Offset values
					ft.o = cloneObj(ft.attrs);

					if ( ft.opts.dragSnap ) ft.o.bbox = subject.getBBox();

					// viewBox might be scaled
					if ( paper._viewBox ) {
						ft.o.viewBoxRatio = {
							x: paper._viewBox[2] / paper.width,
							y: paper._viewBox[3] / paper.height
							};
					}

					ft.axes.map(function(axis) {
						if ( ft.handles[axis] ) {
							ft.handles[axis].disc.ox = ft.handles[axis].disc.attrs.cx;
							ft.handles[axis].disc.oy = ft.handles[axis].disc.attrs.cy;
						}
					});

					asyncCallback([ 'drag start' ]);
				}, function() {
					asyncCallback([ 'drag end'   ]);
				});
			});
		}

		if ( ft.opts.dragRotate || ft.opts.dragScale ) {
			subject.drag(function(dx, dy, x, y) {
				if ( ft.opts.dragRotate ) {
					var rad = Math.atan2(y - ft.o.center.y - ft.o.translate.y, x - ft.o.center.x - ft.o.translate.x);

					ft.attrs.rotate = ft.o.rotate + ( rad * 180 / Math.PI ) - ft.o.deg;
				}

				var mirrored = {
					x: ft.o.scale.x < 0,
					y: ft.o.scale.y < 0
					};

				if ( ft.opts.dragScale ) {
					var radius = Math.sqrt(Math.pow(x - ft.o.center.x - ft.o.translate.x, 2) + Math.pow(y - ft.o.center.y - ft.o.translate.y, 2));

					ft.attrs.scale.x = ft.attrs.scale.y = ( mirrored.x ? -1 : 1 ) * ft.o.scale.x + ( radius - ft.o.radius ) / ( ft.o.size.x / 2 );

					if ( mirrored.x ) ft.attrs.scale.x *= -1;
					if ( mirrored.y ) ft.attrs.scale.y *= -1;
				}

				applyLimits();

			   	ft.apply();

				asyncCallback([ ft.opts.dragRotate ? 'rotate' : null, ft.opts.dragScale ? 'scale' : null ]);
			}, function(x, y) {
				// Offset values
				ft.o = cloneObj(ft.attrs);

				ft.o.deg = Math.atan2(y - ft.o.center.y - ft.o.translate.y, x - ft.o.center.x - ft.o.translate.x) * 180 / Math.PI;

				ft.o.radius = Math.sqrt(Math.pow(x - ft.o.center.x - ft.o.translate.x, 2) + Math.pow(y - ft.o.center.y - ft.o.translate.y, 2));

				// viewBox might be scaled
				if ( paper._viewBox ) {
					ft.o.viewBoxRatio = {
						x: paper._viewBox[2] / paper.width,
						y: paper._viewBox[3] / paper.height
						};
				}

				asyncCallback([ ft.opts.dragRotate ? 'rotate start' : null, ft.opts.dragScale ? 'scale start' : null ]);
			}, function() {
				asyncCallback([ ft.opts.dragRotate ? 'rotate end'   : null, ft.opts.dragScale ? 'scale end'   : null ]);
			});
		}

		ft.updateHandles();
	};

	/**
	 * Remove handles
	 */
	ft.hideHandles = function() {
		ft.items.map(function(item) {
			item.el.undrag();
		});

		if ( ft.handles.center ) {
			ft.handles.center.disc.remove();

			ft.handles.center = null;
		}

		[ 'x', 'y' ].map(function(axis) {
			if ( ft.handles[axis] ) {
				ft.handles[axis].disc.remove();
				ft.handles[axis].line.remove();

				ft.handles[axis] = null;
			}
		});

		if ( ft.bbox ) {
			ft.bbox.remove();

			ft.bbox = null;

			if ( ft.handles.bbox ) {
				[ 0, 1, 2, 3 ].map(function(corner) {
					ft.handles.bbox[corner].disc.remove();
				});

				ft.handles.bbox = null;
			}
		}

		if ( ft.circle ) {
			ft.circle.remove();

			ft.circle = null;
		}
	};

	// Override defaults
	ft.setOpts = function(options, callback) {
		ft.callback = typeof callback == 'function' ? callback : false;

		for ( var i in options ) ft.opts[i] = options[i];

		if ( !ft.opts.scale ) ft.opts.keepRatio = true;

		ft.axes = ft.opts.keepRatio ? [ 'y' ] : [ 'x', 'y' ];

		if ( !ft.opts  .dragSnapDist ) ft.opts  .dragSnapDist = ft.opts  .dragSnap;
		if ( !ft.opts.rotateSnapDist ) ft.opts.rotateSnapDist = ft.opts.rotateSnap;

		ft.opts.rotateRange = [
			parseInt(ft.opts.rotateRange[0]),
			parseInt(ft.opts.rotateRange[1])
			];

		ft.showHandles();

		asyncCallback([ 'init' ]);
	};

	ft.setOpts(options, callback);

	/**
	 * Apply transformations, optionally update attributes manually
	 */
	ft.apply = function() {
		ft.items.map(function(item, i) {
			// Take offset values into account
			var
				center 		= {
					x: ft.attrs.center.x + ft.offset.translate.x,
					y: ft.attrs.center.y + ft.offset.translate.y
				},
				rotate    = ft.attrs.rotate - ft.offset.rotate,
				scale     = {
					x: ft.attrs.scale.x / ft.offset.scale.x,
					y: ft.attrs.scale.y / ft.offset.scale.y
				},
				translate = {
					x: ft.attrs.translate.x - ft.offset.translate.x,
					y: ft.attrs.translate.y - ft.offset.translate.y
				};

			if ( ft.opts.animate ) {
				asyncCallback([ 'animate start' ]);

				item.el.animate(
					{ transform: [
						'R', rotate, center.x, center.y,
						'S', scale.x, scale.y, center.x, center.y,
						'T', translate.x, translate.y
						] + ft.items[i].transformString },
					ft.opts.delay,
					ft.opts.easing,
					function() {
						asyncCallback([ 'animate end' ]);

						ft.updateHandles();
					}
				);
			} else {
				item.el.transform([
						'R', rotate, center.x, center.y,
						'S', scale.x, scale.y, center.x, center.y,
						'T', translate.x, translate.y
						] + ft.items[i].transformString);

				asyncCallback([ 'apply' ]);

				ft.updateHandles();
			}
		});
	}

	/**
	 * Clean exit
	 */
	ft.unplug = function() {
		var attrs = ft.attrs;

		ft.hideHandles();

		// Goodbye
		delete subject.freeTransform;

		return attrs;
	};

	// Store attributes for each item
	( subject.type == 'set' ? subject.items : [ subject ] ).map(function(item) {
		ft.items.push({
			el: item,
			attrs: {
				rotate:    0,
				scale:     { x: 1, y: 1 },
				translate: { x: 0, y: 0 }
				},
			transformString: item.matrix.toTransformString()
			});
	});

	// Get the current transform values for each item
	ft.items.map(function(item, i) {
		if ( item.el._ && item.el._.transform ) {
			item.el._.transform.map(function(transform) {
				if ( transform[0] ) {
					switch ( transform[0].toUpperCase() ) {
						case 'T':
							ft.items[i].attrs.translate.x += transform[1];
							ft.items[i].attrs.translate.y += transform[2];

							break;
						case 'S':
							ft.items[i].attrs.scale.x *= transform[1];
							ft.items[i].attrs.scale.y *= transform[2];

							break;
						case 'R':
							ft.items[i].attrs.rotate += transform[1];

							break;
					}
				}
			});
		}
	});

	// If subject is not of type set, the first item _is_ the subject
	if ( subject.type != 'set' ) {
		ft.attrs.rotate    = ft.items[0].attrs.rotate;
		ft.attrs.scale     = ft.items[0].attrs.scale;
		ft.attrs.translate = ft.items[0].attrs.translate;

		ft.items[0].attrs = {
			rotate:    0,
			scale:     { x: 1, y: 1 },
			translate: { x: 0, y: 0 }
			};

		ft.items[0].transformString = '';
	}

	/**
	 * Get rotated bounding box
	 */
	function getBBox() {
		var rad = {
			x: ( ft.attrs.rotate      ) * Math.PI / 180,
			y: ( ft.attrs.rotate + 90 ) * Math.PI / 180
			};

		var radius = {
			x: ft.attrs.size.x / 2 * ft.attrs.scale.x,
			y: ft.attrs.size.y / 2 * ft.attrs.scale.y
			};

		var
			corners = new Array,
			signs   = [ { x: -1, y: -1 }, { x: 1, y: -1 }, { x: 1, y: 1 }, { x: -1, y: 1 } ]
			;

		signs.map(function(sign) {
			corners.push({
				x: ( ft.attrs.center.x + ft.attrs.translate.x + sign.x * radius.x * Math.cos(rad.x) ) + sign.y * radius.y * Math.cos(rad.y),
				y: ( ft.attrs.center.y + ft.attrs.translate.y + sign.x * radius.x * Math.sin(rad.x) ) + sign.y * radius.y * Math.sin(rad.y)
				});
		});

		return corners;
	}

	/**
	 * Apply limits
	 */
	function applyLimits(bbox) {
		// Snap to grid
		if ( bbox && ft.opts.dragSnap ) {
			var
				x    = bbox.x,
				y    = bbox.y,
				dist = { x: 0, y: 0 },
				snap = { x: 0, y: 0 }
				;

			[ 0, 1 ].map(function() {
				// Top and left sides first
				dist.x = x - Math.round(x / ft.opts.dragSnap) * ft.opts.dragSnap;
				dist.y = y - Math.round(y / ft.opts.dragSnap) * ft.opts.dragSnap;

				if ( Math.abs(dist.x) <= ft.opts.dragSnapDist ) snap.x = dist.x;
				if ( Math.abs(dist.y) <= ft.opts.dragSnapDist ) snap.y = dist.y;

				// Repeat for bottom and right sides
				x += bbox.width  - snap.x;
				y += bbox.height - snap.y;
			});

			ft.attrs.translate.x -= snap.x;
			ft.attrs.translate.y -= snap.y;
		}

		// Keep center within boundaries
		if ( ft.opts.boundary ) {
			var b = ft.opts.boundary;

			if ( ft.attrs.center.x + ft.attrs.translate.x < b.x            ) ft.attrs.translate.x += b.x -            ( ft.attrs.center.x + ft.attrs.translate.x );
			if ( ft.attrs.center.y + ft.attrs.translate.y < b.y            ) ft.attrs.translate.y += b.y -            ( ft.attrs.center.y + ft.attrs.translate.y );
			if ( ft.attrs.center.x + ft.attrs.translate.x > b.x + b.width  ) ft.attrs.translate.x += b.x + b.width  - ( ft.attrs.center.x + ft.attrs.translate.x );
			if ( ft.attrs.center.y + ft.attrs.translate.y > b.y + b.height ) ft.attrs.translate.y += b.y + b.height - ( ft.attrs.center.y + ft.attrs.translate.y );
		}

		// Maintain aspect ratio when scaling
		if ( ft.opts.keepRatio ) ft.attrs.scale.x = ft.attrs.scale.y;

		// Snap to angle, rotate with increments
		var dist = Math.abs(ft.attrs.rotate % ft.opts.rotateSnap);

		dist = Math.min(dist, ft.opts.rotateSnap - dist);

		if ( dist < ft.opts.rotateSnapDist ) {
			ft.attrs.rotate = Math.round(ft.attrs.rotate / ft.opts.rotateSnap) * ft.opts.rotateSnap;
		}

		// Scale with increments
		if ( ft.opts.scaleSnap ) {
			ft.attrs.scale.x = Math.round(ft.attrs.scale.x * ft.attrs.size.x / ft.opts.scaleSnap) * ft.opts.scaleSnap / ft.attrs.size.x;
			ft.attrs.scale.y = Math.round(ft.attrs.scale.y * ft.attrs.size.y / ft.opts.scaleSnap) * ft.opts.scaleSnap / ft.attrs.size.y;
		}

		// Limit range of rotation
		if ( ft.opts.rotateRange ) {
			var deg = ( 360 + ft.attrs.rotate ) % 360;

			if ( deg > 180 ) deg -= 360;

			if ( deg < ft.opts.rotateRange[0] ) ft.attrs.rotate += ft.opts.rotateRange[0] - deg;
			if ( deg > ft.opts.rotateRange[1] ) ft.attrs.rotate += ft.opts.rotateRange[1] - deg;
		}

		// Limit scale
		if ( ft.opts.scaleRange ) {
			//if ( ft.attrs.scale.x * ft.attrs.size.x > ft.opts.scaleRange[1] ) ft.attrs.scale.x *= ft.attrs.scale.x * ft.attrs.size.x / ( ft.opts.scaleRange[1] - ft.attrs.scale.x * ft.attrs.size.x )
		}
	}

	/**
	 * Recursive copy of object
	 */
	function cloneObj(obj) {
		var clone = new Object;

		for ( var i in obj ) {
			clone[i] = typeof obj[i] == 'object' ? cloneObj(obj[i]) : obj[i];
		}

		return clone;
	}

	var timeout = false;

	/**
	 * Call callback asynchronously for better performance
	 */
	function asyncCallback(e) {
		if ( ft.callback ) {
			// Remove empty values
			var events = new Array();

			e.map(function(event, i) { if ( event ) events.push(event); });

			clearTimeout(timeout);

			setTimeout(function() { if ( ft.callback ) ft.callback(ft, events); }, 1);
		}
	}

	ft.updateHandles();

	// Enable method chaining
	return ft;
};