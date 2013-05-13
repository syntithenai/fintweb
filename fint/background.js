/*******************************
 * Background script for the fint extension
 * Manages application windows including - main , bank, notifications
 * Listener for message events including
 	- register bank window
 	- save accounts or transactions
 	- do next step
 *******************************/
var onlineBankingConfig={
	// these sites need to be in the manifest.json file to enable content scripts at these locations
	ebankingSiteName:'FINT Fake Bank',
	ebankingSiteURL:'http://localhost/fint/fauxbank/',
	automatic:true,
	login:{
		navPath:['http://localhost/fint/fauxbank/index.html','LINKVALUE::Decoy','LINKVALUE::Decoy'],
		// allow for popup boxes with extra check for form immediately after linkSelector (as compared to navPath which assumes reregistration ie page load)
		linkSelector:'input#button_logon',
		username:'jeo blogs',
		password:'dsdfsd',
		usernameInputSelector:'input[name="CorporateSignonCorpId"]',
		passwordInputSelector:'input[name="CorporateSignonPassword"]',
		loginButtonSelector:'a[id="SignonButton"]',
		// am i logged in check
		logoutButtonSelector:'input[name="Action.CorpUser.001.SignoffConfirm"]'
	},
	accountsHome:{
		navPath:['LINKVALUE::View Accounts'],
		//linkSelector:'LINKVALUE::View Accounts',	 // TODO value match values
		accountsTableSelector:'table#AcctsListOperative',
		accountsRowSelector:'tr',
		accountNameSelector:'td:nth-child(1)',
		accountNumberSelector:'td:nth-child(2)',
		accountBalanceSelector:'td:nth-child(3)',
	},
	transactionSearch:{		
		navPath:['LINKVALUE::View Accounts','table#AcctsListOperative tr:nth-child(2) td:first-child a','LINKVALUE::Search Transactions'],
		accountSelectSelector:'select[name="AccountSummaryInd"]',
		searchInputs:{
			'select[name="ANZSrchDtRng"]':'5',	
			'input[name="acctquery"]':'ANZTxnRadio'
		},
		searchButtonSelector:'input[name="Action.ANZAccounts.SearchTransactions"]'
	},
	transactionList:{
		transactionsTableSelector:'',  // assigned later
		transactionRowSelector:'tr:nth-child(n+1)',
		transactionDateSelector:'td.dataCol:nth-child(1)',
		transactionDescriptionSelector:'td.dataCol:nth-child(2)',
		transactionAmountSelector:'',
		transactionCreditSelector:'td.dataCol:nth-child(4)',
		transactionDebitSelector:'td.dataCol:nth-child(3)',
		transactionBalanceSelector:'td.dataCol:nth-child(5)',
		moreTransactionsSelector:'a#showmore'
	}
}; 

function stepNavPath(navPath) {
	console.log('step navpath');
	console.log(navPath);
	if (navPath && navPath.length >0) {
		var nextClickSelector=navPath[0];
		if (nextClickSelector.indexOf("LINKVALUE::")===0) {
			console.log('linkvalue' + nextClickSelector);
			runBankScript("api.hasLink('"+nextClickSelector.substr(11)+"')",function(result) {
				console.log('havelink');
				if (result && result[0]===true) {
					navPath.shift();
					if (navPath.length==0) {
						chrome.storage.local.remove('activeNavPath');
					} else {
						chrome.storage.local.set({'activeNavPath':navPath});
					}
					console.log('click element');
					runBankScript("api.clickElement('"+nextClickSelector+"')");	
					return true;
				} else {
					console.log('remove path after failed link');
					chrome.storage.local.remove('activeNavPath');
					return false;		
				}
			});
		} else {
			console.log('navpath non lintitle');
			runBankScript("api.hasElement('"+nextClickSelector+"')",function(result) {
				console.log('have element');
				if (result && result[0]===true) {
					navPath.shift();
					if (navPath.length==0) {
						chrome.storage.local.remove('activeNavPath');
					} else {
						chrome.storage.local.set({'activeNavPath':navPath});
					}
					console.log('click element');
					runBankScript("api.clickElement('"+nextClickSelector+"')");	
					return true;
				} else {
					console.log('remove path after failed element nav');
					chrome.storage.local.remove('activeNavPath');
					return false;		
				}
			});
		}
	} else {
		// shouldn't happen, bailout above when activeNavPath is empty
		console.log('linkvalue remove no more path - EEK shouldnt happen, bailout above when activeNavPath is empty');
		chrome.storage.local.remove('activeNavPath');	
		return false;
	}
	return true;
}


