// Namespaces

var ENTER_KEY = 13;
var ESC_KEY = 27;
var LEFT_ARROW_KEY = 37;
var TOP_ARROW_KEY = 38;
var RIGHT_ARROW_KEY = 39;
var DOWN_ARROW_KEY = 40;
var DELETE_KEY = 46;
var B_KEY = 66;
var C_KEY = 67;
var D_KEY = 68;
var F_KEY = 70;
var V_KEY = 86;
var Z_KEY = 90;
var F1_KEY = 112;
var F2_KEY = 113;

var app = {
	// OMT-G namespace
	omtg : {},

	msgs : {
		DELETE_CONNECTION: "This connection will be detached. Are you sure?",
		DELETE_DIAGRAM: "This diagram will be removed. All its connection will be detached. Are you sure?",
		DELETE_DIAGRAMS: "The selected diagrams will be removed. All their connections will be detached. Are you sure?",
		EMPTY_PROJECT: "Project is empty, there is nothing to export!",
		NOT_EMPTY_PROJECT: "Project is not empty",
	},
};

$(function () {
	'use strict';
	
	// Diagrams
	app.classTools = new app.Tools([
	     { name : 'polygon', model : 'omtgDiagram', tooltip: 'Polygon', icon: 'imgs/omtg/polygon.png' },
	     { name : 'line', model : 'omtgDiagram', tooltip: 'Line', icon: 'imgs/omtg/line.png' },	
	     { name : 'point', model : 'omtgDiagram', tooltip: 'Point', icon: 'imgs/omtg/point.png' },
	     { name : 'node', model : 'omtgDiagram', tooltip: 'Node', icon: 'imgs/omtg/node.png' },
	     { name : 'isolines', model : 'omtgDiagram', tooltip: 'Isolines', icon: 'imgs/omtg/isolines.png' },
	     { name : 'planar-subdivision', model : 'omtgDiagram', tooltip: 'Planar Subdivision', icon: 'imgs/omtg/planar-subdivision.png' },
	     { name : 'TIN', model : 'omtgDiagram', tooltip: 'Triangular Irregular Network', icon: 'imgs/omtg/TIN.png' },
	     { name : 'tesselation', model : 'omtgDiagram', tooltip: 'Tesselation', icon: 'imgs/omtg/tesselation.png' },
	     { name : 'sample', model : 'omtgDiagram', tooltip: 'Sample', icon: 'imgs/omtg/sample.png' },
	     { name : 'un-line', model : 'omtgDiagram', tooltip: 'Unidirectional Line', icon: 'imgs/omtg/un-line.png' },
	     { name : 'bi-line', model : 'omtgDiagram', tooltip: 'Bidirectional Line', icon: 'imgs/omtg/bi-line.png' },
	     { name : 'conventional', model : 'omtgDiagram', tooltip: 'Conventional', icon: 'imgs/omtg/conventional.png' }
	]);

	
	// Relations
	app.relationshipTools = new app.Tools([
	     { name : 'association', model : 'omtgRelation', tooltip: 'Association', icon: 'imgs/relation/association.png' },
	     { name : 'spatial-association', model : 'omtgRelation', tooltip: 'Spatial Association', icon: 'imgs/relation/spatial-association.png' },
	     { name : 'aggregation', model : 'omtgRelation', tooltip: 'Aggregation', icon: 'imgs/relation/aggregation.png' },
	     { name : 'spatial-aggregation', model : 'omtgRelation', tooltip: 'Spatial Aggregation', icon: 'imgs/relation/spatial-aggregation.png' },
	     { name : 'cartographic-generalization-overlapping', model : 'omtgRelation', tooltip: 'Cartographic Generalization Overlapping', icon: 'imgs/relation/cartographic-generalization-overlapping.png' },
	     { name : 'cartographic-generalization-disjoint', model : 'omtgRelation', tooltip: 'Cartographic Generalization Disjoint', icon: 'imgs/relation/cartographic-generalization-disjoint.png' },
	     { name : 'generalization-disjoint-partial', model : 'omtgRelation', tooltip: 'Generalization Disjoint-Partial', icon: 'imgs/relation/generalization-disjoint-partial.png' },
	     { name : 'generalization-overlapping-partial', model : 'omtgRelation', tooltip: 'Generalization Overlapping-Partial', icon: 'imgs/relation/generalization-overlapping-partial.png' },
	     { name : 'generalization-disjoint-total', model : 'omtgRelation', tooltip: 'Generalization Disjoint-Total', icon: 'imgs/relation/generalization-disjoint-total.png' },	     
	     { name : 'generalization-overlapping-total', model : 'omtgRelation', tooltip: 'Generalization Overlapping-Total', icon: 'imgs/relation/generalization-overlapping-total.png' },
	     { name : 'arc-network', model : 'omtgRelation', tooltip: 'Arc-Node Network', icon: 'imgs/relation/arc-network.png' }
	]);

	
	// List of toolboxes
	app.toolboxes = new app.Toolboxes([
	     {name: "Classes", tools : app.classTools},
	     {name: "Relationships", tools : app.relationshipTools}
	]);	

	// Canvas Model
	app.canvas = new app.Canvas();
	
	// Initialize Backbone views.
	app.bodyView = new app.BodyView();
	app.navbarView = new app.NavbarView({el: $('#main-navbar')});
	app.toolboxesView = new app.ToolboxesView({el: $('#section-sidebar'), model: app.toolboxes});
	app.canvasView = new app.CanvasView({el: '#canvas', model: app.canvas});
});

(function() {
	'use strict';

	// OMTGAttribute Model
	// ----------

	app.omtg.Attribute = Backbone.Model.extend({ 
		
		defaults : function() {
			return {
				name : '',
				type : 'INTEGER',
				defaultValue : '',
				isKey : false,
				length : '',
				scale : '',
				size : '',
				isNotNull : false,
				domain : '',
			};
		},
		
		// Return a copy of the model as XML
		toXML: function () {
			var xml = "<attribute>";
			
			xml += "<name>" + this.get('name') + "</name>";
			xml += "<type>" + this.get('type') + "</type>";
			
			if(this.get('isKey'))
				xml += "<key>" + this.get('isKey') + "</key>";

			if(this.get('length') != "")
				xml += "<length>" + this.get('length') + "</length>";

			if(this.get('scale') != "")
				xml += "<scale>" + this.get('scale') + "</scale>";
			
			if(this.get('isNotNull'))
				xml += "<not-null>" + this.get('isNotNull') + "</not-null>";
			
			if(this.get('defaultValue') != "")
				xml += "<default>" + this.get('defaultValue') + "</default>";

			if(this.get('size') != "")
				xml += "<size>" + this.get('size') + "</size>";		
			
			if(this.get('domain') != ""){
				xml += "<domain>";
				var values = this.domain.split("\n");		
				for ( var i = 0; i < values.length; i++) {
					xml += "<value>" + values[i] + "</value>";
				}		
				xml += "</domain>";
			}
			xml += "</attribute>";
			
			return xml;			
		},
	});

})();
(function() {
	'use strict';
	
	// Diagram Model
	// ----------

	app.omtg.Diagram = Backbone.Model.extend({
		defaults : function() {
			return {
				id : this.cid, 
				type : '',
				name : 'Class_' + this.cid,
				attributes : new app.omtg.Attributes(),
				selected : false,
				top : 10,
				left : 10
			};
		},
		
		duplicate: function() {
			var offset = Math.floor(Math.random() * 31);
			
			var newDiagram = new app.omtg.Diagram({
				'type' : this.get('type'),
				'left' : this.get('left') + 40 + offset,
				'top' : this.get('top') + 40 + offset,
				'attributes' : this.get('attributes').clone()
			});
			
			for(var i=1; ; i++){
				var cloneName = this.get('name') + '_' + i;
				if( app.canvas.get('diagrams').findByName(cloneName) == null ){
					newDiagram.set('name', cloneName );
					break;
				}
			}
			
			return newDiagram;
		},
		
		copy: function() {
			app.canvas.set('clipboard', this.clone());
		},
		
		// Move the diagram
		move: function(t, l) {
			this.set('top', this.get('top') + t);
			this.set('left', this.get('left') + l);
		},
		
		// Toggle the `selected` state of this diagram.
		toggleSelected: function () {
			this.set('selected', !this.get('selected'));
		},
		
		// Return a copy of the model as XML
		toXML: function () {
			return "<class>" +
			"<name>" + this.get('name') + "</name>" +
			"<top>" + this.get('top') + "</top>" +
			"<left>" + this.get('left') + "</left>" +
			"<type>" + this.get('type') + "</type>" +
			"<attributes>" + this.get('attributes').toXML() + "</attributes>" +
			"</class>";			
		},
	});
	
})();
(function() {
	'use strict';

	// Tool Model
	// ----------

	app.Tool = Backbone.Model.extend({
		defaults : function() {
			return {
				name : '',
				type : '',
				tooltip: '',
				icon: '',
				active: false,
			};
		},
		
		// Toggle the `selected` state of this tool
		toggleActive: function () {
			this.set('active', !this.get('active'));
		},
	});

})();
(function() {
	'use strict';

	// Toolbox Model
	// ----------

	app.Toolbox = Backbone.Model.extend({
		defaults : function() {
			return {
				name : '',
				tools : null
			}
		}
	});

})();
(function() {
	'use strict';

	// Tool Model
	// ----------

	app.Canvas = Backbone.Model.extend({
		defaults : function() {
			return {
				diagrams : new app.omtg.Diagrams(),
				activeTool : null,
				grid : true,
				diagramShadow : true,
				snapToGrid : 10,
				clipboard : null,
				undoManager : new app.UndoManager(),
				projectName : '',
			}; 
		},
		
		toXML : function() {
			var projectName = this.get('projectName') || '';
			var xml = '<?xml version="1.0" encoding="UTF-8"?>'
				+ '<omtg-conceptual-schema xsi:noNamespaceSchemaLocation="omtg-schema-template.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'
				+ '<project-name>' + projectName + '</project-name>'
				+ this.get('diagrams').toXML()
				+ this.connectionsToXML()
				+ '</omtg-conceptual-schema>';

			return xml;
		},
		
		hasClipboard : function() {
			if(this.get('clipboard') != null)
				return true;
			return false;
		},
		
		duplicateDiagram : function(diagram) {
			var clone = diagram.duplicate();			
			this.get('diagrams').add(clone);
			this.trigger('updateHistory', this);
		},
		
		copyDiagram : function(diagram) {
			diagram.copy();
		},
		
		pasteDiagram : function(top, left) {			
			var clipboard = this.get('clipboard');
			
			if(clipboard != null){ 					
				var diagram = clipboard.duplicate();
							
				diagram.set('top', top);
				diagram.set('left', left);				 
				this.get('diagrams').add(diagram);
			}		
			
			this.trigger('updateHistory', this);
		},
		
		// Convert all connections to XML
		connectionsToXML : function() {
			var conns = app.plumb.getConnections();
			var connsXML = "";
						
			for(var i=0; i<conns.length; i++){
				var type = conns[i].getType()[0];
				if (type != "arc-network-sibling"
					&& type != "cartographic-leg" 
						&& type != "generalization-leg"){
					connsXML += this.connectionToXML(conns[i]);
				}
	    	}
			
			return "<relationships>" + connsXML + "</relationships>";			
		},		
		
		// Convert a connection to XML
		connectionToXML : function(conn){
			
			var type = conn.getType()[0];
			
			switch(type){
			case "aggregation":
				var sourceName = this.get('diagrams').getAttrById(conn.sourceId, 'name');
				var targetName = this.get('diagrams').getAttrById(conn.targetId, 'name');
				return "<conventional-aggregation>" +
				"<class1>" + sourceName + "</class1>" +
				"<class2>" + targetName + "</class2>" +
				"</conventional-aggregation>";
				
			case "spatial-aggregation":
				var sourceName = this.get('diagrams').getAttrById(conn.sourceId, 'name');
				var targetName = this.get('diagrams').getAttrById(conn.targetId, 'name');
				return "<spatial-aggregation>" +
				"<class1>" + sourceName + "</class1>" +
				"<class2>" + targetName + "</class2>" +
				"</spatial-aggregation>";
				
			case "association":
				var description = conn.getOverlay("description-label").getLabel();
				var sourceName = this.get('diagrams').getAttrById(conn.sourceId, 'name');
				var targetName = this.get('diagrams').getAttrById(conn.targetId, 'name');
				var minA = conn.getParameter("minA");
				var maxA = conn.getParameter("maxA");
				var minB = conn.getParameter("minB");
				var maxB = conn.getParameter("maxB");			
				return "<conventional>" +
				"<name>" + description + "</name>" +
				"<class1>" + sourceName + "</class1><cardinality1><min>" + minA + "</min><max>" + maxA + "</max></cardinality1>" +
				"<class2>" + targetName + "</class2><cardinality2><min>" + minB + "</min><max>" + maxB + "</max></cardinality2>" +
				"</conventional>";
				
			case "spatial-association":
				var description = conn.getOverlay("description-label").getLabel().split(" ")[0];
				var sourceName = this.get('diagrams').getAttrById(conn.sourceId, 'name');
				var targetName = this.get('diagrams').getAttrById(conn.targetId, 'name');
				var minA = conn.getParameter("minA");
				var maxA = conn.getParameter("maxA");
				var minB = conn.getParameter("minB");
				var maxB = conn.getParameter("maxB");	
				var distance = conn.getParameter("distance");	
				return "<topological>" +
				"<spatial-relations><spatial-relation>" + description + "</spatial-relation><distance>" + distance + "</distance></spatial-relations>" +
				"<class1>" + sourceName + "</class1><cardinality1><min>" + minA + "</min><max>" + maxA + "</max></cardinality1>" +
				"<class2>" + targetName + "</class2><cardinality2><min>" + minB + "</min><max>" + maxB + "</max></cardinality2>" +
				"</topological>";
				
			case "arc-network":
			case "arc-network-self":
				var description = conn.getOverlay("description-label").getLabel();
				var sourceName = this.get('diagrams').getAttrById(conn.sourceId, 'name');
				var targetName = this.get('diagrams').getAttrById(conn.targetId, 'name');
				return "<network>" +
				"<name>" + description + "</name>" +
				"<class1>" + sourceName + "</class1>" +
				"<class2>" + targetName + "</class2>" +
				"</network>";
				
			case "generalization-disjoint-partial":
			case "generalization-disjoint-total":
			case "generalization-overlapping-partial":
			case "generalization-overlapping-total":				
				var superName = this.get('diagrams').getAttrById(conn.sourceId, 'name');
				
				var endpoint = conn.endpoints[0];				
				var participation = endpoint.getParameter("participation");
				var disjointness = endpoint.getParameter("disjointness");

				var subClasses = "";
				var subConns = endpoint.getAttachedElements();
				for(var i=0; i<subConns.length; i++){
					var subName = this.get('diagrams').getAttrById(subConns[i].targetId, 'name');
		    		subClasses += "<subclass>" + subName + "</subclass>";
		    	}
				
				return "<generalization>" +
				"<superclass>" + superName + "</superclass>" +
				"<participation>" + participation + "</participation>" +
				"<disjointness>" + disjointness + "</disjointness>" +
				"<subclasses>" + subClasses + "</subclasses>" +
				"</generalization>";
				
			case "cartographic-generalization-disjoint":
			case "cartographic-generalization-overlapping":
				var superName = this.get('diagrams').getAttrById(conn.sourceId, 'name');
				var disjointness = conn.getParameter("disjointness");
				var description = conn.getOverlay("cartographic-label").getLabel();
				
				var subClasses = "<subclass>" + this.get('diagrams').getAttrById(conn.targetId, 'name') + "</subclass>";
				
				var subConns = app.plumb.getConnections({source : conn.getOverlay("cartographic-square").getElement()});
				for(var i=0; i<subConns.length; i++) {
					var subName = this.get('diagrams').getAttrById(subConns[i].targetId, 'name');
		    		subClasses += "<subclass>" + subName + "</subclass>";
		    	}
				
				return "<conceptual-generalization>" +
				"<superclass>" + superName + "</superclass>" +
				"<scale-shape>" + description + "</scale-shape>" + 
				"<disjointness>" + disjointness + "</disjointness>" +
				"<subclasses>" + subClasses + "</subclasses>" +
				"</conceptual-generalization>";
				
			default:
				return "";
			}
		}
	});

})();
(function() {
	'use strict';

	// Tool Model
	// ----------

	app.UndoManager = Backbone.Model.extend({
		defaults : function() {
			return {
				historyIndex : -1,
				history : [],
			};
		},
		
		update: function() {	
//			console.log("update");
			var xml = app.canvas.toXML();
			
			var history = _.clone(this.get('history'));
			var index = this.get('historyIndex');
			
			if(!history || history[index] != xml){	
				
				history = history.slice(0, index + 1);				
				history.push(xml);
				 
//				console.log(xml);
				
				this.set('history', history);
				this.set('historyIndex', ++index); 
			}
		},
		
		redo: function () {			
		    var index = this.get('historyIndex');
			
			if (index < this.get('history').length){ 
				this.set('historyIndex', ++index);			
				return this.get('history')[index];
			}			
			return "";
		},
		
		undo: function () {			
			var index = this.get('historyIndex');
			
			if (index >= 0){ 
				this.set('historyIndex', --index);				
				return this.get('history')[index];
			}			
			return "";
		},
		
		hasRedo: function() {
			var index = this.get('historyIndex');			
			if(index !== this.get('history').length - 1){
				return true;
			}
			return false;
		},
		
		hasUndo: function() {
			var index = this.get('historyIndex');
			if(index >= 0){
				return true;
			}
			return false;
		}
	});

})();
(function() {
	'use strict';

	// OMTGDiagrams Collection
	// ----------
	
	app.omtg.Attributes = Backbone.Collection.extend({
		model : app.omtg.Attribute,
		
		toXML: function() {
			var xml = "";
			this.each(function(model) {
	    		xml += model.toXML();
	    	});
			return xml;
		},
	});
	
})();
	
