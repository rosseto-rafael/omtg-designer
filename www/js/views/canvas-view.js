(function($) {
	'use strict';

	// Canvas View
	// ----------

	app.CanvasView = Backbone.View.extend({
		
		events : {
			'click' : 'clicked',
			
			'contextmenu' : 'openContextMenu'
		},

		initialize : function() {
			this.listenTo(this.model.get('diagrams'), 'add', this.addOMTGDiagram);
			this.listenTo(this.model.get('diagrams'), 'change', this.updateHistory);
			this.listenTo(this.model, 'change:activeTool', this.setCursor);
			this.listenTo(this.model, 'change:grid', this.toggleGrid);
			this.listenTo(this.model, 'change:diagramShadow', this.toggleDiagramShadow);
			this.listenTo(this.model, 'updateHistory', this.updateHistory);
		},
		
		clearCanvas : function() {
			app.plumb.detachEveryConnection({fireEvent : false});
			app.plumb.deleteEveryEndpoint();
			this.model.get('diagrams').removeAll();
		},

		updateHistory : function() {
			this.model.get('undoManager').update();
		},
		
		redoHistory : function() { 

			var undoManager = this.model.get('undoManager');
			
			if(undoManager.hasRedo()){
				this.clearCanvas(); 
				
				var xml = undoManager.redo();
				if(xml)
					app.XMLParser.parseOMTGSchema(xml);
			}
		},
		
		undoHistory : function() {

			var undoManager = this.model.get('undoManager');
			
			if(undoManager.hasUndo()){
				this.clearCanvas();  
				
				var xml = undoManager.undo();
				if(xml)
					app.XMLParser.parseOMTGSchema(xml);
			}
		},
		
		clicked : function(event) { 
		
			if (event && event.target && !$(event.target).is('.canvas')) 
				return;

			var tool = this.model.get('activeTool');

			if (tool) {				
				var grid = app.canvas.get("snapToGrid");				
				if (tool.get('model') == 'omtgDiagram') {
					var diagram = new app.omtg.Diagram({
						'type' : tool.get('name'),
						'left' : Math.round(event.offsetX / grid) * grid,
						'top' : Math.round(event.offsetY / grid) * grid
					});
					this.model.get('diagrams').add(diagram); 
					this.updateHistory(); 
				}
				tool.toggleActive();
				this.model.set('activeTool', null);
			}
			
			this.model.get('diagrams').unselectAll();
		},

		setCursor : function() {			
			
			var tool = this.model.get('activeTool');

			if (tool && tool.get('model') == 'omtgDiagram') {
				this.$el.css("cursor", "copy");
			}
			else{
				this.$el.css("cursor", "default");
			}			
		},		
		
		toggleGrid : function() {		
			
			if(this.model.get('grid')){
				this.$el.addClass('canvas-background');
			}
			else{
				this.$el.removeClass('canvas-background');
			}
		},	
		
		toggleDiagramShadow : function() {	
			
			if(this.model.get('diagramShadow')){
				this.$el.find('.diagram-container').addClass('diagram-container-shadow');
			}
			else{
				this.$el.find('.diagram-container').removeClass('diagram-container-shadow');
			}
		},	
		
		addOMTGDiagram : function(diagram) {
			
			app.plumb.setSuspendDrawing(true);			
			
			var diagramView = new app.omtg.DiagramView({
				model : diagram
			});
			
			var dObject = diagramView.render().el;
			this.$el.append(dObject);
			
			//Plumbing			
			app.plumb.draggable(dObject, {
				containment : '#canvas',
				scroll : true,
				drag:function(e,ui) {
					// TODO: remove this drag function and repaint for performance reasons
					if($(".cartographic-square").length > 0)
						app.plumb.repaintEverything();
				}
			});
			
			app.plumb.makeSource(dObject, {
				filter : function() {
					var tool = app.canvas.get('activeTool');
					return tool != null && tool.get('model') == 'omtgRelation';
				}
			});
			
			app.plumb.makeTarget(dObject);	
			app.plumb.setSuspendDrawing(false, true);
		},
		
		print : function(){
			this.model.get('diagrams').unselectAll();

			var $canvas = this.$el;
			var maxRight = 0;
			var maxBottom = 0;

			$canvas.find('.diagram-container').each(function(){
				var $d = $(this);
				var pos = $d.position();
				var right = pos.left + $d.outerWidth(true);
				var bottom = pos.top + $d.outerHeight(true);
				if(right > maxRight) maxRight = right;
				if(bottom > maxBottom) maxBottom = bottom;
			});

			var padding = 80;
			var origWidth = $canvas[0].style.width;
			var origHeight = $canvas[0].style.height;

			if(maxRight > 0 && maxBottom > 0){
				$canvas.css({
					'width': (maxRight + padding) + 'px',
					'height': (maxBottom + padding) + 'px'
				});
			}

			var restoreCanvas = function(){
				$canvas.css({
					'width': origWidth,
					'height': origHeight
				});
				window.removeEventListener('afterprint', restoreCanvas);
			};

			window.addEventListener('afterprint', restoreCanvas);
			window.print();
		},
		
		openContextMenu : function(event) { 
			
			if (event && event.target && !$(event.target).is('.canvas')) 
				return; 

			event.preventDefault();			
			
			app.contextMenuView = new app.ContextMenuView({left : event.pageX, top : event.pageY, offsetTop : event.offsetY, offsetLeft : event.offsetX});
		}
	});

})(jQuery);