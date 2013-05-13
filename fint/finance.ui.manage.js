// manage toplevel tab
FintUI.initFunctions.manage=function(settings)  {
	console.log('init manage');
	$('#manage').tabs($.extend(FintUI.tabSettings,{active:0}));
}
FintUI.activateFunctions.manage=function(settings)  {
	console.log('activate manage');
}

// categories manager tab
FintUI.initFunctions.categoriesmanager=function(settings)  {
	console.log('init categoriesmanager');
	$('#categoriesmanager').quickDB(settings);
};
FintUI.activateFunctions.categoriesmanager=function(settings)  {
	console.log('activate categoriesmanager');
	var plugin=$('#categoriesmanager').quickDB(settings)[0];
	$(document).scrollTop(0);
}
// rules manager tab
FintUI.initFunctions.rulesmanager=function(settings)  {
	console.log('init rulesmanager');
	$('#rulesmanager').quickDB(settings);
};
FintUI.activateFunctions.rulesmanager=function(settings)  {
	console.log('activate rulesmanager');
	var plugin=$('#rulesmanager').quickDB(settings)[0];
	$(document).scrollTop(0);
}
// EXTRAS
// INIT SUPPORT FUNCTIONS
function categoriseManagerInit() {}
function loadAccountsPicklist() {}
// categorise manager tab
FintUI.pluginSettings.categorisemanager={
	callbacks:{
		renderRecords:{
			rowCallback:function() {},
			finalCallback:function() {}
		}
	}
};
FintUI.initFunctions.categorisemanager=function(settings)  {
	categoriseManagerInit();
};
FintUI.activateFunctions.categorisemanager=function(settings)  {
	//console.log('activate categorisemanager');
}