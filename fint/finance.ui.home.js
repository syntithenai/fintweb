FintUI.importData='';

FintUI.initFunctions.home=function()  {
	console.log('init home');
	//$('#homeimportstatus .message').html('Last Updated: ');
	// MESSAGES
	$('#homeimportstatus .message').html(finance.home.updateStatusMessages());
	$('#homeimportstatus .message').click(function ()  {
		$('#homeimportstatus .message').html(finance.home.updateStatusMessages());
		return false;
	});
	// HOMESCREEN WIDGETS
	$('.homewidget h3').click(function() {
		finance.home.toggleHomeWidget(this);
	});
	$('#content').tabs('load',4);
	// preload help ??
	//$("#homerightcol").accordion();
	// one click import sample data
	$('#homeimportsomedata').click(function() {
		//$('#content').tabs({load : function(){alert('activs'); }});
		$('#content').tabs('option','active','4');
		$('#sharemanager').tabs('option','active','1');
		console.log('ALLRECS',$('#allrecordsjson').val());
		$('#importtext').val($('#allrecordsjson').val());
		$('#importtext').keyup();
	});
}

/*
//QUERIES
// nested tags
SELECT t.name tn,tp.name tpn,tpp.name tppn,tp.name||t.name tr FROM tags t LEFT JOIN tags tp ON tp.rowid=t.parenttags LEFT JOIN tags tpp on tpp.rowid=tp.parenttags

create index accounts.index on accounts (


create index "16.i_tags" on mm_transactionstags (tags);
create index "16.i_tags" on mm_transactionstags (transactions);
create index "16.i_transactionstags" on mm_transactionstags (transactions,tags);

create index "16.i_rulestags" on rules (tags);
create index "16.i_rulesaccounts" on rules (accounts);
create index "16.i_rulesaccountstags" on rules (accounts,tags);

create index "16.i_tagsparenttags" on tags (parenttags);
create index "16.i_accountsbanks" on accounts (banks);


create index fintfinance.i_accounts on mm_transactionstags (accounts); 
create index quickdb.i_tags on mm_transactionstags (tags);
--drop index "16.i_transactions";
--drop index "16.i_tags";
--drop index "16.i_transactionstags";
create index "16.i_transactions" on mm_transactionstags (transactions); 
create index "16.i_tags" on mm_transactionstags (tags);
create index "16.i_transactionstags" on mm_transactionstags (transactions,tags);

create index "16.i_rulestags" on rules (tags);
create index "16.i_rulesaccounts" on rules (accounts);
create index "16.i_rulesaccountstags" on rules (accounts,tags);

create index "16.i_tagsparenttags" on tags (parenttags);
create index "16.i_accountsbanks" on accounts (banks);
*/