(function() {
	'use strict';

	// OMTGDiagrams Collection
	// ----------
	
	app.omtg.Diagrams = Backbone.Collection.extend({
		model : app.omtg.Diagram,

		_multiSelecting: false,

		initialize: function() {	       
	        this.listenTo(this, 'change:selected', this.propagate_selected);
	    },
	    
	    removeAll : function() {
	    	var diagram;
	    	while (diagram = this.last()) {
	    		diagram.trigger("destroy", diagram);  
	    	}
		},
		
		removeSet : function(set){			
			if (confirm(app.msgs.DELETE_DIAGRAMS)){			
				for (var i = 0; i < set.length; i++){
					app.plumb.detachAllConnections(set[i].id, {fireEvent : false}); 
		    		set[i].trigger("destroy", set[i]);
		    	}
				app.canvasView.updateHistory();
			}
		},
		
		getSelected : function() {
			return this.where({selected : true});
		},
	    
	    propagate_selected: function(p) { 
	    	if (this._multiSelecting) return;
	    	if(!p.get('selected'))
	            return;
	        this.each(function(m) {
	            if(p.id != m.id)
	                m.set({ selected: false }, { silent: false });
	        });
	    }, 
	    
	    unselectAll: function(){ 
	    	this.each(function(m) {
	    		m.set({ selected: false }, { silent: false });
	    	});
	    },

	    selectMultiple: function(models) {
	    	this._multiSelecting = true;
	    	this.each(function(m) {
	    		m.set({ selected: false }, { silent: true });
	    	});
	    	for (var i = 0; i < models.length; i++) {
	    		models[i].set({ selected: true }, { silent: true });
	    	}
	    	this._multiSelecting = false;
	    	this.each(function(m) {
	    		m.trigger('change', m);
	    	});
	    },
		
	    getAttrById : function(id, attr) {		    	
			var diagram = this.findWhere({id : id});
			if(diagram)
				return diagram.get(attr);			
			return null;
		},
		
		findByName : function(name) {
			var ds = this.where({name : name});
			for(var i=0; i<ds.length; i++){
				return ds[i];
			}
			return null;
		},
		
		toXML: function() {
		
			var xml = "";
			this.each(function(model) {
	    		xml += model.toXML();
	    	});
			return "<classes>" + xml + "</classes>";
		},
	});

})();
	
(function() {
	'use strict';

	// Tools Collection
	// ----------

	app.Tools = Backbone.Collection.extend({
		model : app.Tool,
		
		initialize : function() {
			this.listenTo(this, 'change:active', this.propagate_active);
		},
		
		propagate_active: function(p) {
			if(!p.get('active'))
	            return;
	        this.each(function(m) {
	            if(p.get('name') != m.get('name'))
	            	m.set({ active: false }, { silent: false });
	        });
	        app.canvas.set('activeTool', p);
	    },
	    
	    deactivateAll: function(){
	    	this.each(function(m) {
	    		m.set({ active: false }, { silent: false });
	    	});
	    },

		activated : function() {
			return this.findWhere({
				active : true
			});
		},

		getTooltip : function(name) {
			return this.findWhere({
				name : name
			}).get('tooltip');
		},
	});

})();

(function() {
	'use strict';

	// Toolboxes Collection
	// ----------
	
	app.Toolboxes = Backbone.Collection.extend({
		model : app.Toolbox
	});
	
})();
	