function processRequest(request, sender, sendResponse) {
  	if (request.message) sendNotification(request.message);
	console.log('register sender');
	console.log(sender);
	// bank window registration
	var justDoneSearch=false;
	if (request && request.exec=="register") {
  		chrome.tabs.query({"url":request.url,lastFocusedWindow: true, active: true},function(registrationTab) {
  			console.log('register ');
  			console.log(registrationTab);
  			bankTab=registrationTab;
  			sendResponse({'registered': request.url});
  			// drive process by availability of information in persistent store and page status calls
  			chrome.storage.local.get(null,function(persistentStore) {
				if (persistentStore.justDoneSearch) {
					justDoneSearch=true;
					chrome.storage.local.remove('justDoneSearch');	
				} 
				if (persistentStore.activeNavPath && stepNavPath(persistentStore.activeNavPath)) {
					// if stepNavPath returns false, proceed with registration
					console.log('done nav path with '+persistentStore.activeNavPath);
				} else {
					runBankScript("api.hasElement('"+onlineBankingConfig.login.logoutButtonSelector+"')",function(results) {
						if (results[0]==true) {
							// do we have an account list
							console.log('preseek accts list');
							if (!persistentStore.accounts) {
								persistentStore.accounts=[];
							}
							if (persistentStore.accounts.length==0) {
								console.log('seek accts list');
								runBankScript("api.hasElement('"+onlineBankingConfig.accountsHome.accountsTableSelector+"')",function(results) { 
									if (results[0]===true) {
										console.log('have accts list');
							
										// scrape account list
										runBankScript("api.scrapeAccountsTable('"+onlineBankingConfig.accountsHome.accountsTableSelector+"','"+onlineBankingConfig.accountsHome.accountsRowSelector+"','"+onlineBankingConfig.accountsHome.accountNameSelector+"','"+onlineBankingConfig.accountsHome.accountNumberSelector+"','"+onlineBankingConfig.accountsHome.accountBalanceSelector+"')",function(scrapeResults) { 		
											console.log('SAVE ACCOUNTS');
											chrome.storage.local.set({'accounts':scrapeResults[0]});
											console.log(scrapeResults);
											// go to search screen
											console.log('goto search');
											stepNavPath(onlineBankingConfig.transactionSearch.navPath.slice());
										});	
									// need accounts but not available on this page
									} else {
										console.log('need accounts but not on this page, nav to ');
										stepNavPath(onlineBankingConfig.accountsHome.navPath.slice());
									}
								});
							} else {
								console.log('seek trn searcher');
								console.log(persistentStore.accounts);
								// next mission is transactions for all accounts. which account next?
								var moreToDo=false;
								var accountToLoad=null;
								for (var i=0; (i<persistentStore.accounts.length ); i++) {
									console.log('iter account');
									if (!persistentStore.accounts[i].transactions) {
										console.log('init trns for account '+i);
										persistentStore.accounts[i].transactions=[];
										persistentStore.accounts[i].haveAllTransactions=false;	
										accountToLoad=persistentStore.accounts[i];
										break;
									} else if (!persistentStore.accounts[i].haveAllTransactions) {
										accountToLoad=persistentStore.accounts[i];
										break;
									} 
								}	
					
								if (accountToLoad) {
									// have we just done a search ??
									if (justDoneSearch) {
										//extract rows	
										runBankScript("api.getTransactionTableSelectorFromFieldSelector('"+onlineBankingConfig.transactionList.transactionDateSelector+"')",function (tableSelector) {
											console.log('table selecyor');
											console.log(tableSelector);	
											runBankScript("api.scrapeTransactionTable('"+tableSelector+"','"+onlineBankingConfig.transactionList.transactionRowSelector+"','"+onlineBankingConfig.transactionList.transactionDateSelector+"','"+onlineBankingConfig.transactionList.transactionDescriptionSelector+"','"+onlineBankingConfig.transactionList.transactionAmountSelector+"','"+onlineBankingConfig.transactionList.transactionCreditSelector+"','"+onlineBankingConfig.transactionList.transactionDebitSelector+"','"+onlineBankingConfig.transactionList.transactionBalanceSelector+"'); ",function(results) {
												console.log('SAVE TRNS');
												console.log(results);
												runBankScript("api.hasElement('"+onlineBankingConfig.transactionList.moreTransactionsSelector+"')",function(hasMore) {
													console.log('hasMore');
													console.log(onlineBankingConfig.transactionSearch.moreTransactionsSelector);
													console.log(hasMore);
													console.log('finalise trns for this account');
													console.log([i,results,persistentStore.accounts[i].transactions]);
													for (var k=0; k <= results[0].length; k++) {
														if (
															results[0][k] 
															&& (results[0][k].date && results[0][k].date.length>0) 
															&& (results[0][k].description && results[0][k].description.length>0 )
															&& (
																results[0][k].amount!=null 
																&& results[0][k].amount!=NaN 
																&& results[0][k].amount.toString 
																&& results[0][k].amount.toString().length>0
															)
														) {
															persistentStore.accounts[i].transactions.push(results[0][k]);	
														} else {
															console.log('rejected save trns');
															console.log(results[0][k]);	
														}
													}
													if (hasMore[0]==true) {
														console.log('click more');
														persistentStore.justDoneSearch=true;
														chrome.storage.local.set(persistentStore);
														runBankScript("api.clickElement('"+onlineBankingConfig.transactionList.moreTransactionsSelector+"')");	
													} else {
														// this account complete	
														persistentStore.accounts[i].haveAllTransactions=true;	
														chrome.storage.local.set(persistentStore);
														// back to search
														stepNavPath(onlineBankingConfig.transactionSearch.navPath.slice());
													}
												}); 	
											});	
										});
										
									} else {
										// find and submit the search form
										runBankScript("api.hasElement('"+onlineBankingConfig.transactionSearch.accountSelectSelector+"') && api.hasElement('"+onlineBankingConfig.transactionSearch.searchButtonSelector+"')",function(results) { 	
												console.log('search form');
												console.log(results);
												if (results[0]==true) {
													console.log('have a search form, searching ');
													console.log(accountToLoad);
													// fill criteria and click search
													var setInputs='';
													for (var j in onlineBankingConfig.transactionSearch.searchInputs) {
														console.log('set '+j+":"+onlineBankingConfig.transactionSearch.searchInputs[j])	
														setInputs+="api.setElement('"+j+"','"+onlineBankingConfig.transactionSearch.searchInputs[j]+"'); ";
													}
													console.log('set inputs trn searcher');
													console.log(setInputs);
													//
													persistentStore.justDoneSearch=true;
													chrome.storage.local.set(persistentStore);
													runBankScript("api.setSelectByLabelMatch('"+onlineBankingConfig.transactionSearch.accountSelectSelector+"','"+accountToLoad.number+"'); "+setInputs+"; api.clickElement('"+onlineBankingConfig.transactionSearch.searchButtonSelector+"'); ");
													//
												} else {
													console.log('no search form, commencing navpath ');
													// go to a search screen
													stepNavPath(onlineBankingConfig.transactionSearch.navPath.slice());	
												}
												
											});
									}
								} else {
									console.log("DONE");
								}
								
							}	
						// else not loggedIn
						} else {
							// if login page show toast to login
							console.log(sender.tab.url+"  "+onlineBankingConfig.login.url);
							var keepChecking=true;
							var checkIterations=0;
							while (keepChecking && checkIterations<2) {
								checkIterations+=1;
								keepChecking=false;
								runBankScript("api.hasElement('"+onlineBankingConfig.login.usernameInputSelector+"') && api.hasElement('"+onlineBankingConfig.login.passwordInputSelector+"') && api.hasElement('"+onlineBankingConfig.login.loginButtonSelector+"')",function(result) {
									if (result[0]==true) {
										// set username
										runBankScript("api.setElement('"+onlineBankingConfig.login.usernameInputSelector+"','"+onlineBankingConfig.login.username+"');");
										if (onlineBankingConfig.automatic && onlineBankingConfig.login.password.length>0) {
											sendNotification('Logging into '+onlineBankingConfig.ebankingSiteName);
											runBankScript("api.setElement('"+onlineBankingConfig.login.passwordInputSelector+"','"+onlineBankingConfig.login.password+"'); api.clickElement('"+onlineBankingConfig.login.loginButtonSelector+"'); ");	
												
										}; 
									// else show toast to click nav login page
									} else {
										sendNotification('Redirecting to login');
										keepChecking=true;
										runBankScript("if (api.hasElement('"+onlineBankingConfig.login.linkSelector+"')) api.clickElement('"+onlineBankingConfig.login.linkSelector+"'); else api.loadURL('"+onlineBankingConfig.login.navPath[0]+"')",function() {
											// after click (or nav), recheck for login form
											runBankScript("api.hasElement('"+onlineBankingConfig.login.usernameInputSelector+"') && api.hasElement('"+onlineBankingConfig.login.passwordInputSelector+"') && api.hasElement('"+onlineBankingConfig.login.loginButtonSelector+"')",function(result) {
												if (result[0]==true) {
													// set username
													runBankScript("api.setElement('"+onlineBankingConfig.login.usernameInputSelector+"','"+onlineBankingConfig.login.username+"');");
													if (onlineBankingConfig.automatic && onlineBankingConfig.login.password.length>0) {
														sendNotification('Logging into '+onlineBankingConfig.ebankingSiteName);
														runBankScript("api.setElement('"+onlineBankingConfig.login.passwordInputSelector+"','"+onlineBankingConfig.login.password+"'); api.clickElement('"+onlineBankingConfig.login.loginButtonSelector+"'); ");	
															
													}; 
												// else show toast to click nav login page
												}	
											}); 
										});	
									}
								});
							}
						}
					});
				}
			});
  			
  			
			   			
  		});
  	}
}
 
 
 // populated on registration by content scripts when bank site loads