FintUI.activateFunctions.home=function(settings)  {
	console.log('activate home');

	// MESSAGES
	$('#homeimportstatus .message').html(finance.home.updateStatusMessages());
	$('#homeimportstatus .message').click(function ()  {
		$('#homeimportstatus .message').html(finance.home.updateStatusMessages());
		return false;
	});
	// HOMESCREEN WIDGETS
	$('.homewidget h3').click(function() {
		finance.home.toggleHomeWidget(this);
	});
	
	$('#homeimportsomedata').click(function() {
		//$('#content').tabs({load : function(){alert('activs'); }});
		$('#content').tabs('option','active','4');
		$('#sharemanager').tabs('option','active','1');
		$('#importtext').val('{"rules":[],"tags":[{"rowid":1,"name":"income","parenttags":""},{"rowid":2,"name":"personal income","parenttags":"1"},{"rowid":3,"name":"taxable income","parenttags":"1"}],"ebankingsites":[],"banks":[{"rowid":1,"name":"anz","logo":null},{"rowid":2,"name":"commonwealth","logo":null}],"accounts":[{"rowid":1,"name":"saver","number":"987987987","banks":"2","ebankingsites":null},{"rowid":2,"name":"saver","number":"8768768767","banks":"1","ebankingsites":null}],"transactions":[{"rowid":1,"date":"2013-03-13","description":"COLES SUPERMARKETS","amount":"76.66","balance":"","split":"","comment":"","accounts":"1","tags":""},{"rowid":2,"date":"2013-12-31","description":"DICK SMITH ELECTRONICS 9789888","amount":"278.00","balance":"","split":"","comment":"","accounts":"2","tags":""},{"rowid":3,"date":"2013-12-27","description":"BP PETROLEUM 76877768777","amount":"77.00","balance":"","split":"","comment":"","accounts":"1","tags":""}]}');
		$('#importtext').keyup();
	});
	//console.log('activate home');
	//console.log('scroll top');
	//var plugin=$('#hometransactionmanagersearch').quickDB(settings)[0];
	$(document).scrollTop(0);
}
// transaction manager searcher and main list
FintUI.initFunctions.hometransactionmanagersearch=function(settings)  {
console.log('init hometransactionmanagersearch');
	var plugin=$('#hometransactionmanagersearch').quickDB(settings)[0];
	plugin.settings.templates.listRow = "<tr><td><input type='checkbox' checked class='listrowcheckbox'  data-rowid='${rowid}' />${listButtons.edit}${listButtons.delete}</td>${listFields}<td>${listButtons.approve}${listButtons.tag}${listButtons.rule}${listButtons.split}</td></tr>";
	plugin.settings.templates.listHeaders = "<tr><th><input type='checkbox' checked class='listrowtoggleall'/>${listHeaderButtons.add}</th>${listHeaders}<th>${listHeaderButtons.approveselected}${listHeaderButtons.tagselected}${listHeaderButtons.rulefromselected}${listHeaderButtons.splitrulefromselected}</th></tr>";
	plugin.settings.templates.listCollateItemWrap = "<div ><h3><input type='checkbox' checked class='listrowtogglecollated'/>${collateValue}</h3>${list}</div>";
	plugin.settings.templates.listCollateBy='accounts';
	$.extend(plugin.settings.templates.listButtons,{
		"approve":"<img src='images/tick.png' title='Approve record ID ${rowid}' />",// markers - <row values>
		"rule":"<img  src='images/things.png' title='Create rule from record ID ${rowid}' />",
		"split":"<img src='images/split.png' title='Split record ID ${rowid}' />",// markers - <row values>
		"tag":"<img src='images/tag.png' title='Tag record ID ${rowid}' />"// markers - <row values>
	});
	$.extend(plugin.settings.templates.listHeaderButtons,{
		"approveselected":"<img style='dispjlay:none;' src='images/tick.png' title='Approve selected records' />",// markers - <row values>
		"rulefromselected":"<img  src='images/things.png' title='Create rule from selected records' />",
		"splitrulefromselected":"<img src='images/split.png' title='Split rule from selected records' />",
		"tagselected":"<img src='images/tag.png' title='Tag selected' />"
	});
	
	// WHEN THE ACCOUNTS MANAGER CHECK SELECTIONS CHANGE, UPDATE MY LIST
	plugin.api.view.renderListFinalCallback=function() {
		//var plugin=this;
		// MUNGE LIST TAGS
		//transactions.rowid in (select rowid from transactions where description match ruleswithtags.filtertext)  left join tags ruletags on ruletags.rowid=ruleswithtags.tags
		
		$(".editablerecords .row-odd,.editablerecords .row-even").each(function() {
			var thisRow=this;
			//console.log($('.list-field-description',this).text());
			//var query="select rules.rowid,rules.name,tags.name from rules left join tags on tags.rowid=rules.tags where '"+$('.list-field-description',this).text()+"' match rules.filtertext ";
			//console.log(query);
			setTimeout(function() {
				//console.log('do timeout');
			//return;
				var combinedTags={};
				$.each($('.list-field-selectedtags .join-value',thisRow),function() {
					if (!combinedTags[$(this).data('join-rowid')]) combinedTags[$(this).data('join-rowid')]={}; 
					combinedTags[$(this).data('join-rowid')].label=$(this).text();
					combinedTags[$(this).data('join-rowid')].selected=true;
					combinedTags[$(this).data('join-rowid')].selectedText=' selected ';
					//$(this).remove();
					//console.log('ROWID',$(this).data('join-rowid'));
				});
				$.each($('.list-field-ruleswithtags .join-value',thisRow),function() {
					if (!combinedTags[$(this).data('join-rowid')]) combinedTags[$(this).data('join-rowid')]={selectedText:'',suggestedText:''}; 
					combinedTags[$(this).data('join-rowid')].label=$(this).text();
					combinedTags[$(this).data('join-rowid')].suggested=true;
					combinedTags[$(this).data('join-rowid')].suggestedText=' suggested ';
					//console.log('ROWIDrules',$(this).data('join-rowid'));
				});
				var finalTags=[];
			//	console.log('combinedTags',combinedTags);
				$.each(combinedTags,function(tagId,tagMeta) {
					//console.log('renTAGS',tagId,tagMeta);
					var buttons=[];
					if (tagMeta.suggested && !tagMeta.selected) {
						buttons.push("<img src='images/tick.png' class='approvetagbutton' title='Approve Tag' />");
					} else if (tagMeta.selected) {
						buttons.push("<img src='images/deleterecord.png' class='removetagbutton' title='Deselect Tag' />")
					}
					//console.log('buttons',buttons);
					finalTags.push('<span class="join-value'+tagMeta.selectedText+tagMeta.suggestedText+'" data-join-rowid="'+tagId+'">'+tagMeta.label+buttons.join("")+'</span>');
				});
				//if (finalTags.length>0) console.log('finalTags',finalTags);
				//else console.log('notags');
				$('.list-field-selectedtags',thisRow).html(finalTags.join(""));
				$('.list-field-ruleswithtags').hide();
				$('.list-field-status').hide();
			},10);
		});
		finance.home.bindHomeTransactionListButtons(plugin);
	}
	//$('#sharebutton').bind('click',function() {$('#sharemenu').menu().toggle(); return false;});
	//$('#optionsbutton').bind('click',function() {$('#optionsmenu').menu().toggle(); return false;});
};