(function($) {
	'use strict';

	// Body View
	// ----------

	app.BodyView = Backbone.View.extend({

		el: "body",
		
		events : {
			"keydown": "keyHandler",
		},

		keyHandler : function(event){
						
			// Avoid breaking the dialogs
			if($(".modal-dialog").length > 0)
				return;
	
			var code = event.keyCode || event.which;
						
			switch(code){		
				case LEFT_ARROW_KEY:
					if(event.shiftKey) _.invoke(app.canvas.get('diagrams').getSelected(), 'move', 0, -1);					
					else _.invoke(app.canvas.get('diagrams').getSelected(), 'move', 0, -4);
					break;
					
				case TOP_ARROW_KEY:
					if(event.shiftKey) _.invoke(app.canvas.get('diagrams').getSelected(), 'move', -1, 0);
					else _.invoke(app.canvas.get('diagrams').getSelected(), 'move', -4, 0);
					break;
					
				case RIGHT_ARROW_KEY:
					if(event.shiftKey) _.invoke(app.canvas.get('diagrams').getSelected(), 'move', 0, 1);
					else _.invoke(app.canvas.get('diagrams').getSelected(), 'move', 0, 4);
					break;
					
				case DOWN_ARROW_KEY:
					if(event.shiftKey) _.invoke(app.canvas.get('diagrams').getSelected(), 'move', 1, 0);
					else _.invoke(app.canvas.get('diagrams').getSelected(), 'move', 4, 0);
					break;
					
				case DELETE_KEY:
					var selected = app.canvas.get('diagrams').getSelected();
					if(selected.length >= 1){
						app.canvas.get('diagrams').removeSet(selected);
					}
					break; 
					
				case C_KEY:
					if(event.ctrlKey){
						event.preventDefault();
						var selected = app.canvas.get('diagrams').getSelected();
						if(selected.length == 1){
							app.canvas.copyDiagram(selected[0]); 
						}
					}	
					break;
					
				case D_KEY:
					if(event.ctrlKey){
						event.preventDefault();
						var selected = app.canvas.get('diagrams').getSelected();
						if(selected.length == 1){
							app.canvas.duplicateDiagram(selected[0]); 
						}
					}		
					break;
				
				case B_KEY:
					if(event.ctrlKey && event.shiftKey){
						var selected = app.canvas.get('diagrams').getSelected();
						if(selected.length == 1){
							selected[0].trigger('sendtoback', selected[0]); 
						}
					}		
					break;
					
				case F_KEY:
					if(event.ctrlKey && event.shiftKey){
						var selected = app.canvas.get('diagrams').getSelected();
						if(selected.length == 1){
							selected[0].trigger('bringtofront', selected[0]); 
						}
					}					
					break;
					
				case V_KEY:
					if(event.ctrlKey){
						var offset = Math.floor(Math.random() * 41);
						app.canvas.pasteDiagram(10+offset, 10+offset);
					}
					break;
				
				case Z_KEY:
					if(event.ctrlKey) {
						// CTRL + SHIFT + Z
						if(event.shiftKey) app.canvasView.redoHistory();
						// CTRL + Z
						else app.canvasView.undoHistory();  
					}
					break;
					
				case F1_KEY:
					event.preventDefault();
					new app.AboutView();
					break;
					
				case F2_KEY:
					var selected = app.canvas.get('diagrams').getSelected();
					if(selected.length == 1){
						selected[0].trigger('edit', selected[0]); 
					}
					break;
			}
		}
		
	});

})(jQuery);
(function($) {
	'use strict';

	// OMTGDiagram View
	// ----------

	app.omtg.AttributeView = Backbone.View.extend({

		tagName : 'tr',

		initialize : function() {
			this.template = _.template("<td><% if( isKey ){ %> <img class='attribute-key' src='imgs/omtg/key.png'> <% } %></td><td><%= attr %></td>");
			
		},

		render : function() {
			// TODO: include other attr fields
			this.$el.html(this.template({
				isKey : this.model.get('isKey'), 
				attr : this.model.get('type') == 'VARCHAR' ? this.model.escape('name') + ': ' + this.model.get('type') + '('+ this.model.get('length') +')' : this.model.escape('name') + ': ' + this.model.get('type'),
			}));
			return this;
		},

	});

})(jQuery);
(function($) {
	'use strict';

	// OMTG Diagram View
	// ----------
	
	app.omtg.DiagramView = Backbone.View.extend({

		tagName : 'div',

		className : 'diagram-container',
		
		parentSelector : '#canvas', 
				
		events : {
			
			// Delete the diagram and remove its view from canvas
			'click .badge-delete' : 'deleteDiagram',
			
			'click .badge-edit' : 'edit',
			
			// Toggle the selection of the diagram
			'click' : 'handleClick',			

		    'dblclick' : 'handleDblClick',
		        
		    'mouseenter' : 'handleMouseEnter',
		    
		    'mouseleave' : 'handleMouseLeave',
		        
		    'mouseup' : 'updatePosition',
		    
		    'contextmenu' : 'openContextMenu'
		},

		initialize : function() {

			// Templates
			this.$conventional = $('#omtg-conventional-template');
			this.$georeferenced = $('#omtg-georeferenced-template');

			// Listeners
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
			this.listenTo(this.model, 'edit', this.edit);
			this.listenTo(this.model, 'bringtofront', this.bringToFront);
			this.listenTo(this.model, 'sendtoback', this.sendToBack);
		},

		render : function() {
			
			// Check the type of the diagram to use a proper template
			if (this.model.get("type") == 'conventional') {
				this.template = _.template(this.$conventional.html());
			} else {
				this.template = _.template(this.$georeferenced.html());
			}
			
			// Render class id
			this.el.id = this.model.get('id');
			
			// Set position
			this.$el.css({        
				'top': this.model.get('top') + 'px',
				'left': this.model.get('left') + 'px'
			});			
			
			// Render name and type
			this.$el.html(this.template(this.model.toJSON()));
			
			
			// Render attributes
			var attributes = this.model.get('attributes');						
			attributes.each(function(attribute) {				
				var attributeView = new app.omtg.AttributeView({model : attribute});
				this.$('.d-body > table > tbody').append(attributeView.render().el);
			}, this);
			
			
			// Render the `selected` state
			if(this.model.get('selected')){
				this.$el.addClass('selected');
				this.$('.badge-delete').removeClass('hidden');
				this.$('.badge-edit').removeClass('hidden');
			}
			else{
				this.$el.removeClass('selected');
			}
			
			// Render shadow
			if(app.canvas.get('diagramShadow')){
				this.$el.addClass('diagram-container-shadow');
			}
			
			app.plumbUtils.repaintAllAnchors();
			app.plumb.repaintEverything();
			
			return this;
		},
		
		handleClick : _.debounce(function(event) {
			
            if (this.doubleclicked) {
                this.doubleclicked = false; 
            } else if (app._wasDragging) {
            	app._wasDragging = false;
            } else {            	
            	this.model.toggleSelected();
            }
        }, 200),
        
        handleDblClick : function(e) {
            this.doubleclicked = true;
            this.edit.call(this, e);
        },
		
		edit : function(event) {
			 
			if(event && event.stopPropagation) 
				event.stopPropagation(); 
			
			var hasConnections = false;
			if(app.plumb.getConnections({ source: this.el.id }).length || app.plumb.getConnections({ target: this.el.id }).length)
				hasConnections = true;
		
			var modal = new app.omtg.DiagramEditorView({model : this.model, hasConnections : hasConnections});
		},
		
		deleteDiagram : function(event) {
			if(event) 
				event.stopPropagation(); 
			
			if (confirm(app.msgs.DELETE_DIAGRAM)){			
				app.plumb.detachAllConnections(this.$el);						
				
				// Remove view				 
				this.model.trigger("destroy", this.model); 
				app.canvasView.updateHistory();
			}
		},
		
		updatePosition : function(event) {
			var grid = app.canvas.get("snapToGrid");
			this.model.set({
				'left': Math.round(this.$el.position().left / grid) * grid,
				'top' : Math.round(this.$el.position().top / grid) * grid
			});
						
			var plumbConnections = app.plumb.getConnections(this.$el);
			
			for (var i = 0; i < plumbConnections.length; i++) {
				app.plumbUtils.updateLabelsPosition(plumbConnections[i]);
			}
		},
		
		handleMouseEnter : function() {
			this.$el.addClass('hovered');
			this.$('.badge-delete').removeClass('hidden');
			this.$('.badge-edit').removeClass('hidden');
		},
		
		handleMouseLeave : function() {	
			this.$el.removeClass('hovered');
			this.$('.badge-delete').addClass('hidden');
			this.$('.badge-edit').addClass('hidden');	
		},

		bringToFront : function() {
			$(this.render().el).appendTo(this.parentSelector);
		},
		
		sendToBack : function() {
			$(this.render().el).prependTo(this.parentSelector);
		},
		
		openContextMenu : function(event) { 
			event.preventDefault();			
			app.contextMenuView = new app.ContextMenuView({diagramView : this, left : event.pageX, top : event.pageY});
		}
	});

})(jQuery);
(function($) {
	'use strict';

	// OMTG Diagram Editor View
	// ----------

	app.omtg.DiagramEditorView = Backbone.View.extend({

		id : 'diagram-editor',

		className : 'modal fade',

		events : {

			// Modal events
			'click #btnUpdate' : 'updateDiagram',
			'hidden.bs.modal' : 'teardown',

			// Diagram events
			'click #ulDiagramType a' : 'selectType',
			'input #inputDiagramName':  'inputNameChanged',

			// Attributes table events
			'click #btnAddRow' : 'newAttribute',
			'click .btnRowDelete' : 'deleteAttribute',
			'click .btnRowUp' : 'moveAttributeUp',
			'click .btnRowDown' : 'moveAttributeDown',
			'blur .name-editable' : 'editName',
			'blur .value-editable' : 'editValue',
			'blur .length-editable' : 'editLength',
			'click .toggleKey': 'toggleKey',
			'click .toggleNotNull': 'toggleNotNull',
			'click .ulAttributeType a' : 'selectAttributeType',
			
			"submit" : "preventSubmission"
		},

		initialize : function(options) {
			this.template = _.template($('#omtg-diagram-editor-template').html());
			
			this.hasConnections = options.hasConnections;
			
			// Copy of attributes
			this.attrsClone = this.model.get('attributes').clone();

			this.render();
		},

		render : function() {
			this.$el.html(this.template(this.model.toJSON()));

			// Modal parameters
			this.$el.modal({
				backdrop : 'static',
				keyboard : false,
				show : true,
			});
			
			// Disable diagram type selector if diagram has connections
			if(this.hasConnections){
				this.$("#inputDiagramType").addClass("disabled");
				this.$("#inputDiagramTypeToggle").addClass("disabled");
			}
			
			// Render table rows
			this.attrsClone.each(function(attr) {
				this.addAttribute(attr);
			}, this);

			return this;
		},

		// Remove and delete from DOM the modal
		teardown : function() {
			this.$el.data('modal', null);
			this.remove();
		},

		// Selected the option in the diagram type dropdown
		selectType : function(event) {
			var selected = this.$(event.currentTarget).html();
			this.$('#inputDiagramType').html(selected);

			var type = this.$(event.currentTarget).data('type-name');
			this.$('#inputDiagramType').data('type-name', type);
		},
		
		inputNameChanged : function(event) {
			var name = this.$(event.currentTarget).val().trim();
			
			var reg = new RegExp("[a-zA-Z0-9][\w#@]{0,63}$");
			
			if (reg.test(name) && /\s/.test(name) == false && app.canvas.get('diagrams').findByName(name) == null) {
			    this.$('#formDiagramName').removeClass("has-error");
			    this.$('#btnUpdate').removeClass("disabled");
			} else {
				this.$('#formDiagramName').addClass("has-error");
				this.$('#btnUpdate').addClass("disabled");
			}			
		}, 

		updateDiagram : function() { 
			// Diagram type
			var type = this.$('#inputDiagramType').data('type-name');
			if (type) {
				this.model.set('type', type);
			}

			// Diagram name
			var name = this.$('#inputDiagramName').val().trim();
			if (name) {
				this.model.set('name', name);
			}
			
			// Diagram attributes, remove empty name ones
			for(var i=0; i<this.attrsClone.length; i++){
				var attr = this.attrsClone.at(i);
				if(attr.get('name') == ''){				
					this.attrsClone.remove(attr);
					i--;
				}
			}
			this.model.set({'attributes': this.attrsClone});
			this.model.trigger('change', this.model);

			//this.teardown();
		},

		newAttribute : function() {
			var attr = new app.omtg.Attribute();
			this.addAttribute(attr);
			this.attrsClone.add(attr);
		},

		addAttribute : function(attribute) {
			var rowTemplate = _.template($('#omtg-attribute-row-editor-template').html());
			var html = rowTemplate(attribute.toJSON());
			this.$('#attrTable > tbody > tr:last').before(html);
		},

		deleteAttribute : function(event) {	
			var $row = this.$(event.currentTarget).closest('tr');
			this.attrsClone.remove(this.attrsClone.at($row.index()));
			$row.remove();
		},
		
		moveAttributeUp : function(event) {
			var $row = this.$(event.currentTarget).closest('tr');

			if ($row.index() > 0) {

				var att = this.attrsClone.at($row.index());
				this.attrsClone.remove(att);
				this.attrsClone.add(att, {at : $row.index() - 1});

				$row.insertBefore($row.prev());
			}
		},
		
		moveAttributeDown : function(event) {
			var $row = this.$(event.currentTarget).closest('tr');
			
			if($row.index() < this.attrsClone.length - 1){
				
				var att = this.attrsClone.at($row.index()+1);
				this.attrsClone.remove(att);
				this.attrsClone.add(att, {at : $row.index()});
				
				$row.insertAfter($row.next());
			}
		},
		
		editName : function(event) {
			var index = this.$(event.currentTarget).closest('tr').index();
			
			// Substitutes every space with a underscore.
			var attrName = this.$(event.currentTarget).text();
			attrName = attrName.replace(/\s+/g, '_');
			this.attrsClone.at(index).set('name', attrName);
		},
		
		editValue : function(event) {
			var index = this.$(event.currentTarget).closest('tr').index();
			this.attrsClone.at(index).set('defaultValue', this.$(event.currentTarget).text());
		},
		
		editLength : function(event) {
			var index = this.$(event.currentTarget).closest('tr').index();
			
			// Check if length is number and bigger than or equal to 1.
			var length = this.$(event.currentTarget).text();
			this.attrsClone.at(index).set('length', length>=1 ? length : '50');
		},
		
		toggleKey : function(event) {
			var index = this.$(event.currentTarget).closest('tr').index();
			this.attrsClone.at(index).set('isKey', this.$(event.currentTarget).prop('checked') );
		},
		
		toggleNotNull : function(event) {
			var index = this.$(event.currentTarget).closest('tr').index();
			this.attrsClone.at(index).set('isNotNull', this.$(event.currentTarget).prop('checked') );
		},
		
		selectAttributeType : function(event) {
			var index = this.$(event.currentTarget).closest('tr').index();
			
			var selected = this.$(event.currentTarget).text().trim();
			this.$(event.currentTarget).parent().parent().siblings('button.btnAttributeType:first').html(selected + ' <span class="caret"></span>');
			
			this.attrsClone.at(index).set('type', selected );
			
			// Make length field editable if varchar is selected
			if(selected == 'VARCHAR'){
				this.$(event.currentTarget).parent().parent().parent().parent().siblings('td.length-editable').attr('contenteditable','true');
				this.$(event.currentTarget).parent().parent().parent().parent().siblings('td.length-editable').text('50');
				this.attrsClone.at(index).set('length', '50');
			}
			else{
				this.$(event.currentTarget).parent().parent().parent().parent().siblings('td.length-editable').text('');
				this.$(event.currentTarget).parent().parent().parent().parent().siblings('td.length-editable').attr('contenteditable','false');
			}
		},
		
		// Avoid form submission on enter
		preventSubmission : function(event) {
			event.preventDefault();
		}
	});

})(jQuery);
(function($) {
	'use strict';

	// OMTG Connection Editor View
	// ----------

	app.omtg.ConnectionEditorView = Backbone.View.extend({

		id : 'connection-editor',

		className : 'modal fade',

		events : {
			// Modal events
			'click #btnUpdate' : 'update',
			'click #btnDelete' : 'detach',
			'hidden.bs.modal' : 'teardown',	
			
			'click #ulConnectionSpatialRelation a' : 'selectSpatialRelation',
			
			"submit" : "preventSubmission",
		},

		initialize : function(options) {
						
			this.template = _.template($('#omtg-connection-editor-template').html());			
			this.connection = options.connection;
			
			this.render();
		},

		render : function() {
			
			this.$el.html(this.template());
			var fieldset = this.$('#connection-editor-form > fieldset');
						
			var type = this.connection.getType()[0];
			
			// Add Spatial Relation component
			if(type == 'spatial-association'){
				
				fieldset.append(_.template($('#omtg-connection-editor-spatial-relation-template').html()));				
				this.descriptionLabel = this.connection.getOverlay("description-label");			
				
				var sourceType = app.canvas.get('diagrams').getAttrById(this.connection.sourceId, 'type');
				var targetType = app.canvas.get('diagrams').getAttrById(this.connection.targetId, 'type');
				
				if(sourceType != "polygon" && sourceType != "planar-subdivision"){
					this.$("#contains").addClass('disabled');
					this.$("#containsproperly").addClass('disabled');
				}
				
				if(targetType != "polygon" && targetType != "planar-subdivision"){
					this.$("#within").addClass('disabled');
				}
				
				var spatialRelation = this.descriptionLabel.getLabel().split(" ")[0];				
				
				if(spatialRelation){
					this.$('#inputConnectionSpatialRelation').data('spatialrelation', spatialRelation);
					this.$('#inputConnectionSpatialRelation').html(spatialRelation);
				}
				else{
					this.$('#inputConnectionSpatialRelation').data('spatialrelation', 'Intersects');
					this.$('#inputConnectionSpatialRelation').html('Intersects');
				}
				
				if(spatialRelation.toLowerCase() == 'near' || spatialRelation.toLowerCase() == 'distant'){
					this.$('#inputConnectionDistance').prop("disabled", false);
					this.$('#inputConnectionDistance').val(this.connection.getParameter("distance"));
				}
			}
			
			// Add Description component
			if(type == 'association' || type == 'arc-network' || type == 'arc-network-self'){
				fieldset.append(_.template($('#omtg-connection-editor-description-template').html()));
				
				this.descriptionLabel = this.connection.getOverlay("description-label");			
				this.$('#inputConnectionDescription').val(this.descriptionLabel.getLabel());
			}
			
			// Add Cardinalities component
			if(type == 'association' || type == 'spatial-association'){ 
				fieldset.append(_.template($('#omtg-connection-editor-cardinalities-template').html()));
				
				var aName = app.canvas.get('diagrams').getAttrById(this.connection.sourceId, 'name');
				var bName = app.canvas.get('diagrams').getAttrById(this.connection.targetId, 'name');
				
				this.$('#CardA-label').text("Cardinality A ("+ aName + "):");
				this.cardLabelA = this.connection.getOverlay("cardinality-labelA");			
				this.$('#inputMinA').val(this.connection.getParameter("minA"));
				this.$('#inputMaxA').val(this.connection.getParameter("maxA"));
				
				this.$('#CardB-label').text("Cardinality B ("+ bName + "):");
				this.cardLabelB = this.connection.getOverlay("cardinality-labelB");			
				this.$('#inputMinB').val(this.connection.getParameter("minB"));
				this.$('#inputMaxB').val(this.connection.getParameter("maxB"));
			} 
			
			// Add Cartographic component
			if(type == 'cartographic-generalization-disjoint' || type == 'cartographic-generalization-overlapping'){
				fieldset.append(_.template($('#omtg-connection-editor-cartographic-template').html()));
				
				this.cartographicLabel = this.connection.getOverlay("cartographic-label");
				if(this.cartographicLabel.getLabel() == 'scale') 
					this.$('#scaleRadio').prop("checked", true);
				else
					this.$('#shapeRadio').prop("checked", true);
			}

			// Modal parameters
			this.$el.modal({
				backdrop : 'static',
				keyboard : false,
				show : true,
			});	

			return this;
		},

		// Remove and delete from DOM the modal
		teardown : function() {
			this.$el.data('modal', null);
			this.remove();
		},

		update : function() {
			
			var type = this.connection.getType()[0];
			var spatialRelation;
				
			// Spatial connection description
			if(type == 'spatial-association'){
				spatialRelation = this.$('#inputConnectionSpatialRelation').data('spatialrelation');
				
				if(spatialRelation.toLowerCase() == 'near' || spatialRelation.toLowerCase() == 'distant'){
					var dist = this.$('#inputConnectionDistance').val().trim();
					
					// Check if distance is number and available, if not set 10 as default.
					if(!dist || !(dist>=0))
						dist = 10;
					
					this.connection.setParameter("distance", dist);
					this.descriptionLabel.setLabel(spatialRelation + ' (' + dist + ')');
				}	
				else{
					this.descriptionLabel.setLabel(spatialRelation);
				}
			}
			
			// Connection description
			if(type == 'association' || type == 'arc-network' || type == 'arc-network-self'){
				var description = this.$('#inputConnectionDescription').val().trim();
				this.descriptionLabel.setLabel(description);
			}
			
			if(type == 'association' || type == 'spatial-association'){
				// Connection cardinality A
				var minA = this.$('#inputMinA').val().trim();
				var maxA = this.$('#inputMaxA').val().trim();
				minA = minA >= 0 && minA != ""  ? minA : '0';
				maxA = maxA >= 1 && maxA != "" && minA <= maxA ? maxA : '*';
				this.cardLabelA.setLabel(this.concatCardLabel(minA, maxA));

				// Connection cardinality B
				var minB = this.$('#inputMinB').val().trim();
				var maxB = this.$('#inputMaxB').val().trim();
				minB = minB >= 0 && minB != ""  ? minB : '0';
				maxB = maxB >= 1 && maxB != "" && minB <= maxB ? maxB : '*';
				this.cardLabelB.setLabel(this.concatCardLabel(minB, maxB));			
			
				// Save in the connection parameters
				this.connection.setParameter("minA", minA);
				this.connection.setParameter("maxA", maxA);
				this.connection.setParameter("minB", minB);
				this.connection.setParameter("maxB", maxB);
				
				app.plumbUtils.updateLabelsPosition(this.connection);
			}
			
			if(type == 'cartographic-generalization-disjoint' || type == 'cartographic-generalization-overlapping'){
				this.cartographicLabel.setLabel(this.$('input:radio[name=inlineRadioOptions]:checked').val());
			}
			
			app.plumbUtils.updateLabelsPosition(this.connection);
			
			// Update undo history
			app.canvasView.updateHistory();
		},
		
		detach : function(event) {
			
			if (confirm(app.msgs.deleteConnection)){
				
				var type = this.connection.getType()[0];

				// Detach leg connections of the cartographic
				if(type == 'cartographic-generalization-disjoint' || type == 'cartographic-generalization-overlapping'){
					app.plumb.detachAllConnections(this.connection.getOverlay("cartographic-square").getElement());		
				}
				else if(type == 'arc-network' || type == 'arc-network-sibling' || type == 'arc-network-self' || type == 'arc-network-sibling-self'){
					var sibling = this.connection.getParameter("sibling");
					app.plumb.detach(sibling);
				}
				
				app.plumb.detach(this.connection);
				
				//this.teardown();
			}
		},
		
		concatCardLabel : function(min, max){

			if(min == max)
				return min;

			return min + ".." + max;
		},
		
		// Selected the option in the diagram type dropdown
		selectSpatialRelation : function(event) {
			var selected = this.$(event.currentTarget).html();
			this.$('#inputConnectionSpatialRelation').html(selected);

			var spatialrelation = this.$(event.currentTarget).data('spatialrelation').trim();
			this.$('#inputConnectionSpatialRelation').data('spatialrelation', spatialrelation);
			
			if(spatialrelation.toLowerCase() == 'near' || spatialrelation.toLowerCase() == 'distant'){
				this.$('#inputConnectionDistance').prop("disabled", false);
				this.$('#inputConnectionDistance').val(this.connection.getParameter("distance"));
			}
			else{
				this.$('#inputConnectionDistance').prop("disabled", true);
				this.$('#inputConnectionDistance').val("");
				this.connection.setParameter("distance", "");
			}
		},
		
		// Avoid form submission on enter
 		preventSubmission : function(event) {
 			event.preventDefault();
  		}

	});

})(jQuery);
(function($) {
	'use strict';

	// Tool View
	// ----------

	app.ToolView = Backbone.View.extend({

		events : {
			'click' : 'clicked',
		},

		initialize : function() {
			this.template = _.template($('#tool-template').html());

			// Listener
			this.listenTo(this.model, 'change:active', this.toggle);
		},

		render : function() {
			var html = this.template(this.model.toJSON());
			this.setElement(html);

			return this;
		},

		clicked : function() {
			this.model.toggleActive();
		},

		toggle : function() {
			
			if (this.model.get('active')) {
				this.$el.addClass('active');
				app.canvas.set('activeTool', this.model);
				
			} else {
				this.$el.removeClass('active');
				app.canvas.set('activeTool', null);
			}
		},
	});

})(jQuery);
(function($) {
	'use strict';
	
	app.ToolsView = Backbone.View.extend({

		render : function() {

			this.$el.empty();

			this.model.each(function(tool) {
				var toolView = new app.ToolView({
					model : tool
				});
				this.$el.append(toolView.render().el);
			}, this);

			return this;
		}
	});
})(jQuery);
(function($) {
	'use strict';
	
	// Toolbox View
	// ----------
	
	app.ToolboxView = Backbone.View.extend({

		tagName : 'div',

		className : 'widget',

		initialize : function() {
						
			this.template = _.template($('#toolbox-template').html());
		},

		render : function() {
			this.$el.html(this.template(this.model.toJSON()));

			var toolsView = new app.ToolsView({
				model : this.model.get('tools')
			});
			toolsView.$el = this.$('.widget-content');
			toolsView.render();

			return this;
		}
	});
})(jQuery);
(function($) {
	'use strict';
	
	// Toolboxes View
	// ----------
	
	app.ToolboxesView = Backbone.View.extend({
				
		initialize : function() {
			this.render();
		},

		render : function() {
			this.$el.empty();

			this.model.each(function(toolbox) {
				var toolboxView = new app.ToolboxView({
					model : toolbox
				});
				this.$el.append(toolboxView.render().el);
			}, this);

		}
	});
})(jQuery);
(function($) {
	'use strict';

	// XML Importer View
	// ----------

	app.XMLImporterView = Backbone.View.extend({

		id : 'xml-importer',

		className : 'modal fade',
		
		events : {

			// Modal events
			'click #btnImport' : 'importXML',
			
			'hidden.bs.modal' : 'teardown',
			
			'change #js-upload-files' : 'uploadFile',
			
			'load #js-upload-files' : 'importXML'
		},

		initialize : function(options) {
			this.template = _.template($('#xmlimporter-template').html());
			this.render();
		},

		render : function() {
			this.$el.html(this.template());

			// Modal parameters
			this.$el.modal({
				backdrop : 'static',
				keyboard : false,
				show : true
			});

			return this;
		},

		// Remove and delete from DOM the modal
		teardown : function() {
			this.$el.data('modal', null);
			this.remove();
		},
		
		uploadFile : function(evt) {
			
			var file = evt.target.files[0];			
			var reader = new FileReader();
			var self = this;

			reader.readAsText(file);

			reader.onload = function() {
				$.ajax({
					url : "XMLImporter",
					type : "POST",
					data : reader.result,
					contentType : "application/json; charset=UTF-8",
					complete : function(e, xhr, settings) {					
						self.allowImport(e.status);
						self.validXML = reader.result;
					}
				});				
			};			
		},

		importXML : function() {
			var parser = app.XMLParser;
			
			parser.parseOMTGSchema(this.validXML);
			
			app.canvasView.updateHistory();
			
			this.teardown();
		},
		
		allowImport : function(status) {
			if(status == 202){
				this.$("#btnImport").removeClass("disabled");
			}
			else {
				this.$("#btnImport").addClass("disabled");
			}
		}
		
	});

})(jQuery);
(function($) {
	'use strict';

	app.NavbarView = Backbone.View.extend({

		events : {
			'click #btnImportXML' : 'importXML',
			'click #btnExportXML' : 'exportXML',
			'click .js-export-sql' : 'exportSQL',
			'click .js-export-astpostgis' : 'exportAstPostgis',
			'click .js-export-postgis' : 'exportPostgis',
			'click #btnPrint' : 'print',
			'click #btnAbout' : 'showAbout',
			'input #projectNameInput' : 'onProjectNameInput',
			'blur #projectNameInput' : 'onProjectNameBlur',
			'keydown #projectNameInput' : 'onProjectNameKeydown',
			
			'change #tgglGrid': 'changeGrid',
			'change #tgglShadow': 'changeDiagramShadow',
			'change #tgglSnapToGrid': 'changeSnapToGrid',
			'click #dropSettings' : 'dropSettingsClick',
		},

		initialize : function() {
			var self = this;
			this._fitNavbar = _.bind(this._fitNavbar, this);
			$(window).on('resize', _.debounce(this._fitNavbar, 100));
			$(window).on('load', this._fitNavbar);
			// Run once after the current render/layout pass settles.
			_.defer(this._fitNavbar);
		},

		// Progressive (priority) navigation: collapse the navbar content in
		// stages as the viewport shrinks, instead of letting it wrap onto a
		// second line.
		//   1. full     – every item visible on a single line
		//   2. merged    – the three SQL exports collapse into one dropdown
		//   3. collapsed – everything moves into the hamburger menu
		_fitNavbar : function() {
			var $nav = this.$el;
			$nav.removeClass('nav-merged nav-collapsed');

			// Below the standard navbar breakpoint always use the hamburger.
			if (window.innerWidth < 768) {
				$nav.addClass('nav-merged nav-collapsed');
				return;
			}

			if (this._isNavbarWrapped()) {
				$nav.addClass('nav-merged');
				if (this._isNavbarWrapped()) {
					$nav.addClass('nav-collapsed');
				}
			}
		},

		_isNavbarWrapped : function() {
			var header = this.$el.find('.navbar-header')[0];
			var left = this.$el.find('.navbar-left')[0];
			var right = this.$el.find('.navbar-right')[0];
			if (!header) {
				return false;
			}
			// Use viewport coordinates (getBoundingClientRect) so the test is
			// not affected by offsetParent quirks.
			var headerRect = header.getBoundingClientRect();
			var threshold = (headerRect.height || 50) * 0.5;
			var leftRect = left && left.getBoundingClientRect();
			// The menu dropped below the brand (no room beside it)...
			if (leftRect && (leftRect.top - headerRect.top > threshold)) {
				return true;
			}
			// ...or the right-aligned group dropped below the left group.
			if (leftRect && right) {
				var rightRect = right.getBoundingClientRect();
				if (rightRect.top - leftRect.top > threshold) {
					return true;
				}
			}
			return false;
		},

		onProjectNameInput : function() {
			var name = $('#projectNameInput').val().trim();
			app.canvas.set('projectName', name);
			document.title = name ? name + ' \u2013 OMT-G Designer' : 'OMT-G Designer';
		},

		onProjectNameBlur : function() {
			var name = $('#projectNameInput').val().trim();
			$('#projectNameInput').val(name);
			app.canvas.set('projectName', name);
			document.title = name ? name + ' \u2013 OMT-G Designer' : 'OMT-G Designer';
		},

		onProjectNameKeydown : function(e) {
			if (e.which === ENTER_KEY) {
				$('#projectNameInput').blur();
			}
		},

		_ensureProjectName : function() {
			var name = app.canvas.get('projectName');
			if (!name) {
				name = prompt('Enter a project name before exporting:', '');
				if (name === null) return null;
				name = name.trim() || 'Untitled-Project';
				app.canvas.set('projectName', name);
				$('#projectNameInput').val(name);
				document.title = name + ' \u2013 OMT-G Designer';
			}
			return name;
		},

		_sanitizeForFileName : function(name) {
			return name.replace(/[^a-zA-Z0-9_-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
		},

		_getTimestamp : function() {
			var now = new Date();
			var pad = function(n) { return n < 10 ? '0' + n : '' + n; };
			return now.getFullYear() + pad(now.getMonth() + 1) + pad(now.getDate())
				+ '-' + pad(now.getHours()) + pad(now.getMinutes()) + pad(now.getSeconds());
		},

		_buildFileName : function(projectName, dbName, extension) {
			var safeName = this._sanitizeForFileName(projectName);
			var ts = this._getTimestamp();
			if (dbName) {
				return 'OMTG-' + safeName + '-' + dbName + '-' + ts + '.' + extension;
			}
			return 'OMTG-' + safeName + '-' + ts + '.' + extension;
		},

		importXML : function() {
			
			if(app.canvas.get('diagrams').length > 0){
				alert(app.msgs.NOT_EMPTY_PROJECT);
				return;
			}
			new app.XMLImporterView();					
		},		
		
		exportXML : function() {
			
			if(app.canvas.get('diagrams').length == 0){
				alert(app.msgs.EMPTY_PROJECT);
				return;
			}

			var projectName = this._ensureProjectName();
			if (!projectName) return;
			var fileName = this._buildFileName(projectName, null, 'xml');
			
			app.plumb.doWhileSuspended(function(){				
				var xml = app.canvas.toXML();
				var blob = new Blob([xml]);
				saveAs(blob, fileName);
			}, false);
		},	
		
		exportSQL : function() {
			
			if(app.canvas.get('diagrams').length == 0){
				alert(app.msgs.EMPTY_PROJECT);
				return;
			}

			var projectName = this._ensureProjectName();
			if (!projectName) return;
			var fileName = this._buildFileName(projectName, 'Oracle', 'zip');
			
			app.plumb.doWhileSuspended(function(){				
				var xml = app.canvas.toXML();
				var xhr = new XMLHttpRequest();
				
				xhr.open("POST", "omtg2sql", true);
				xhr.setRequestHeader("Content-type","application/json");
				xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
				
				xhr.onreadystatechange = function() {
				    if (xhr.readyState == 4 && xhr.status == 200) {				  
				        var blob = new Blob([xhr.response], {type: "octet/stream"});
				        saveAs(blob, fileName);
				    }
				}
				
				xhr.responseType = "arraybuffer";
				xhr.send(xml);
				
			}, false);
		},	
		
		exportAstPostgis : function() {
			
			if(app.canvas.get('diagrams').length == 0){
				alert(app.msgs.EMPTY_PROJECT);
				return;
			}

			var projectName = this._ensureProjectName();
			if (!projectName) return;
			var fileName = this._buildFileName(projectName, 'AstPostgis', 'zip');
			
			app.plumb.doWhileSuspended(function(){				
				var xml = app.canvas.toXML();
				var xhr = new XMLHttpRequest();
				
				xhr.open("POST", "omtg2astpostgis", true);
				xhr.setRequestHeader("Content-type","application/json");
				xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
				
				xhr.onreadystatechange = function() {
				    if (xhr.readyState == 4 && xhr.status == 200) {				  
				        var blob = new Blob([xhr.response], {type: "octet/stream"});
				        saveAs(blob, fileName);
				    }
				}
				
				xhr.responseType = "arraybuffer";
				xhr.send(xml);

			}, false);
		},	

		exportPostgis : function() {
			
			if(app.canvas.get('diagrams').length == 0){
				alert(app.msgs.EMPTY_PROJECT);
				return;
			}

			var projectName = this._ensureProjectName();
			if (!projectName) return;
			var fileName = this._buildFileName(projectName, 'PostGIS', 'zip');
			
			app.plumb.doWhileSuspended(function(){				
				var xml = app.canvas.toXML();
				var xhr = new XMLHttpRequest();
				
				xhr.open("POST", "omtg2postgis", true);
				xhr.setRequestHeader("Content-type","application/json");
				xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
				
				xhr.onreadystatechange = function() {
				    if (xhr.readyState == 4 && xhr.status == 200) {				  
				        var blob = new Blob([xhr.response], {type: "octet/stream"});
				        saveAs(blob, fileName);
				    }
				}
				
				xhr.responseType = "arraybuffer";
				xhr.send(xml);

			}, false);
		},	
		
		print : function() {
			app.canvasView.print();
		},
		
		showAbout : function() {
			new app.AboutView();
		},
		
		dropSettingsClick : function() {
			event.stopPropagation();
			if(event.target.nodeName == 'LABEL' || event.target.nodeName == 'SPAN'){
				$(event.target).parent().parent().find('input').bootstrapToggle('toggle');
			}
			else if(event.target.nodeName == 'A'){
				$(event.target).find('input').bootstrapToggle('toggle');
			}
		},
		
		changeGrid : function() {
			app.canvas.set('grid', $('#tgglGrid').prop('checked'));
		},
		
		changeDiagramShadow : function() {
			app.canvas.set('diagramShadow', $('#tgglShadow').prop('checked'));
		},
		
		changeSnapToGrid : function() {
			if($('#tgglSnapToGrid').prop('checked')){
				app.canvas.set('snapToGrid', 10);
			}
			else{
				app.canvas.set('snapToGrid', 1);
			}
		},
		
	});

})(jQuery);
(function($) {
	'use strict';

	// Canvas View
	// ----------

	app.CanvasView = Backbone.View.extend({
		
		events : {
			'click' : 'clicked',
			'mousedown' : 'onMouseDown',
			'contextmenu' : 'openContextMenu'
		},

		initialize : function() {
			this.listenTo(this.model.get('diagrams'), 'add', this.addOMTGDiagram);
			this.listenTo(this.model.get('diagrams'), 'change', this.updateHistory);
			this.listenTo(this.model, 'change:activeTool', this.setCursor);
			this.listenTo(this.model, 'change:grid', this.toggleGrid);
			this.listenTo(this.model, 'change:diagramShadow', this.toggleDiagramShadow);
			this.listenTo(this.model, 'updateHistory', this.updateHistory);

			this._rubberBand = null;
			this._$selRect = null;
			this._didRubberBand = false;
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
		
			if (this._didRubberBand) {
				this._didRubberBand = false;
				return;
			}

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

		onMouseDown : function(event) {
			if (event.which !== 1) return;
			if (!$(event.target).is('.canvas')) return;
			if (this.model.get('activeTool')) return;

			var rect = this.$el[0].getBoundingClientRect();
			this._rubberBand = {
				startX: event.clientX - rect.left,
				startY: event.clientY - rect.top,
				active: false
			};

			var self = this;
			this._onDocMouseMove = function(e) { self._rubberBandMove(e); };
			this._onDocMouseUp = function(e) { self._rubberBandEnd(e); };
			$(document).on('mousemove', this._onDocMouseMove);
			$(document).on('mouseup', this._onDocMouseUp);

			event.preventDefault();
		},

		_rubberBandMove : function(event) {
			if (!this._rubberBand) return;

			var rect = this.$el[0].getBoundingClientRect();
			var curX = event.clientX - rect.left;
			var curY = event.clientY - rect.top;

			var dx = Math.abs(curX - this._rubberBand.startX);
			var dy = Math.abs(curY - this._rubberBand.startY);

			if (!this._rubberBand.active && (dx > 4 || dy > 4)) {
				this._rubberBand.active = true;
				this._$selRect = $('<div class="selection-rectangle"></div>');
				this.$el.append(this._$selRect);
			}

			if (this._rubberBand.active) {
				this._$selRect.css({
					left: Math.min(this._rubberBand.startX, curX) + 'px',
					top: Math.min(this._rubberBand.startY, curY) + 'px',
					width: dx + 'px',
					height: dy + 'px'
				});
			}
		},

		_rubberBandEnd : function(event) {
			$(document).off('mousemove', this._onDocMouseMove);
			$(document).off('mouseup', this._onDocMouseUp);

			if (!this._rubberBand) return;

			if (this._rubberBand.active) {
				this._didRubberBand = true;

				var rect = this.$el[0].getBoundingClientRect();
				var endX = event.clientX - rect.left;
				var endY = event.clientY - rect.top;

				var selLeft = Math.min(this._rubberBand.startX, endX);
				var selTop = Math.min(this._rubberBand.startY, endY);
				var selRight = Math.max(this._rubberBand.startX, endX);
				var selBottom = Math.max(this._rubberBand.startY, endY);

				var selected = [];
				this.model.get('diagrams').each(function(diagram) {
					var $el = $('#' + diagram.get('id'));
					if ($el.length === 0) return;
					var pos = $el.position();
					var dLeft = pos.left;
					var dTop = pos.top;
					var dRight = dLeft + $el.outerWidth();
					var dBottom = dTop + $el.outerHeight();

					if (dRight >= selLeft && dLeft <= selRight &&
						dBottom >= selTop && dTop <= selBottom) {
						selected.push(diagram);
					}
				});

				this.model.get('diagrams').selectMultiple(selected);

				if (this._$selRect) {
					this._$selRect.remove();
					this._$selRect = null;
				}
			}

			this._rubberBand = null;
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
				start: function() {
					app._wasDragging = false;
					var draggedId = dObject.id;
					var selected = app.canvas.get('diagrams').getSelected();
					var isInSelection = false;
					for (var i = 0; i < selected.length; i++) {
						if (selected[i].get('id') === draggedId) {
							isInSelection = true;
							break;
						}
					}
					if (isInSelection && selected.length > 1) {
						var $d = $(dObject);
						app._groupDrag = {
							draggedId: draggedId,
							startLeft: $d.position().left,
							startTop: $d.position().top,
							others: []
						};
						for (var i = 0; i < selected.length; i++) {
							var sid = selected[i].get('id');
							if (sid !== draggedId) {
								var $s = $('#' + sid);
								app._groupDrag.others.push({
									id: sid,
									startLeft: $s.position().left,
									startTop: $s.position().top
								});
							}
						}
					} else {
						app._groupDrag = null;
					}
				},
				drag: function() {
					app._wasDragging = true;
					if (app._groupDrag) {
						var $d = $(dObject);
						var dx = $d.position().left - app._groupDrag.startLeft;
						var dy = $d.position().top - app._groupDrag.startTop;
						for (var i = 0; i < app._groupDrag.others.length; i++) {
							var o = app._groupDrag.others[i];
							$('#' + o.id).css({
								left: (o.startLeft + dx) + 'px',
								top: (o.startTop + dy) + 'px'
							});
						}
					}
					app.plumb.repaintEverything();
				},
				stop: function() {
					if (app._groupDrag) {
						var grid = app.canvas.get("snapToGrid");
						var $d = $(dObject);
						var dx = $d.position().left - app._groupDrag.startLeft;
						var dy = $d.position().top - app._groupDrag.startTop;
						for (var i = 0; i < app._groupDrag.others.length; i++) {
							var o = app._groupDrag.others[i];
							var newLeft = Math.round((o.startLeft + dx) / grid) * grid;
							var newTop = Math.round((o.startTop + dy) / grid) * grid;
							var model = app.canvas.get('diagrams').findWhere({id: o.id});
							if (model) {
								model.set({left: newLeft, top: newTop});
							}
						}
						app.plumb.repaintEverything();
						app._groupDrag = null;
					}
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
(function($) {
	'use strict';

	// OMTG Connection Editor View
	// ----------

	app.AboutView = Backbone.View.extend({

		id : 'welcome-modal',

		className : 'modal fade',

		events : {
			// Modal events
			'hidden.bs.modal' : 'teardown',		
		},

		initialize : function(options) {
						
			this.template = _.template($('#about-template').html());
			
			this.render();
		},

		render : function() {
			
			this.$el.html(this.template());

			// Modal parameters
			this.$el.modal({
				backdrop : 'static',
				keyboard : true,
				show : true,
			});	

			return this;
		},

		// Remove and delete from DOM the modal
		teardown : function() {
			this.$el.data('modal', null);
			this.remove();
		},

	});

})(jQuery);
(function($) {
	'use strict';

	// Context Menu View
	// ----------

	app.ContextMenuView = Backbone.View.extend({

		className : 'context-menu',
		
		parentSelector: 'body',
		
		events : {
			'click  #cmEdit' : 'editDiagram',
			'click  #cmDelete' : 'deleteDiagram',
			'click  #cmToFront' : 'bringToFront',
			'click  #cmToBack' : 'sendToBack',
			'click  #cmCopy' : 'copyDiagram',
			'click  #cmPaste' : 'pasteDiagram',
			'click  #cmDuplicate' : 'duplicateDiagram',
			'click  #cmUndo' : 'undo',
			'click  #cmRedo' : 'redo',
			'click' : 'destroyMenu',
			'contextmenu' : 'rightClick'
		},

		initialize : function(options) {		
			
			if(options.diagramView != null){
				this.template = _.template($('#contextmenu-diagram-template').html());
				this.diagramView = options.diagramView;
			}
			else{
				this.template = _.template($('#contextmenu-canvas-template').html());
				this.offsetTop = options.offsetTop;
				this.offsetLeft = options.offsetLeft; 
			}
						
			this.left = options.left;
			this.top = options.top;			
			
			this.render();
		},

		render : function() {			
			this.$el.html(this.template());   			
			this.$el.appendTo(this.parentSelector);
					
			// Context menu of canvas 
			if(this.diagramView == null){
				
				// set paste inactive if there is nothing on clipboard
				if(app.canvas.get('clipboard') == null){
					this.$('#cmPaste').parent().addClass('disabled');  
				} 
				
				// set undo and redo inactive
				var undoManager = app.canvas.get('undoManager');				
				if(!undoManager.hasUndo())
					this.$('#cmUndo').parent().addClass('disabled');				
				if(!undoManager.hasRedo())
					this.$('#cmRedo').parent().addClass('disabled');  
			} 
			
			//TODO: chose position to better fit the canvas
			this.$('.context-menu-content').css({ 
				top: this.top + 'px', 
				left: this.left + 'px' 
			});	
			
			return this;
		},
		
		destroyMenu: function() {				
		    // COMPLETELY UNBIND THE VIEW
		    this.undelegateEvents();

		    this.$el.removeData().unbind(); 

		    // Remove view from DOM
		    this.remove();  
		    Backbone.View.prototype.remove.call(this);
		},
		
		editDiagram : function() { 
			this.diagramView.edit(); 
		},
		
		deleteDiagram : function() {
			this.diagramView.deleteDiagram();
		},
		
		bringToFront : function() {
			this.diagramView.bringToFront();
		},
		
		sendToBack : function() {
			this.diagramView.sendToBack(); 
		},
		
		duplicateDiagram : function() {
			app.canvas.duplicateDiagram(this.diagramView.model);
		}, 
		
		copyDiagram : function() {
			app.canvas.copyDiagram(this.diagramView.model);
		}, 
		
		pasteDiagram : function(event) {
			if(app.canvas.hasClipboard())
				app.canvas.pasteDiagram(this.offsetTop, this.offsetLeft);
			else
				event.stopPropagation();
		}, 
		
		rightClick : function(event) {
			event.preventDefault();
			this.destroyMenu(); 
		},
		
		undo : function(event) {					
			if(app.canvas.get('undoManager').hasUndo()){
				app.canvasView.undoHistory();
			}
			else{
				event.stopPropagation(); 
			}			
		}, 
		
		redo : function(event) {
			if(app.canvas.get('undoManager').hasRedo()){
				app.canvasView.redoHistory();
			}
			else{
				event.stopPropagation(); 
			}
		}		
	});

})(jQuery);
jsPlumb.ready(function() {

	var defaultConnectorStyle = { 
			stroke:"black", 
			strokeWidth:2
	};

	var dashedConnectorStyle = { 
			stroke:"black", 
			strokeWidth:2,
			"dashstyle": "4 3" 
	};

	var connectorHoverStyle = {
			stroke:"#1e8151",
			strokeWidth:4,
			outlineStroke:"transparent", 
			outlineWidth:2
	};	
	
	var diamondOverlay = [ [ "Diamond", {
		length : 35,
		width : 18,
		location : 35,
		paintStyle : {
			stroke : "black",
			fill : "white"
		}
	} ] ];
	
	var triangleEndpoint = function(type){ 
		if(type == "generalization-disjoint-partial")
			return ["Image", {src:"imgs/omtg/triangle-white.png", cssClass:"triangle-endpoint"}];
		if(type == "generalization-overlapping-partial")
			return ["Image", {src:"imgs/omtg/triangle-black.png", cssClass:"triangle-endpoint"}];
		if(type == "generalization-disjoint-total")
			return ["Image", {src:"imgs/omtg/triangle-circle-white.png", cssClass:"triangle-endpoint"}];
		if(type == "generalization-overlapping-total")
			return ["Image", {src:"imgs/omtg/triangle-circle-black.png", cssClass:"triangle-endpoint"}];
	};
	
	var generalizationEndpointAnchor = function(type){
		if(type == "total")
			return [ 0.5, 1, 0, 1, 0, 20 ];
		else
			return [ 0.5, 1, 0, 1, 0, 11 ];
	}

	var squareOverlay = function(type){ 
		if(type == "cartographic-generalization-overlapping")
			return ["Image", {src:"imgs/omtg/square-black.png", cssClass:"square-overlay"}];		
		if(type == "cartographic-generalization-disjoint")
			return ["Image", {src:"imgs/omtg/square-white.png", cssClass:"square-overlay"}];
	};
	
	
	var square = function(color, position){
		return ["Custom", {
	    	create: function(component) {
	    		return $('<img class="cartographic-square" src="imgs/omtg/square-'+ color +'.png" alt="'+ color +' square" width="16px" height="16px" >');                
	    	},
	    	id: "cartographic-square",
	    	cssClass: "cartographic-square",
	    	location: position,        	
	    }];	
	};	
	
	// Plumbing default setup
	app.plumb = jsPlumb.getInstance({
		Anchor : "Continuous",
//		ConnectionsDetachable : false, // Was causing error on aggregation.
		Connector : "Flowchart",
		Container : "canvas",
		DragOptions : {cursor : "pointer", zIndex : 2000},
		Endpoint : "Blank"
	});
	
	
	// Define all the connection types
	app.plumb.registerConnectionTypes({
		"association" : {
			paintStyle: defaultConnectorStyle,
			hoverPaintStyle: connectorHoverStyle,
			overlays : [[ "Label", { label:"", location:0.5, id:"description-label", cssClass: "description-label" } ],
			            [ "Label", { label:"0..*", location:30, id:"cardinality-labelA", cssClass: "cardinality-label" } ],
			            [ "Label", { label:"0..*", location:-30, id:"cardinality-labelB", cssClass: "cardinality-label" } ],
					    [ "Custom", { 
					        create:function(component) {
					            return $("<img src='imgs/relation/description-arrow.png' alt='Arrow of the relation'>");                
					        },    
					        location: 0.5, 
					        id:"description-arrow",
					        cssClass:"description-arrow" }]
					   ],
			parameters: {
				"minA" : "0",
				"maxA" : "*",
				"minB" : "0",
				"maxB" : "*",
			},
		},
		"spatial-association" : {
			paintStyle: dashedConnectorStyle,
			hoverPaintStyle: connectorHoverStyle,
			overlays : [[ "Label", { label:"Intersects", location:0.5, id:"description-label", cssClass: "description-label" } ],
			            [ "Label", { label:"0..*", location:30, id:"cardinality-labelA", cssClass: "cardinality-label" } ],
			            [ "Label", { label:"0..*", location:-30, id:"cardinality-labelB", cssClass: "cardinality-label" } ],
					    [ "Custom", { 
					        create:function(component) {
					            return $("<img src='imgs/relation/description-arrow.png' alt='Arrow of the relation'>");                
					        },    
					        location: 0.5, 
					        id:"description-arrow",
					        cssClass:"description-arrow" }]
					   ],
			parameters: {
				"minA" : "0",
				"maxA" : "*",
				"minB" : "0",
				"maxB" : "*",
				"distance" : "",
			},
		},
		"aggregation" : {
			paintStyle : defaultConnectorStyle,
			hoverPaintStyle: connectorHoverStyle,
			overlays : diamondOverlay,
		},
		"spatial-aggregation" : {
			paintStyle : dashedConnectorStyle,
			hoverPaintStyle: connectorHoverStyle,
			overlays : diamondOverlay,
		},
		"generalization-disjoint-partial" : {
			paintStyle : defaultConnectorStyle,
			hoverPaintStyle: connectorHoverStyle,
			parameters:{
				"participation":"partial",
				"disjointness":"disjoint",
			},
		},
		"generalization-overlapping-partial" : {
			paintStyle : defaultConnectorStyle,
			hoverPaintStyle: connectorHoverStyle,
			parameters:{
				"participation":"partial",
				"disjointness":"overlapping",
			},
		},
		"generalization-disjoint-total" : {
			paintStyle : defaultConnectorStyle,
			hoverPaintStyle: connectorHoverStyle,
			parameters:{
				"participation":"total",
				"disjointness":"disjoint",
			},
		},
		"generalization-overlapping-total" : {
			paintStyle : defaultConnectorStyle,
			hoverPaintStyle: connectorHoverStyle,
			parameters:{
				"participation":"total",
				"disjointness":"overlapping",
			},
		},
		"generalization-leg" : {
			paintStyle : defaultConnectorStyle,
			hoverPaintStyle: connectorHoverStyle,
		},
		"arc-network" : {
			paintStyle : dashedConnectorStyle,
			hoverPaintStyle: connectorHoverStyle,
			overlays : [[ "Label", { label:"network", location:0.5, id:"description-label", cssClass: "arc-network-label" } ]],
		},
		"arc-network-sibling" : {
			paintStyle : dashedConnectorStyle,
			hoverPaintStyle: connectorHoverStyle,
		},		
		"arc-network-self" : {
			paintStyle : dashedConnectorStyle,
			hoverPaintStyle: connectorHoverStyle,
			overlays : [[ "Label", { label:"network", location:0.4, id:"description-label", cssClass: "arc-network-self-label" } ]],
		},
		"arc-network-sibling-self" : {
			paintStyle : dashedConnectorStyle,
			hoverPaintStyle: connectorHoverStyle,
		},
		"cartographic-generalization-disjoint" : {
			paintStyle : dashedConnectorStyle,
			hoverPaintStyle: connectorHoverStyle,
			overlays : [square("white", 70), [ "Label", { label:"scale", location:0.5, id: "cartographic-label", cssClass: "cartographic-label" }]],
			parameters:{
				"disjointness":"disjoint"
			},
		},
		"cartographic-generalization-overlapping" : {
			paintStyle : dashedConnectorStyle,
			hoverPaintStyle: connectorHoverStyle,
			overlays : [square("black", 70), [ "Label", { label:"scale", location:0.5, id: "cartographic-label", cssClass: "cartographic-label" }]],
			parameters:{
				"disjointness":"overlapping",
			},
		},
		"cartographic-leg" : {
			paintStyle : dashedConnectorStyle,
			hoverPaintStyle: connectorHoverStyle,
		},
	});
	
	// This events checks which type of connection the user chose in the
	// toolbox, and set the type of the connection to the selected one.
	app.plumb.bind("connectionDrag", function(connection) {		
		
		var tool = app.canvas.get('activeTool');	
		if (tool != null && tool.get('model') == 'omtgRelation') {
			var type = tool.get('name');			
			
			// set connector to arc-network
			if(type == "arc-network"){
				connection.setConnector("Straight");
			}
			
			connection.setType(type);
			
			// hide overlays when start dragging
			if(type == "association" || type == "spatial-association"
				|| type == "arc-network" ){
				connection.hideOverlays();
			}
			
			return;
		}		
		
		// if connection comes from a cartographic square, set type as cartographic-leg
		if(connection.source.classList.contains("cartographic-square")){
			connection.setType("cartographic-leg");
			return;
		}
		
		// This redundant piece of code fixes a jsPlumb bug that set more than one type for connections.
		// This removes the other types and set only generalization-leg. 
		// See: https://github.com/jsplumb/jsPlumb/issues/580
		if( jQuery.inArray( "generalization-leg", connection.getType()) != -1 ){
			connection.setType("generalization-leg");
			return;
		}
	});
		
	
	// This events it is used to set some properties, like specific
	// anchors, to some connections. Here the second line of the
	// arc-network connection is also connected.
	app.plumb.bind("connection", function (info, originalEvent) {
				
		// This was added to fix the bug of jsplumb. It adds more types than
		// what is necessary. See: https://github.com/jsplumb/jsPlumb/issues/580
		if(info.connection.getType().length > 1){
			info.connection.removeType("default");
			info.connection.removeType("");
		}
				
		var type = info.connection.getType()[0];
		
		// Show all overlays after connection is established
		info.connection.showOverlays();
		
		switch(type){
		
		case "association":			
			if(info.connection.sourceId == info.connection.targetId){ 
				
				app.plumb.detach(info.connection, {fireEvent : false}); 
				
				var newConn = app.plumb.connect({
					source : info.connection.sourceId,
					target : info.connection.targetId,
					anchors : [ [ 0, 0.6, -1, 0 ], [ 0.5, 1, 0, 1 ] ],
					fireEvent : false
				});	
				
				newConn.setConnector(["Flowchart", {stub: [50, 50], alwaysRespectStubs: true}]);
				
				newConn.setType(type);
				
				app.plumbUtils.updateLabelsPosition(newConn);
			}
			else{
				app.plumbUtils.updateLabelsPosition(info.connection);
			}
			
			break;
			
		case "spatial-association":
			app.plumbUtils.updateLabelsPosition(info.connection);				
			break;
		
		//Adds the second line in network relationships
		case "arc-network":
			
			if(info.connection.sourceId == info.connection.targetId){
				app.plumb.detach(info.connection, {fireEvent : false});

				var newConn = app.plumb.connect({
					source : info.connection.sourceId,
					target : info.connection.targetId,
					anchors : [ [ 0.35, 1, 0, 1 ], [ 1, 0.5, 1, 0 ] ],
					fireEvent : false
				});					

				var sibling = app.plumb.connect({
					source: info.connection.sourceId, 
					target: info.connection.targetId,
					anchors : [ [ 0.5, 1, 0, 1 ], [ 1, 0.75, 1, 0 ] ],
					fireEvent : false
				});	
				
				// set connectors
				newConn.setConnector(["Flowchart", {stub: [50, 50], alwaysRespectStubs: true}]);
				sibling.setConnector(["Flowchart", {stub: [25, 25], alwaysRespectStubs: true}]);
				
				// set types
				newConn.setType("arc-network-self");
				sibling.setType("arc-network-sibling-self");
				
				// set parameters
				sibling.setParameter("sibling", newConn);
				newConn.setParameter("sibling", sibling);	
			}
			else{									
				var sourceWidth = info.connection.source.getBoundingClientRect().width;
				var sourceHeight = info.connection.source.getBoundingClientRect().height;
				var targetWidth = info.connection.target.getBoundingClientRect().width;
				var targetHeight = info.connection.target.getBoundingClientRect().height;
				
				var sx = app.plumbUtils.NETWORK_DIST/sourceWidth;
				var sy = app.plumbUtils.NETWORK_DIST/sourceHeight;
				var tx = app.plumbUtils.NETWORK_DIST/targetWidth;
				var ty = app.plumbUtils.NETWORK_DIST/targetHeight;
				
				app.plumb.detach(info.connection, {fireEvent : false});

				var newConn = app.plumb.connect({
					source : info.connection.sourceId,
					target : info.connection.targetId,
					fireEvent : false
				});		
				
				var sibling = app.plumb.connect({
					source:info.connection.sourceId, 
					target:info.connection.targetId,
					fireEvent : false
				});		
				
				// set connectors
				newConn.setConnector("Straight");
				sibling.setConnector("Straight");
				
				// set types
				newConn.setType("arc-network");	
				sibling.setType("arc-network-sibling");				
				
				// set anchors
				newConn.endpoints[0].setAnchor([ [ 0.5 + sx, 0, 0, -1 ], [ 1, 0.5 + sy, 1, 0 ], [ 0.5 - sx, 1, 0, 1 ], [ 0, 0.5 - sy, -1, 0 ] ]);			
				newConn.endpoints[1].setAnchor([ [ 0.5 - tx, 0, 0, -1 ], [ 1, 0.5 - ty, 1, 0 ], [ 0.5 + tx, 1, 0, 1 ], [ 0, 0.5 + ty, -1, 0 ] ]);			
				sibling.endpoints[0].setAnchor([ [ 0.5 - sx, 0, 0, -1 ], [ 1, 0.5 - sy, 1, 0 ], [ 0.5 + sx, 1, 0, 1 ], [ 0, 0.5 + sy, -1, 0 ] ]);
				sibling.endpoints[1].setAnchor([ [ 0.5 + tx, 0, 0, -1 ], [ 1, 0.5 + ty, 1, 0 ], [ 0.5 - tx, 1, 0, 1 ], [ 0, 0.5 - ty, -1, 0 ] ]);
				
				// set parameters
				sibling.setParameter("sibling", newConn);
				newConn.setParameter("sibling", sibling);	
				
				// set position of the label
				app.plumbUtils.updateLabelsPosition(newConn);
			}
		
			break;
			
		case "generalization-disjoint-partial":
		case "generalization-disjoint-total":
		case "generalization-overlapping-partial":
		case "generalization-overlapping-total":
						
			var participation = info.connection.getParameter("participation");
			var disjointness = info.connection.getParameter("disjointness");
			
			// Detach the connection to add a new one with the correct
			// endpoint
			app.plumb.detach(info.connection, {fireEvent : false});
			
			// Adds the endpoint to the diagram
			var endpoint = app.plumb.addEndpoint(info.connection.sourceId, {
				anchor : generalizationEndpointAnchor(participation),
				connectionType : "generalization-leg",
				endpoint : triangleEndpoint(type),
				isSource : true, 
				isTarget : false,
				maxConnections : -1,
				uniqueEndpoint : true,				
				parameters:{
					"participation": participation,
					"disjointness": disjointness,
			    }
			});
			
			// Re-atach the connection, but now to the endpoint
			var newConn = app.plumb.connect({
				anchors : [ "Bottom", "Top" ],
				source : endpoint,
				target : info.connection.targetId
			});	
			newConn.setType(type);
			newConn.setConnector(["Flowchart", {stub: [50, 30], alwaysRespectStubs: true}]);			
			break;
			
		// Generalization leg type connection with top target anchor
		case "generalization-leg":
			info.connection.endpoints[1].setAnchor("Top");
			info.connection.setConnector(["Flowchart", {stub: [50, 30], alwaysRespectStubs: true}]);
			break;
			
		case "cartographic-generalization-disjoint":
		case "cartographic-generalization-overlapping":
			// Set connection anchors, due to the drag
			// change of anchors, default in jsplumb, the
			// connection must be detached and re-atached
			// with the Bottom and Top anchors
			app.plumb.detach(info.connection, {fireEvent : false});
			var newConn = app.plumb.connect({
				source : info.connection.sourceId,
				target : info.connection.targetId,
				anchors : [ "Bottom", "Top" ],
				fireEvent : false
			});
			newConn.setConnector(["Flowchart", {stub: [70, 50], alwaysRespectStubs: true}]);
			newConn.setType(type);
			
			// Make the middle square of the connection a source of connections
			app.plumb.makeSource(newConn.getOverlay("cartographic-square").getElement(), {
				anchor:[ "Right", "Left" ]
			});	
			break;
			
		// Cartographic leg type connection with top target anchor
		case "cartographic-leg":
			info.connection.endpoints[1].setAnchor("Top");
			info.connection.setConnector(["Flowchart", {stub: [0, 50], alwaysRespectStubs: true}]);
			break;
		}
		
		app.canvasView.updateHistory(); 
		
		// Deactivate all tools
		app.relationshipTools.deactivateAll();
		app.classTools.deactivateAll();
	});
	

	// Event that checks for relationship restrictions. Before
	// dropping a connection to its target, the Designer checks if
	// this relationship is valid accordingly to OMT-G restrictions.
	app.plumb.bind("beforeDrop", function(info) {
		
		// Get type of the connection and type of the diagrams
		var type = info.connection.getType()[0];
		
		// Avoid self loop. 
		if((type != "arc-network" && type != "association")  && info.sourceId == info.targetId){
			return false;
		}

		var sourceType = app.canvas.get('diagrams').getAttrById(info.sourceId, 'type');
		var targetType = app.canvas.get('diagrams').getAttrById(info.targetId, 'type');
				
		switch(type){		
		// Superclass and subclasses must have the same type
		case "generalization-disjoint-partial":
		case "generalization-overlapping-partial":
		case "generalization-disjoint-total":
		case "generalization-overlapping-total":
			return sourceType == targetType;
			
		// Aggregation must be between conventional classes	
		case "aggregation":
			return (sourceType == "conventional") || (targetType == "conventional");			

		// Superclass must be conventional and subclasses georeferenced
		case "cartographic-generalization-disjoint":
		case "cartographic-generalization-overlapping":
			return (sourceType == "conventional") && (targetType != "conventional");
			
		case "cartographic-leg":
			return targetType != "conventional";
			
		// Both classes must be georeferenced	
		case "spatial-association":
		case "spatial-aggregation":
			return (sourceType != "conventional") && (targetType != "conventional");
			
		// If source == target, they must be bi-line or un-line.
		// if source or target is a node, the other side must be bi-line or un-line.
		case "arc-network":			
			return (info.connection.sourceId == info.connection.targetId && (sourceType == "bi-line" || sourceType == "un-line")) ||
			(sourceType == "node" && (targetType == "bi-line" || targetType == "un-line")) ||
			(targetType == "node" && (sourceType == "bi-line" || sourceType == "un-line"));
		}
		
		return true;		
	});
	
	
	// Event that opens modal for edit the connection or to delete it
	app.plumb.bind("dblclick", function(connection, originalEvent) {
			
		var param = connection;
				
		// Fix the bug of clicking an overlay
		if(connection instanceof jsPlumb.Overlays.Label){
			param = connection.component;
		}
		
		// For arc-network when clicked in the sibling connection
		var type = param.getType()[0];
		if(type == 'arc-network-sibling' || type == 'arc-network-sibling-self')
			param = param.getParameter('sibling');

		
		// Connection types without attributes
		// to be edited or without legs. Only
		// opens a confirmation dialog for
		// deletion.
		if (type == 'aggregation'
			|| type == 'spatial-aggregation'
					|| type == 'cartographic-leg') {

			if (confirm(app.msgs.DELETE_CONNECTION)){
				app.plumb.detach(param); 
			}
		}
		
		else if (type == "generalization-disjoint-partial"
			|| type == "generalization-disjoint-total"
				|| type == "generalization-overlapping-partial"
					|| type == "generalization-overlapping-total") {
			
			if (confirm(app.msgs.DELETE_CONNECTION)){
				
				var endpoint = param.endpoints[0];
				app.plumb.detach(param);
				
				// Delete the endpoint triangle if there are no connections anymore.
				if(endpoint.getAttachedElements().length == 0){
					app.plumb.deleteEndpoint(endpoint);
				}
				else{
					endpoint.getAttachedElements()[0].setType(type);
					endpoint.getAttachedElements()[0].removeAllOverlays();
				}
			}	
		}
		
		// Generalization connections. 
		else if(type == 'generalization-leg'){
			
			if (confirm(app.msgs.DELETE_CONNECTION)){
				
				var endpoint = param.endpoints[0];
				app.plumb.detach(param);
				
				// Delete the endpoint triangle if there are no connections anymore.
				if(endpoint.getAttachedElements().length == 0){
					app.plumb.deleteEndpoint(endpoint);
				}
			}			
		}	
		
		// Connections with attributes to be edited. Opens the editor modal
		else {
			new app.omtg.ConnectionEditorView({connection : param});
		}		
	});
	
	app.plumb.bind("connectionDetached", function(info, originalEvent) {
//		console.log("detached");
 
		// Update undo history
		app.canvasView.updateHistory();
	});
});

'use strict';

app.plumbUtils = {

	NETWORK_DIST: 15, 	
		
	setAssociationLabelClass : function(connection, overlay, edge){
		
		var cardLabel = connection.getOverlay(overlay);
		
		cardLabel.removeClass("cardinality-left");
		cardLabel.removeClass("cardinality-right");
		cardLabel.removeClass("cardinality-top");
		cardLabel.removeClass("cardinality-bottom");
		
		switch(edge){ 
		case "left":
			cardLabel.addClass("cardinality-left");
			break;
		case "right":
			cardLabel.addClass("cardinality-right");
			break;
		case "top":
			cardLabel.addClass("cardinality-top");
			break;
		case "bottom":
			cardLabel.addClass("cardinality-bottom");
			break;
		default:
			cardLabel.addClass("cardinality-top");
			cardLabel.addClass("cardinality-left");
		}
	},
	
	calculateWordOffset : function(length, v0, v1){
		
		var min = 1;
		var max = 40;
				
		return (v1 - v0)*(length - min) / (max - min) + v0;
		
	},
	
	getPositionAtCenter : function (element) {
        var data = element.getBoundingClientRect();
        return {
            x: data.left + data.width / 2,
            y: data.top + data.height / 2
        };
    },

    getDistanceBetweenElements : function(a, b) {
        var aPosition = this.getPositionAtCenter(a);
        var bPosition = this.getPositionAtCenter(b);

        return Math.sqrt(
            Math.pow(aPosition.x - bPosition.x, 2) + 
            Math.pow(aPosition.y - bPosition.y, 2) 
        );
    },
    
    setOverlayTransformation : function(overlay, a, b, angle) {
    	overlay.style.webkitTransform = 'translate('+a+'px, '+b+'px) rotate('+angle+'rad)'; 
    	overlay.style.mozTransform    = 'translate('+a+'px, '+b+'px) rotate('+angle+'rad)'; 
    	overlay.style.msTransform     = 'translate('+a+'px, '+b+'px) rotate('+angle+'rad)'; 
    	overlay.style.oTransform      = 'translate('+a+'px, '+b+'px) rotate('+angle+'rad)'; 
    	overlay.style.transform       = 'translate('+a+'px, '+b+'px) rotate('+angle+'rad)';
    },
		
	updateLabelsPosition : function(connection){
		
		var type = connection.getType();
		
		if(type == "association" || type == "spatial-association"){
			
			// Get elements
			var label = connection.getOverlay("description-label");
			var labelElement = label.getElement();
			var arrow = connection.getOverlay("description-arrow");
			
	        // Get the orientation of the label segment
			var p = connection.connector.pointOnPath( label.loc );
			var segment = connection.connector.findSegmentForPoint(p.x, p.y);
			
			if(connection.sourceId == connection.targetId){
				// Set cardinalities position	
				this.setAssociationLabelClass(connection, "cardinality-labelA", "left");
				this.setAssociationLabelClass(connection, "cardinality-labelB", "bottom");
				
				// Set label position			
				this.setOverlayTransformation(labelElement, 40 + (-1)*labelElement.offsetWidth/2, -23, 0);
				this.setOverlayTransformation(arrow.getElement(), 40 + (-1/2)*arrow.getElement().width, -31, 0);
			}
			else{ 
				// Set cardinalities position				
				var sourceEdge = connection.endpoints[0]._continuousAnchorEdge;
				var targetEdge = connection.endpoints[1]._continuousAnchorEdge;		
				this.setAssociationLabelClass(connection, "cardinality-labelA", sourceEdge);  	
				this.setAssociationLabelClass(connection, "cardinality-labelB", targetEdge);			
					
				// Get the center position of diagrams
				var pSource = this.getPositionAtCenter(connection.source);
		        var pTarget = this.getPositionAtCenter(connection.target);
				
				// Set label position
		        // When segment is horizontal
				if( (segment.y1 == segment.y2 && Math.abs(segment.x1 - segment.x2) > labelElement.offsetWidth) 
						|| (segment.y1 != segment.y2 && Math.abs(segment.y1 - segment.y2) <= arrow.getElement().width) ){				
					
					var angle = Math.PI;
					if(pSource.x <= pTarget.x){
						angle = 0;
					}
					
					this.setOverlayTransformation(labelElement, (-1)*labelElement.offsetWidth/2, (-1)*labelElement.offsetHeight/2-11 - Math.abs(segment.y1 - segment.y2)/2, 0);
					this.setOverlayTransformation(arrow.getElement(), (-1/2)*arrow.getElement().width, (-1)*labelElement.offsetHeight-9 - Math.abs(segment.y1 - segment.y2)/2, angle);
				}
				// When segment is vertical
				else{
					
					var angle = (-1)*Math.PI/2;				
					if(pSource.y <= pTarget.y){
						angle *= -1;
					}
					 
					this.setOverlayTransformation(labelElement, 22 + Math.abs(segment.x1 - segment.x2)/2, (-1)*labelElement.offsetHeight/2, 0);
					this.setOverlayTransformation(arrow.getElement(), -6 + Math.abs(segment.x1 - segment.x2)/2, (-1/2)*arrow.getElement().height, angle);			 
				}
			}
			
			// Hide arrow if the description is empty. 
			// Occurs only on conventional association.
			if(label.getLabel() == ""){
				label.hide();
				arrow.hide();
			}
			else {
				label.show();
				arrow.show();
			}
		}
		else if(type == "arc-network"){
			
			// Set anchors position
			this.repaintNetworkAnchors(connection);
			
			// Bounding box of the connection used to calculate the angle.
			var bBox = connection.getConnector().path.getBoundingClientRect();
			
			// Calculates the angle formed by the connection to rotate the label.			
			var rad = Math.asin((bBox.bottom - bBox.top) / Math.sqrt( (bBox.bottom - bBox.top) * (bBox.bottom - bBox.top) + (bBox.left - bBox.right) * (bBox.left - bBox.right) ));
						
			// Get distance between the connection and its sibling.
			var dist = this.getDistanceBetweenElements(connection.getConnector().path, connection.getParameter('sibling').getConnector().path);	
						
			// Get position of the endpoints to identify the quadrant formed by the angle of the connection and the elements.
			var x1 = parseInt(connection.endpoints[0].element.style.left.replace("px", ""));
			var y1 = parseInt(connection.endpoints[0].element.style.top.replace("px", ""));
			var x2 = parseInt(connection.endpoints[1].element.style.left.replace("px", ""));
			var y2 = parseInt(connection.endpoints[1].element.style.top.replace("px", ""));
				
			var label = connection.getOverlay("description-label").getElement();
						
			if (x1 <= x2 && y1 >= y2) {	
				
				var beta = Math.PI/2 - rad;
				
				var a = 0 - label.offsetWidth/2 - Math.cos(beta)*dist/2;
				var b = 0 - label.offsetHeight/2 - Math.sin(beta)*dist/2;
								
				this.setOverlayTransformation(label, a, b, -1*rad);				
				
			} else if (x1 <= x2 && y1 < y2) {
				
				var beta = Math.PI/2 - (-1)*rad;
				
				var a = 0 - label.offsetWidth/2 - Math.cos(beta)*dist/2;
				var b = 0 - label.offsetHeight/2 - Math.sin(beta)*dist/2;
								
				this.setOverlayTransformation(label, a, b, rad);	
				
			} else if (x1 > x2 && y1 < y2) {

				var beta = Math.PI/2 - rad;
				
				var a = 0 - label.offsetWidth/2 + Math.cos(beta)*dist/2;
				var b = 0 - label.offsetHeight/2 + Math.sin(beta)*dist/2;
								
				this.setOverlayTransformation(label, a, b, -1*rad);
				
			} else {

				var beta = Math.PI/2 - rad;
				
				var a = 0 - label.offsetWidth/2 - Math.cos(beta)*dist/2;
				var b = 0 - label.offsetHeight/2 + Math.sin(beta)*dist/2;
								
				this.setOverlayTransformation(label, a, b, rad);				
			} 			
		}
	},
	
	repaintNetworkAnchors : function(connection){
		
		var type = connection.getType();
		
		if( type == "arc-network"){
			
			// get diagram size
			var sourceWidth = connection.source.getBoundingClientRect().width;
			var sourceHeight = connection.source.getBoundingClientRect().height;
			var targetWidth = connection.target.getBoundingClientRect().width;
			var targetHeight = connection.target.getBoundingClientRect().height;
			
			var sx = this.NETWORK_DIST/sourceWidth;
			var sy = this.NETWORK_DIST/sourceHeight;
			var tx = this.NETWORK_DIST/targetWidth;
			var ty = this.NETWORK_DIST/targetHeight;				

			var sibling = connection.getParameter("sibling");
			
			connection.endpoints[0].setAnchor([ [ 0.5 + sx, 0, 0, -1 ], [ 1, 0.5 + sy, 1, 0 ], [ 0.5 - sx, 1, 0, 1 ], [ 0, 0.5 - sy, -1, 0 ] ]);			
			connection.endpoints[1].setAnchor([ [ 0.5 - tx, 0, 0, -1 ], [ 1, 0.5 - ty, 1, 0 ], [ 0.5 + tx, 1, 0, 1 ], [ 0, 0.5 + ty, -1, 0 ] ]);			
			sibling.endpoints[0].setAnchor([ [ 0.5 - sx, 0, 0, -1 ], [ 1, 0.5 - sy, 1, 0 ], [ 0.5 + sx, 1, 0, 1 ], [ 0, 0.5 + sy, -1, 0 ] ]);
			sibling.endpoints[1].setAnchor([ [ 0.5 + tx, 0, 0, -1 ], [ 1, 0.5 + ty, 1, 0 ], [ 0.5 - tx, 1, 0, 1 ], [ 0, 0.5 - ty, -1, 0 ] ]);			
		}
	},
	
	repaintAllAnchors : function(){

		var connections = app.plumb.getConnections();
		
		for(var i=0; i<connections.length; i++){
			if(connections[i].getType() == "arc-network"){
				this.repaintNetworkAnchors(connections[i]);
			}
		}
	},
	
	repaintAllLabels : function(){
		
		var connections = app.plumb.getConnections();
		for(var i=0; i<connections.length; i++){
			this.updateLabelsPosition(connections[i]);
		}
	}
};
'use strict';

app.XMLParser = {

	parseOMTGSchema : function(xml) {

		// Suspend jsPlumb Drawing
		app.plumb.setSuspendDrawing(true);	

		var domParser = new DOMParser();
		var xmlDoc = domParser.parseFromString (xml, "text/xml");

		// Restore project name if present in XML
		var projectNameEls = xmlDoc.getElementsByTagName("project-name");
		if (projectNameEls.length > 0 && projectNameEls[0].firstChild) {
			var name = projectNameEls[0].firstChild.nodeValue;
			app.canvas.set('projectName', name);
			$('#projectNameInput').val(name);
			document.title = name ? name + ' \u2013 OMT-G Designer' : 'OMT-G Designer';
		}

		// Maps diagrams names into diagrams ids
		this.diagramMap = {};

		// Gets from XML the diagrams and connections
		var diagrams = xmlDoc.getElementsByTagName("classes")[0].childNodes;
		var connections = xmlDoc.getElementsByTagName("relationships")[0].childNodes;				

		// Parse and adds to the canvas the diagrams and connections
		this.parseOMTGDiagrams(diagrams);
		this.parseOMTGConnections(connections);

		// Enable jsPlumb Drawing
		app.plumb.setSuspendDrawing(false, true);	
		
		// Adjust labels
		app.plumbUtils.repaintAllAnchors();
		app.plumbUtils.repaintAllLabels();
	},
	
	parseOMTGDiagrams : function(elements) {
		for ( var i = 0; i < elements.length; i++) {
			var node = elements.item(i);
			var diagram = this.parseOMTGDiagram(node);
			
			app.canvas.get('diagrams').add(diagram);
		}	
	},
	
	parseOMTGDiagram : function(element) {
		var children = element.childNodes;
		var diagram = new app.omtg.Diagram();

		for ( var i = 0; i < children.length; i++) {
			switch (children.item(i).nodeName) {
			case "name":
				diagram.set('name', children.item(i).firstChild.nodeValue);
				break;
			case "top":
				diagram.set('top', parseFloat(children.item(i).firstChild.nodeValue));
				break;
			case "left":
				diagram.set('left', parseFloat(children.item(i).firstChild.nodeValue));
				break;
			case "type":
				diagram.set('type', children.item(i).firstChild.nodeValue);
				break;
			case "attributes":
				diagram.set('attributes', this.parseOMTGAttributes(children.item(i)));
				break;
			};
		}
		
		this.diagramMap[diagram.get('name')] = diagram.get('id');
		
		return diagram;
	},
	
	parseOMTGAttributes : function(element) {
		var children = element.childNodes;	
		var attributes = new app.omtg.Attributes();
		
		for ( var i = 0; i < children.length; i++) {
			var attribute = this.parseOMTGAttribute(children.item(i));
			attributes.add(attribute);
		}
		
		return attributes;
	},
	
	parseOMTGAttribute : function(element) {
		var children = element.childNodes;
		var attribute = new app.omtg.Attribute();
		
		for ( var i = 0; i < children.length; i++) {	
			switch(children.item(i).nodeName){
			case "id":
				attribute.set('id', children.item(i).firstChild.nodeValue);
				break;
			case "name":
				attribute.set('name', children.item(i).firstChild.nodeValue);
				break;
			case "type":
				attribute.set('type', children.item(i).firstChild.nodeValue);
				break;
			case "default":
				attribute.set('defaultValue', children.item(i).firstChild.nodeValue);
				break;
			case "key":
				attribute.set('isKey', children.item(i).firstChild.nodeValue);
				break;
			case "length":
				attribute.set('length', children.item(i).firstChild.nodeValue);
				break;
			case "scale":
				attribute.set('scale', children.item(i).firstChild.nodeValue);
				break;
			case "size":
				attribute.set('size', children.item(i).firstChild.nodeValue);
				break;
			case "not-null":
				attribute.set('isNotNull', children.item(i).firstChild.nodeValue);
				break;
			case "domain":
				attribute.set('domain', this.parseOMTGAttributeDomain(children.item(i)));
				break;
			}
		}	

		return attribute;
	},
	
	parseOMTGAttributeDomain : function(element){
		//TODO: implement domain
		return null;
	},
	
	parseOMTGConnections : function(elements) {
		for ( var i = 0; i < elements.length; i++) {
			var node = elements.item(i);
			this.parseOMTGConnection(node);
		}	
	},
	
	parseOMTGConnection : function(element) {
		
		switch(element.nodeName){
		case "conventional":
			var description = this.getValue(element.childNodes[0].firstChild);
			var sourceName = element.childNodes[1].firstChild.nodeValue;
			var targetName = element.childNodes[3].firstChild.nodeValue;
			var cardinalityA = element.childNodes[2];
			var cardinalityB = element.childNodes[4];
			
			var connection;
			
			if(sourceName == targetName){
				connection = app.plumb.connect({
					source: this.diagramMap[sourceName],
					target: this.diagramMap[targetName],
					anchors : [ [ 0, 0.6, -1, 0 ], [ 0.5, 1, 0, 1 ] ],
					fireEvent: false
				});
				connection.setConnector(["Flowchart", {stub: [50, 50], alwaysRespectStubs: true}]);
			}
			else{
				connection = app.plumb.connect({
					source: this.diagramMap[sourceName],
					target: this.diagramMap[targetName],
					fireEvent: false
				});
			}
			
			connection.setType('association');
						
			connection.getOverlay("description-label").setLabel(description);
			
			this.parseOMTGConnectionCardinality(cardinalityA, connection, 'A');
			this.parseOMTGConnectionCardinality(cardinalityB, connection, 'B');
						
			break;
			
		case "topological":			
			var spatialRelation = this.getValue(element.childNodes[0].firstChild.firstChild);
			var sourceName = element.childNodes[1].firstChild.nodeValue;
			var targetName = element.childNodes[3].firstChild.nodeValue;
			var cardinalityA = element.childNodes[2];
			var cardinalityB = element.childNodes[4];
			
			var connection = app.plumb.connect({
				source: this.diagramMap[sourceName],
				target: this.diagramMap[targetName],
				fireEvent: false
			});
			connection.setType('spatial-association');
			
			if(spatialRelation.toLowerCase() == 'near' || spatialRelation.toLowerCase() == 'distant'){
				var distance = this.getValue(element.childNodes[0].childNodes[1].firstChild);
				connection.setParameter("distance", distance);
				connection.getOverlay("description-label").setLabel(spatialRelation + ' (' + distance + ')');
			}
			else{
				connection.getOverlay("description-label").setLabel(spatialRelation);
			}
			
			this.parseOMTGConnectionCardinality(cardinalityA, connection, 'A');
			this.parseOMTGConnectionCardinality(cardinalityB, connection, 'B');
			
			break;
			
		case "conventional-aggregation":
			var sourceName = element.childNodes[0].firstChild.nodeValue;
			var targetName = element.childNodes[1].firstChild.nodeValue;
			
			var connection = app.plumb.connect({
				source: this.diagramMap[sourceName],
				target: this.diagramMap[targetName],
				fireEvent: false
			});			
			connection.setType('aggregation');
			
			break;
			
		case "spatial-aggregation":
			var sourceName = element.childNodes[0].firstChild.nodeValue;
			var targetName = element.childNodes[1].firstChild.nodeValue;
			
			var connection = app.plumb.connect({
				source: this.diagramMap[sourceName],
				target: this.diagramMap[targetName],
				fireEvent: false
			});		
			connection.setType('spatial-aggregation');
			
			break;
			
		case "network":
			var description = this.getValue(element.childNodes[0].firstChild);
			var sourceName = element.childNodes[1].firstChild.nodeValue;
			var targetName = element.childNodes[2].firstChild.nodeValue;
			var type = "arc-network";
			var typeSibling = "arc-network-sibling";	
			var anchors = ["Continuous", "Continuous"];
			var anchorsSibling = ["Continuous", "Continuous"];
			var connnectionConnector = "Straight";
			var siblingConnector = "Straight";
			
			if(sourceName == targetName){
				type = "arc-network-self";
				typeSibling = "arc-network-sibling-self";
				anchors = [ [ 0.35, 1, 0, 1 ], [ 1, 0.5, 1, 0 ] ];
				anchorsSibling = [ [ 0.5, 1, 0, 1 ], [ 1, 0.75, 1, 0 ] ];
				connnectionConnector = ["Flowchart", {stub: [50, 50], alwaysRespectStubs: true}];
				siblingConnector = ["Flowchart", {stub: [25, 25], alwaysRespectStubs: true}];
			}
			
			var connection = app.plumb.connect({
				source : this.diagramMap[sourceName],
				target : this.diagramMap[targetName],
				anchors : anchors,
				fireEvent : false
			});
			connection.setConnector(connnectionConnector);
			connection.setType(type);
			connection.getOverlay("description-label").setLabel(description);			
			
			var sibling = app.plumb.connect({
				source : this.diagramMap[sourceName],
				target : this.diagramMap[targetName],
				anchors : anchorsSibling,
				fireEvent : false
			});
			sibling.setConnector(siblingConnector);	
			sibling.setType(typeSibling);
			
			// set parameters			
			connection.setParameter("sibling", sibling);
			sibling.setParameter("sibling", connection);
			
			break;
			
		case "conceptual-generalization":
			var sourceName = element.childNodes[0].firstChild.nodeValue;
			var disjointness = element.childNodes[2].firstChild.nodeValue;
			var targetName = element.childNodes[3].childNodes[0].firstChild.nodeValue;
			var subDiagrams = element.childNodes[3].childNodes;
						
			var connection = app.plumb.connect({
				source: this.diagramMap[sourceName],
				target: this.diagramMap[targetName],
				anchors : [ "Bottom", "Top" ],
				fireEvent: false
			});
			connection.setConnector(["Flowchart", {stub: [70, 50], alwaysRespectStubs: true}]);
			connection.setType('cartographic-generalization-' + disjointness);
			
			// Make the middle square of the connection a source of connections
			var square = connection.getOverlay("cartographic-square").getElement();
			app.plumb.makeSource(square, {
				anchor:[ "Right", "Left" ]
			});
			
			for(var i=1; i<subDiagrams.length; i++){
				var c = app.plumb.connect({
					source: square,
					target: this.diagramMap[subDiagrams[i].firstChild.nodeValue],
					fireEvent: false
				});
				c.endpoints[1].setAnchor("Top");
				c.setConnector(["Flowchart", {stub: [0, 50], alwaysRespectStubs: true}]);
				c.setType("cartographic-leg");
			}
			
			break;
			
		case "generalization":
			var sourceName = element.childNodes[0].firstChild.nodeValue;
			var participation = element.childNodes[1].firstChild.nodeValue;
			var disjointness = element.childNodes[2].firstChild.nodeValue;
			var subDiagrams = element.childNodes[3].childNodes;
			var type = "generalization-" + disjointness + "-" + participation;
			
			// Duplicated function of the plumb.js.
			// TODO: crate a global function
			var triangleEndpoint = function(type){ 
				if(type == "generalization-disjoint-partial")
					return ["Image", {src:"imgs/omtg/triangle-white.png", cssClass:"triangle-endpoint"}];
				if(type == "generalization-overlapping-partial")
					return ["Image", {src:"imgs/omtg/triangle-black.png", cssClass:"triangle-endpoint"}];
				if(type == "generalization-disjoint-total")
					return ["Image", {src:"imgs/omtg/triangle-circle-white.png", cssClass:"triangle-endpoint"}];
				if(type == "generalization-overlapping-total")
					return ["Image", {src:"imgs/omtg/triangle-circle-black.png", cssClass:"triangle-endpoint"}];
			};
			
			// Duplicated function of the plumb.js.
			// TODO: crate a global function
			var generalizationEndpointAnchor = function(type){
				if(type == "total")
					return [ 0.5, 1, 0, 1, 0, 20 ];
				else
					return [ 0.5, 1, 0, 1, 0, 11 ];
			}
			
			var endpoint = app.plumb.addEndpoint(this.diagramMap[sourceName], {
				anchor : generalizationEndpointAnchor(participation), 
				connectionType : "generalization-leg",
				endpoint : triangleEndpoint(type),
				isSource : true,
				isTarget : false,
				maxConnections : -1,
				uniqueEndpoint : true,				
				parameters:{
					"participation": participation,
					"disjointness": disjointness,
			    }
			});
			
			for(var i=0; i<subDiagrams.length; i++){
				var c = app.plumb.connect({
					source: endpoint,
					anchors : [ "Bottom", "Top" ],
					target: this.diagramMap[subDiagrams[i].firstChild.nodeValue],
					fireEvent : false
				});
				if(i==0){
					c.setType(type);
				}
				else{
					c.setType("generalization-leg");
				}
				c.setConnector(["Flowchart", {stub: [50, 30], alwaysRespectStubs: true}]);
			}
			
			break;
		}
	},
	
	parseOMTGConnectionCardinality : function(element, connection, side){
		
		if(side != 'A' && side != 'B')
			return;
		
		var min = "", max = "", str = "";
		
		min = this.getValue(element.childNodes[0].firstChild);		
		max = this.getValue(element.childNodes[1].firstChild);
		
		// This code is equal to connection editor view. 
		// It will be better to create a model for connection and the view to process the model.
		min = min >= 0 && min != ""  ? min : '0';
		max = max >= 1 && max != "" && min <= max ? max : '*';
		
		if(min == max){
			str = min;
		}
		else{
			str = min + ".." + max;
		}

		connection.getOverlay("cardinality-label" + side).setLabel(str);	
		
		connection.setParameter("min" + side, min);
		connection.setParameter("max" + side, max);
	},
	
	getValue : function(p) {
		if (p)
			return p.nodeValue;
		else
			return "";
	},
};
