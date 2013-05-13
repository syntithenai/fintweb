FintUI.initFunctions.sharemanager=function(settings)  {
	$('#sharemanager').tabs($.extend(FintUI.tabSettings,{active:0}));
	var plugin=$('#importexportmanager').quickDB(settings)[0];
	$(plugin).hide();
	// populate accounts picklist
	//console.log('POP ACCOUTS PICKLIST');
	plugin.api.model.executeIteratorQuery('select rowid,label from accounts_label',[],function(row) {
		//console.log('row',row);
		$("#importtoaccount select").append('<option value="'+row.rowid+'">'+row.label+'</option>');
	});
	// populate data source divs picklist
	$('.importdatasource').each(function() {
		$("#importfromdata select").append('<option value="'+$(this).attr('id')+'">'+$(this).data('name')+'</option>');
	});
	$("#importfromdata select").change(function() {
		var dataId=$(this).val();
		$('#importtextarea textarea').val($('#'+dataId).val());
		$('#importtextarea textarea').keyup();
	});
	// EXPORT
	$('#sharemenu .shareexportbutton').bind('click',function() {plugin.api.model.exportData($(this).parent().data('format'),$(this).data('target'),'#sharemenu');  return false;});
	// IMPORT
	/*$('#importtextenabler').click(function() {
		$("textarea#importtext").show();
	});
	$('#importtextdisabler').click(function() {
		$("textarea#importtext").hide();
	});*/
	$('#importnowbutton').click(function() {
		try {
		doImport(false,$('#importtextarea textarea').val(),$('#importasselect').val(),$('#importtoselect').val());
		} catch (e) {console.log(e)};
		return false;
	});
	
	// TEXT IMPORT
	// test data and if valid show import button
	var textChangeTimeout=0;
	$('#importtext').keyup(function() {
		$('#importtextarea textarea').css('border','3px solid red');
		sendMessage('Validating ...','blue');
		clearTimeout(textChangeTimeout);
		textChangeTimeout=setTimeout(function () {
			doImport(true,$('#importtextarea textarea').val(),$('#importasselect').val(),$('#importtoselect').val());
			$('#importtextarea textarea').css('border','none');
		}, 500);
	});

	// FILE IMPORT
	// BROWSE
	$('#importsource input[type="file"]').bind('change',function (evt) {
		var files = evt.target.files; // FileList object
		if (files && files.length>0) {
			var output = [];
			for (var i = 0, f; f = files[i]; i++) {
				if (i<1) { // only the first file
					//var tmpFile={'name':f.name,'type':f.type,'size':f.size,'lastModifiedDate':f.lastModifiedDate}; 
					var reader = new FileReader();
					// Closure to capture the file information.
					reader.onload = (function(theFile) {
						return function(e) {
							$('#importtextarea textarea').val(e.target.result);
							doImport(true,e.target.result,$('#importasselect').val(),$('#importtoselect').val());
						};
					})(f);
					// Read in the file as a data URL.
					reader.readAsText(f);
				}
			}
		} 
	});
	// DROP
	function handleFileDrop(evt) {
		evt.stopPropagation();
		evt.preventDefault();
		var files = evt.dataTransfer.files; // FileList object.
		var output = [];
		for (var i = 0, f; f = files[i]; i++) {
			if (i<1) { // only the first file
				var reader = new FileReader();
				// Closure to capture the file information.
				reader.onload = (function(theFile) {
					return function(e) {
						$('#importtextarea textarea').val(e.target.result);
						doImport(true,e.target.result,$('#importasselect').val(),$('#importtoselect').val());
						//console.log('read',e.target.result);
						//console.log('convert',btoa(e.target.result),btoa(b64[1]));
					};
				})(f);
				// Read in the file as a data URL.
				reader.readAsText(f);
			}
		}
	}

  function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  }

  // Setup the dnd listeners.
  var dropZone = document.getElementById('content');
  dropZone.addEventListener('dragover', handleDragOver, false);
  dropZone.addEventListener('drop', handleFileDrop, false);
  
  function doImport(trial,text,format,table) {
	var message='';
	console.log('TRY IMPORT',format,table,text);
	var target='#savertransactions'; //'#importtextarea textarea'
	if (format=='anz') {
		if (trial) {
			//FintImportANZ().importNormalTransactions($('#savertransactions').val(),function(entry) {
			FintImportANZ().importNormalTransactions(text,function(entry) {
				// save transaction
				console.log('TRIAL anz IMPORT',entry);
			},function(results) {
				sendMessage('Ready to import '+results.importTally+' records','green');
				$('#importnowbutton').show();
				$('#importtrialresults').remove();
				$('#importnowbutton').after('<div id="importtrialresults" ><h3>Ignored</h3><textarea id="importignoredtext">'+results.ignored.join("\n")+'</textarea></div>');
			});
			
		} else {
			FintImportANZ().importNormalTransactions(text,function(entry) {
				// save transaction
				entry.accounts=$("#importtoaccount select").val();
				console.log('REALIMPORT',entry);
				plugin.api.model.saveRecords('transactions',[entry]);
				sendMessage('Successfully imported ANZ data','green');
				$('#importtrialresults').remove();
				$('#importnowbutton').hide();
			});
		}
	} else if (format=='anzcc') {
		if (trial) {
			//FintImportANZ().importNormalTransactions($('#savertransactions').val(),function(entry) {
			FintImportANZ().importCreditTransactions(text,function(entry) {
				// save transaction
				console.log('TRIAL cc IMPORT',entry);
			},function(results) {
				sendMessage('Ready to import '+results.importTally+' records','green');
				if(results.importTally>0) $('#importnowbutton').show();
				$('#importtrialresults').remove();
				$('#importnowbutton').after('<div id="importtrialresults" ><h3>Ignored</h3><textarea id="importignoredtext">'+results.ignored.join("\n")+'</textarea></div>');
			});
			
		} else {
			FintImportANZ().importNormalTransactions(text,function(entry) {
				// save transaction
				entry.accounts=$("#importtoaccount select").val();
				console.log('REALIMPORT',entry);
				plugin.api.model.saveRecords('transactions',[entry]);
				sendMessage('Successfully imported ANZ data','green');
				$('#importnowbutton').hide();
				$('#importtrialresults').remove();
			});
		}
	} else if (format=='json') { 
		//console.log('try json import');
		try {
			var data=JSON.parse(text);
			console.log('IMPORTE DATA JSON',data);
			if (trial) {
				var total=0;
				var count=0;
				$.each(data,function(key,value) {
					total+=value.length;
					count++;
				});
				sendMessage('Data format OK. Ready to import a total of '+total+' records into '+count+' tables','green');
				$('#importnowbutton').show();
			} else {
				var failedSave=false;
				//var goHomeTimeout=false;
				$.each(data,function(table,records) {
					if (records.length>0)  {
						plugin.api.model.saveRecords(table,records,
							// success
							function() {
								if (!failedSave) {
									sendMessage('Successfully imported JSON data','green');
								}
								$('#importnowbutton').hide();
								$('#importtrialresults').remove();
								//if (goHomeTimeout) clearTimeout(goHomeTimeout); 
								//goHomeTimeout=setTimeout(function() { clearTimeout(goHomeTimeout); alert('dohe'); $('#content').tabs('option','active','0');},2000)
							},
							// fail
							function() {
								sendMessage('Failed to save imported JSON data to '+table,'red');
								failedSave=true;
								$('#importnowbutton').hide();
							}
						)
					}
				});		
			}
		} catch (e) {
			if (true) console.log(e);
			sendMessage('Invalid format for JSON data','red');
			$('#importnowbutton').hide();
		}
	} else if (format=='sql') {

	} else if (format=='csv' || format=='tsv') {

	} else if (format=='anz') {
	}
	return message;
  }
  
  function sendMessage(message,color) {
	if (!color) color='red'; 
	$('#importmessage').html("<p style='display: inline; color:"+color+";' >"+message);
  }
  
  
  
}
FintUI.activateFunctions.sharemanager=function(settings)  {
	//console.log('activate manage',settings);
	//alert('aaa');
}
