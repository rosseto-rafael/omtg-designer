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