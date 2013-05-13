/*******************************************
 * This script is the initialisation of the main FINT user interface.
 * Each tab needs to be initialised and then renewed each time it is focused/activated
 * The tabs are initialised when the script first runs
 * The functions in the object activateFunctions provide activation code
 * keyed to each tab id which is run at initialisation and each subsequent focus
 *
 * For the most part the quickDB library is used to generate the user interface
 * The script provides configuration options to tweak the default quickDB behavior eg categorisemanager
*******************************************/

$(document).ready(function() {
	FintUI.doInit($('#content')[0]);
	// IMPORT DEFAULT VALUES
	//$('#categoriesmanager').quickDB('saveRecords','categories',{'rowid':'UID','description':'Description','parent':'Parent'},FintDefaults.categories);
	//$('#rulesmanager').quickDB('saveRecords','rules',{'rowid':'UID','rule':'Rule','category':'Category'},FintDefaults.rules);	
	//$('#accountsmanager').quickDB('saveRecords','accounts',{'rowid':'UID','description':'Category','accountnumber':'Account Number'},FintDefaults.accounts);	


});


FintUI={
	qdbSettings:{dbShortName:'fintfinance'},
	tabSettings:{'active':0,
		// cache
		'beforeLoad': function( event, ui ) {
			if ( ui.tab.data( "loaded" )) {
				event.preventDefault();
				return;
			}
			ui.jqXHR.success(function() {
				ui.tab.data( "loaded", true );
			});
		},
		'load':function(event,ui) {FintUI.initFunction(event,ui)},
		'activate':function(container,depth) {FintUI.activateFunction(container,depth)}
	},
    // added to in modules
	pluginSettings:{},
	initFunctions:{
		'content':function(settings) {
			//$.extend(FintUI.tabSettings);
			$('#content').tabs(FintUI.tabSettings);
		}
	},
	activateFunctions:{
	},

	
	// functions
	// initfunction is called when a tab is loaded
	// it seeks activatable dom elements with an id that is keyed in the initFunctions object 
	initFunction: function(event,ui) {
		if (ui.panel) {
		//console.log('initfunc on'+ui.panel.id);
		//console.log(ui);
		//console.log(ui.panel);
		//console.log($('.activatable',ui.panel));
		//var newActiveTab=ui.panel;
		//console.log(newActiveTab);
			FintUI.doInit(ui.panel); //$('.activatable',
		}
	},
	doInit : function(container,depth) {
		if (!depth) depth=0;
		//console.log('do initfunction');
		//console.log(container.id);
		//console.log(container);
		//console.log(initOn);
		var initSettings={};
		if (container && container.id) {
			// settings for container
			if (container.id && FintUI.pluginSettings[container.id]) {
				$.extend(true,initSettings,FintUI.qdbSettings,FintUI.pluginSettings[container.id]);
			} else {
				$.extend(true,initSettings,FintUI.qdbSettings);	
			}
			// init functions for container
			if (container.id && $.isFunction(FintUI.initFunctions[container.id])) {
					//sconsole.log('call init on '+container.id);
					FintUI.initFunctions[container.id](initSettings);
			}
			// recurse into child activatables (for one level of depth)
			$(".activatable",container).each(function(key,newActiveChildTabId) {
				//console.log('child initable');
				//console.log(newActiveChildTabId.id);
				if (depth<1) {
					var a=depth+1;
					FintUI.doInit(newActiveChildTabId,a);			
				} else {
					//console.log('limiting recursion to 1');	
				}
			});
		}
	},
	activateFunction: function(event,ui) {
	//console.log('ACTIVATEFUNCTION',ui);
		if (ui.newPanel) {
			//console.log('ACTIVATEFUNCTION',ui.newPanel)
			FintUI.doActivate(ui.newPanel); //$('.activatable',
		}
	},
	doActivate : function(container,depth) {
		if (!depth) depth=0;
		//console.log('doActivate function',$(container).prop('id'),container);
		//console.log('TEStS',container,container.id);
		//console.log(initOn);
		var initSettings={};
		if (container && $(container).prop('id')) {
			// settings for container
			if ($(container).prop('id') && FintUI.pluginSettings[$(container).prop('id')]) {
				$.extend(true,initSettings,FintUI.qdbSettings,FintUI.pluginSettings[$(container).prop('id')]);
			} else {
				$.extend(true,initSettings,FintUI.qdbSettings);	
			}
			// activate functions for container
			//console.log('TRY call activate on '+$(container).prop('id'));
			if ($(container).prop('id') && $.isFunction(FintUI.activateFunctions[$(container).prop('id')])) {
					//console.log('call activate on '+$(container).prop('id'));
					FintUI.activateFunctions[$(container).prop('id')](initSettings);
			}
			// recurse into child activatables (for one level of depth)
			// if there are child tabs, only search in the visible tab
			var searchIn=$(container);
			if ($('.ui-tabs-panel',container).length>0) {
				//console.log('SEARCH IN CONTAINER');
				searchIn=$('.ui-tabs-panel:visible',container);
			} 
			// allow for panel as activatable
			if (searchIn.hasClass('activatable')) {
				if ($(searchIn).prop('id') && $.isFunction(FintUI.activateFunctions[$(searchIn).prop('id')])) {
					//console.log('call inner activate on '+$(searchIn).prop('id'));
					FintUI.activateFunctions[$(searchIn).prop('id')](initSettings);
				}
			}
			console.log('TRY SEARCH IN 	child activatable',searchIn);
			$(".activatable",searchIn).each(function(key,newActiveChildTabId) {
				//console.log('child activatable',newActiveChildTabId.id);
				if (depth<1) {
					var a=depth+1;
					FintUI.doActivate(newActiveChildTabId,a);			
				} else {
					//console.log('limiting recursion to 1');	
				}
			});
		}
	},
	
	
	
	
	
	
	/*
	// WHEN ACTIVATE FUNCTION IS CALLED, ALL VISIBLE CHILDREN ARE UPDATED
	// only activate the tab that is visible in the content window
	// when clicking on a tab either
	//	- if there are child tabs activate visible child (at any tree depth)
	//	- otherwise call activate on this tab 	
	activateFunction : function(event,ui) {
		console.log('ACTIVATE',event,ui.newPanel,ui);
		var newActiveTab=ui.newPanel;
		// which tab
		//- 2nd level tab
		//	- call init on parent
		//	- call init on self
		//- top level tab
		//	- call init on self
		var visibleTabs=$("div.activatable:visible");
		var firstLevelTab=null;
		var secondLevelTab=null;
		console.log('visibleTabs');
		console.log(visibleTabs);
		$.each(visibleTabs,function(key,value) {
			var childVisibleTabs=$("div.activatable:visible",value);
			if (childVisibleTabs.length>0) {
				console.log(value.id+' have visibleTabs as children');
				firstLevelTab=value;	
			} else {
				console.log(value.id+' have no visibleTabs  as children');
				secondLevelTab=value;	
			}
		});
		// recurse
		FintUI.doActivate(newActiveTab);	
		$(".activatable:visible",newActiveTab).each(function(key,activatable) {
			FintUI.doActivate(activatable);	
		});
		//console.log(firstLevelTab);
		//console.log(secondLevelTab);
		
		FintUI.doActivate(firstLevelTab);	
		if (secondLevelTab) { 
			FintUI.doActivate(secondLevelTab);	
		} 
	
	},
	doActivate : function(newTab) {
		if (newTab) { 
			console.log('DO ACTIVATE',newTab.id,newTab);
			var initSettings={};
			if (newTab.id && FintUI.pluginSettings[newTab.id]) {
				$.extend(initSettings,FintUI.qdbSettings,FintUI.pluginSettings[newTab.id]);
			} else {
				$.extend(initSettings,FintUI.qdbSettings);	
			}
			if ($.isFunction(FintUI.activateFunctions[newTab.id])) {
				console.log('run activate' + newTab.id);
				//console.log(FintUI.activateFunctions[newTab.id]);
				FintUI.activateFunctions[newTab.id](initSettings);	
			}
		} else {
			//console.log('skip activate on empty Element');	
		} 	
	}
	*/
};