var bankTab=null;


function getBankTab() {
	var bankTab=null;
	if (!bankTab) window.open(onlineBankingConfig.loginPage);	
	return bankTab;
}
function runBankScript(script,callback) {
	if (bankTab) {
		chrome.tabs.executeScript(bankTab.id,{'code':script},callback);
	}
}

  
function sendNotification(message,timeout,timeoutCallback,clickCallback) {
	var defaultTimeout=5000;
	var notification = webkitNotifications.createNotification(
	  '48.png',  // icon url - can be relative
	  'FINT Finance Tools',  // notification title
	  message  // notification body text
	);
	if (!timeoutCallback ||!(typeof timeoutCallback==='function')) timeoutCallback=function() {
		console.log('notification kill ');
		console.log(notification);
		notification.cancel();	
	}
	if (!timeout || timeout==0) timeout=defaultTimeout;
	if (timeout>0) {
		setTimeout(timeoutCallback,timeout);
	}
	
	notification.onclick=function () {
		clickCallback();
		notification.cancel();
	}
	notification.show();	
}
function ensureAppBookmark() {
	var theurl=chrome.extension.getURL('homescreen.html');
	var appBookmark={'title': 'Easy Finance 2','url': theurl};
	// remove existing bookmark 
	var toRemove=[];
	chrome.bookmarks.search(appBookmark.url,function(nodes) {
		$.each(nodes,function(node,value) {
			if (value.id >0) { 
				toRemove.push(value.id); 
			}
		});
		// create bookmark
		// add to folder first toplevel child of bookmarks
		chrome.bookmarks.getChildren('0',
			function(bookmarkTreeNodes) {
				rootFolder=bookmarkTreeNodes[0];
				appBookmark.parentId=rootFolder.id;
				appBookmark.index=0;
				chrome.bookmarks.create(appBookmark);
			}
		);	
		for (var i=0; i< toRemove.length; i++) {
			chrome.bookmarks.remove(toRemove[i]);
		};
	});	
}	



// INITIALISATION
chrome.storage.local.remove('activeNavPath');
chrome.storage.local.remove('accounts');
ensureAppBookmark();	
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
  	// slow things down a little
  	setTimeout(function() {processRequest(request,sender,sendResponse);},1);
  	// require that sendResponse is called
  	return true;
});
sendNotification('Loaded',2000,null,function() {
	getMainWindow().focus();	
});

// FINT application window
function getMainWindow() {
	return mainWindow=window.open('http://localhost/fint/index.html');	
} 
// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
 getMainWindow().focus();	
});