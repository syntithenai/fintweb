/*
function importCSV(modelName,importText) {    
var records=jQuery.csv()($.trim(importText));
var fields=parser_extractFields(importText);
var recordCount=0;
sqldb.transaction (function (transaction) {
      $.each(records,function(recordkey,recordvalue) {
        // skip header row
        if (recordCount>0) { 
            var fieldInsertMarkers=[];
            var fieldData=[];
            var fieldList=[];
            var fieldPos=0;
            $.each(fields,function(fieldkey,fieldvalue) {
            	if (fieldkey!='uid') { 
                 fieldInsertMarkers.push('?');
                 fieldData.push(recordvalue[fieldPos]);
                 fieldList.push(fieldkey);
                 fieldPos++;
            	}
            });
            var fieldDefinition=fieldList.join(',');
            var fieldInsertMarkersString=fieldInsertMarkers.join(',');
            transaction.executeSql(sql_logQuery('INSERT INTO '+modelName+' ('+fieldDefinition + ') VALUES ('+fieldInsertMarkersString+');'), fieldData, storage_nullDataHandler, storage_errorHandler);
        }
        recordCount++;
    });
    sendMessage('Import Complete');
    setImportStatus('complete');
});


*/

function FintImportANZ() {
	function importCreditTransactions(from,rowCallback,finalCallback) {
		console.log('import credit transactions',from)
		var transactions=[];
		var importTally=0;
		var errorLines=[];
		var lines=from.split("\n") ;
		//console.log(lines);
		$.each(lines, function (key,value) {
			//console.log('value');
			//console.log(value);
			var fields=$.trim(value).split(" ");
			//console.log(fields);
			if (fields.length>4) {
				var entry={};
				entry.date=fields[0];	
				if (entry.date.split("/").length==3) {
					entry.date=standardiseAUDate(entry.date);	
					
					// CR
					entry.amount=fields[fields.length-2];
					entryAmountParts=entry.amount.split("CR");
					if (entryAmountParts.length>1) {
						//console.log('payment');
						//console.log(entryAmountParts);
						cleanAmount=entryAmountParts[0].replace(/[^\d\.\-\ ]/g, '');
						entry.amount=cleanAmount;
						//console.log(entry.amount);
					} else {
						entry.amount=-1*entry.amount.replace(/[^\d\.\-\ ]/g, '');	
					}
					entry.balance=fields[fields.length-1];
					entryAmountParts=entry.balance.split("CR");
					if (entryAmountParts.length>1) {
						//console.log('payment');
						//console.log(entryAmountParts);
						cleanAmount=entryAmountParts[0].replace(/[^\d\.\-\ ]/g, '');
						entry.balance= cleanAmount;
						//console.log(entry.amount);
					} else {
						entry.balance=-1*parseFloat(entry.balance.replace(/[^\d\.\-\ ]/g, ''));	
					}
					
					entry.description='';
					entry.description+=fields[3];
					for (i=4; i< (fields.length-2); i++) {
						entry.description+=' '+fields[i];
					}
					if (entry.date!=null && !isNaN(entry.amount) && !isNaN(entry.balance) && entry.description.length>0) {
						rowCallback(entry);
						transactions.push(entry);
						importTally++;
					} else {
						if ($.trim(value).length>0) errorLines.push(value);
					}
				}
			}
		});
		finalCallback({'importTally':importTally,'ignored':errorLines,'imported':transactions});
	}
	
	function importNormalTransactions(importText,rowCallback,finalCallback) {
	console.log('IMPORT NORMAL');
		var importTally=0;
		var errorLines=[];
		var entries=[];
		if (!$.isFunction(rowCallback)) {
			console.log('No callback provided to import function');
			return;	
		}
		var balance=parseFloat(false); // NaN
		var lines=importText.split("\n") ;
		$.each(lines, function (key,value) {
			var fields=$.trim(value).split(" ");
			if (fields.length>3) {
				var entry={};
				if (fields.length==4 && fields[1]=="OPENING" && fields[2]=="BALANCE") {
					balance=parseFloat(fields[3]);
				}
				if (isNaN(balance))  {
					console.log('Cannot import row without setting balance');
				} else {
					entry.date=standardiseAUDate(fields[0]);	
					if (entry.date!=null) {
						// CR
						entry.amount=parseFloat(fields[fields.length-2]);
						if (!isNaN(entry.amount)) {
							entry.balance=parseFloat(fields[fields.length-1]);
							entry.description='';
							entry.description+=fields[1];
							for (i=2; i< (fields.length-2); i++) {
								entry.description+=' '+fields[i];
							}
							console.log('IMPORT ENTRY',entry)
							if (!isNaN(entry.amount!=NaN) &&  !isNaN(entry.balance) && entry.description.length>0 && entry.date!=null) {
								// munge balance positive or negative depending on relationship to balance
								if (balance-entry.amount==entry.balance) {
									entry.amount=-1*entry.amount;
								}
								balance=entry.balance;
								rowCallback(entry);
								importTally++;
								entries.push(entry);
							} else {
								console.log('IGNORING INVALID IMPORT LINE',value)
								errorLines.push(value);
							}
						} else {
							console.log('IGNORING INVALID IMPORT LINE with invalid amount',value);
							errorLines.push(value);
						}
					} else {
						console.log('IGNORING INVALID IMPORT LINE with invalid date',value);
						errorLines.push(value);
					}
				}
			}  else {
				console.log('IGNORING INVALID IMPORT LINE with insufficient fields',value);
				if ($.trim(value).length>0) errorLines.push(value);
			}
			//console.log(entry);
		});
		console.log('import complete in anzlib');
		//console.log(transactions);
		//return transactions;
		finalCallback({'importTally':importTally,'ignored':errorLines,'imported':entries});
	}
	
	function standardiseAUDate(audatestring) {
	    var tmp=null;
	    if (audatestring && audatestring.length>5) {
	        var datetimeparts=audatestring.split(' ');
	        var dateparts=datetimeparts[0].split('/');
	        //AI_log('y:'+dateparts[2]+'m:'+dateparts[1]+'d:'+dateparts[0]);
	        if (dateparts.length==3) {
	            //tmp=new Date();
	            //tmp.setDate(dateparts[0]);
	            //tmp.setMonth(dateparts[1]);
	            //tmp.setYear(dateparts[2]);
	          //  tmp=new Date(dateparts[2],dateparts[1]-1,dateparts[0],0,0,0);
	          tmp=dateparts[2]+'-'+dateparts[1]+'-'+dateparts[0];
	        }
	    }
	    return tmp;            
	}
	// return access to public functions
	return {
		importCreditTransactions: importCreditTransactions,
		importNormalTransactions: importNormalTransactions
	}
}