FintUI.activateFunctions.hometransactionmanagersearch=function(settings)  {
	console.log('activate hometransactionmanagersearch');
	var plugin=$('#hometransactionmanagersearch').quickDB(settings)[0];
	$(document).scrollTop(0);
}
// accounts manager tab
FintUI.initFunctions.homeaccountsmanager=function(settings)  {
	console.log('init homeaccountsmanager',settings);
	var plugin=$('#homeaccountsmanager').quickDB(settings)[0];
	plugin.settings.formTarget=$('#homemaincol');
	plugin.settings.templates.listRow = "<tr><td><input type='checkbox' checked  class='listrowcheckbox' data-rowid='${rowid}' />${listButtons}</td>${listFields}</tr>";
	plugin.settings.templates.listHeaders = "<tr><th><input type='checkbox' checked  class='listrowtoggleall'/>${listHeaderButtons}</th>${listHeaders}</tr>";
	plugin.settings.templates.listCollateItemWrap = "<div ><h3><input type='checkbox' checked  class='listrowtogglecollated'/>${collateValue}</h3>${list}</div>";
	plugin.settings.templates.listCollateBy='banks';
	plugin.api.view.renderListFinalCallback=function() {
		$("#homeaccountsmanager input[type=checkbox]").prop("checked",false);
		$("#homeaccountsmanager .collatedlistrows").hide();
		finance.home.bindAccountsCheckboxes(plugin);
		//console.log('pluginsettings',plugin.settings)
	};
};
//FintUI.pluginSettings.homecategoriesmanager={templates:{listAddButton:"<a><img src='images/addrecord.png' />&nbsp;Add Stuff</a>"}};	
FintUI.activateFunctions.homeaccountsmanager=function(settings)  {
	console.log('activate homeaccountsmanager',settings);
	var plugin=$('#homeaccountsmanager').quickDB(settings)[0];
	$(document).scrollTop(0);
}

// categories manager tab
FintUI.initFunctions.homecategoriesmanager=function(settings)  {
	console.log('init homecategoriesmanager');
	var plugin=$('#homecategoriesmanager').quickDB(settings)[0];
	plugin.settings.formTarget=$('#homemaincol');
	plugin.settings.templates.listRow = "<tr><td><input type='checkbox' checked class='listrowcheckbox'  data-rowid='${rowid}' />${listButtons}</td>${listFields}</tr>";
	plugin.settings.templates.listHeaders = "<tr><th><input type='checkbox' checked class='listrowtoggleall'/>${listHeaderButtons}</th>${listHeaders}</tr>";
	plugin.settings.templates.listCollateItemWrap = "<div ><h3><input type='checkbox' checked class='listrowtogglecollated'/>${collateValue}</h3>${list}</div>";
	plugin.settings.templates.listCollateBy='parenttags';
	plugin.api.view.renderListFinalCallback=function() {
		//alert('renderlist');
	}
};
FintUI.activateFunctions.homecategoriesmanager=function(settings)  {
	console.log('activate homecategoriesmanager');
	var plugin=$('#homecategoriesmanager').quickDB(settings)[0];
	$(document).scrollTop(0);
}
