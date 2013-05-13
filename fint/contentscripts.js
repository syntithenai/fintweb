/**********************************
 * Screen scraper content scripts to allow remote control from a background script
 * Provides and API for DOM query/manipulation of injected into page
 * and server for remote polling
 * and init to poll and register with background script
 */

// initial registration with background window
var theurl=window.location.href;
chrome.extension.sendMessage({"exec": "register","url":theurl}, function(response) {
	//console.log(response);
});
	

var api={
		loadURL:function(url) {
			//console.log('redirect '+url);
			window.location=url;	
		},
		hasLink:function(linkText) {
			var l=window.document.links.length;
			for (var i=0; i<l; i++) {
				if (window.document.links[i].innerText==linkText) {
					return true;
				}
			}
			return false;
		},
		clickLink:function(linkText) {
			var l=window.document.links.length;
			for (var i=0; i<l; i++) {
				if (window.document.links[i].innerText==linkText) {
					window.document.links[i].click();
					// first link
					return;
				}
			}
		},
		hasInput:function(name) {
			var inputs=window.document.getElementsByTagName('input');
			for (element in inputs) {
				//console.log('hasInput ?'+name);
				//console.log(inputs[element].name);
				if (inputs[element].name==name) {
					return true;
				}
			};
			return false;
		},
		setInput:function(name,value) {
			var inputs=window.document.getElementsByTagName('input');
			for (element in inputs) {
				//console.log(inputs[element].name);
				if (inputs[element].name==name) {
					inputs[element].value=value;
					return true;
				}
			};
			return false;
		},
		getInput:function(name) {
			var inputs=window.document.getElementsByTagName('input');
			for (element in inputs) {
				//console.log(inputs[element].name);
				if (inputs[element].name==name) {
					inputs[element].value=value;
					return inputs[element];
				}
			};
			return false;
		},
		clickInput:function(name) {
			var inputs=window.document.getElementsByTagName('input');
			for (element in inputs) {
				//console.log(inputs[element].name);
				if (inputs[element].name==name) {
					inputs[element].click();
				}
			};
		},
		hasElement:function(selector) {
			if (selector.indexOf("LINKVALUE::")===0) {
				return api.hasLink(selector.substr(11));
			} else if (document.querySelectorAll(selector).length>0) {
				return true;	
			} else return false;
		},
		clickElement:function(selector) {
			//console.log('click on ');
			//console.log(selector);
			if (selector.indexOf("LINKVALUE::")===0) {
				return api.clickLink(selector.substr(11));
			} else { 
				var result=	document.querySelector(selector)
				//console.log('found');
				//console.log(result);
				if (result) result.click();
			}
		},
		// special hack for anz where selector for td is more reliable (perhaps should just force anz config to DOM Tree selector??
		setSelectByLabelMatch:function(selector,searchFor) {
			//console.log('select by label match');
			//console.log(selector);
			//console.log(searchFor);
			var result=document.querySelectorAll(selector);
			//console.log(result);
			if (result && result.length>0) {
				//console.log('matching select');
				var options=document.querySelectorAll(selector+' option');
				//console.log(options);		
				if (options && options.length>0) {
					//console.log('have options');
					for (var i=0; i < options.length; i++) {
						//console.log('iterate options '+options[i].value);
						if (options[i].innerText && options[i].innerText.indexOf(searchFor)>=0) options[i].selected=true;		
					}
				}
			}
		},
		setElement:function(selector,value) {
			var results=document.querySelectorAll(selector);
			if (results && results.length>0) {
				//console.log('setElement');
				//console.log(results[0]);
				//console.log(results[0].type);
				//console.log('to');
				//console.log(value);
				// handle different ways of setting values on form input element types
				if (
					results[0].type=='textarea' 
					|| (results[0].type=='input' && (results[0].getAttribute('type')=='input' || results[0].getAttribute('type')=='hidden')) 
					|| results[0].getAttribute('type')=='password'
				) { 
					//console.log('value direct');
					results[0].value=value;
				} else if (results[0].getAttribute('type')=='radio') { 
					//console.log('radio');
					//console.log(results);
					for (var i=0; i < results.length; i++) {
						//console.log(results[i].getAttribute('value'));
						if (results[i].getAttribute('value')==value) {
							//console.log('match');
							results[i].checked=true;
						}
					}
				} else if (results[0].type=='select-one') { 
					//console.log('select '+value);
					var optionToSelect=document.querySelector(selector+' option[value="'+value+'"]');		
					if (optionToSelect) {
						//console.log('selectmatch');
						//console.log(optionToSelect);
						optionToSelect.selected=true;
					}
				}
			}
		},
		getTransactionTableSelectorFromFieldSelector: function(fieldSelector) {
			var field=document.querySelector(fieldSelector);
			// assume parent/parent
			var el=field.parentNode.parentNode;
			var path=[];
			do {
			    path.unshift(el.nodeName + (el.className ? ' class="' + el.className + '"' : ''));
			} while ((el.nodeName.toLowerCase() != 'html') && (el = el.parentNode));			
			return path.join(" > ");
		},
		scrapeTransactionTable:function(tableSelector,rowSelector,dateSelector,descriptionSelector,amountSelector,creditSelector,debitSelector,balanceSelector) {
			console.log('scrape trns');
			console.log([tableSelector,rowSelector,dateSelector,descriptionSelector,amountSelector,creditSelector,debitSelector,balanceSelector]);
			var finalRows=[];
			var table=document.querySelector(tableSelector);
			console.log(table);
			if (table) {
				var rows=table.querySelectorAll(rowSelector);
				if (rows && rows.length>0) {
					for (var i=0; i< rows.length; i++) {
						console.log('iterate rows');
						var row={};
						row['date']=rows[i].querySelector(dateSelector) ? rows[i].querySelector(dateSelector).innerHTML : '';
						row['description']=rows[i].querySelector(descriptionSelector) ? rows[i].querySelector(descriptionSelector).innerHTML : '';
						if (amountSelector && amountSelector.length>0) var amountString=rows[i].querySelector(amountSelector);
						if (amountString) amountString=amountString.innerText.replace(/[^0-9\.]+/g, '');
						var amount=parseFloat(amountString);
						console.log('got amount ');
						console.log(amountString);
						console.log(row);
						if (creditSelector && creditSelector.length>0) var creditString=rows[i].querySelector(creditSelector);
						if (creditString) creditString=creditString.innerText.replace(/[^0-9\.]+/g, '');
						var credit=parseFloat(creditString);
						if (debitSelector && debitSelector.length>0) var debitString=rows[i].querySelector(debitSelector);
						if (debitString) debitString=debitString.innerText.replace(/[^0-9\.]+/g, '');
						var debit=parseFloat(debitString);
						if (balanceSelector && balanceSelector.length>0) var balanceString=rows[i].querySelector(balanceSelector);
						if (balanceString) balanceString=balanceString.innerText.replace(/[^0-9\.]+/g, '');
						var balance=parseFloat(balanceString);
						var tally=0;
						
						if (!isNaN(amount)) tally+=amount;
						if (!isNaN(credit)) tally+=credit;
						if (!isNaN(debit)) tally-=debit;
						row['amount']=tally;
						row['balance']=balance;
						finalRows.push(row);
					}
				}
			}
			console.log('final rows from trn scrape');
			console.log(finalRows);
			return finalRows;
		},
		scrapeAccountsTable:function(tableSelector,rowSelector,nameSelector,numberSelector,balanceSelector) {
			var table = document.querySelector(tableSelector);
			console.log('scraping accounts');
			console.log(tableSelector);
			console.log(table);
			var dataRows=[];
			if (table) {
				var rows=table.querySelectorAll('tr');
				if (rows) {
					for (var i=0; i<rows.length; i++) {
						var row={};
						row['name']=rows[i].querySelector(nameSelector) ? rows[i].querySelector(nameSelector).innerText : null;
						row['number']=rows[i].querySelector(numberSelector) ? rows[i].querySelector(numberSelector).innerText : null;
						row['balance']=rows[i].querySelector(balanceSelector) ? parseFloat(rows[i].querySelector(balanceSelector).innerHTML.replace(/[^0-9\.]+/g, '')) : NaN;
						if (row['name'] && row['number'] && row['name'].length>0 && row['number'].length>0) {
							dataRows.push(row);
						}
					}
				}
			}
			console.log('final rows from act scrape');
			console.log(dataRows);
			
			return dataRows;
		}, 
		getEmbeddedIFrame:function() {
			var iframe=window.document.getElementById('fintframe');
			if (!iframe) {
				iframe = window.document.createElement('iframe');
				iframe.setAttribute('src', 'http://localhost/easyfinance/iframe.php');
				iframe.setAttribute('height','200px');
				iframe.setAttribute('id','fintframe');
				iframe.onload=function() {
					alert('loaded');
				}		
				$(iframe).css('position','fixed').css("top","10%").css('left','60%').width('400').height('200').css('opacity','0.9').css('backgroundColor','pink');
				document.body.appendChild(iframe);
			}
			return iframe;
		},
		sendMessage:function(message) {
			window.postMessage(JSON.stringify({'message':message}),"*");	
		}
}
