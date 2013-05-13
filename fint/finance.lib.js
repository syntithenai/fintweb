var finance = {};
finance.home={

	updateStatusMessages : function() {
		return 'Try FINT Personal Finance Tools. To get started <a id="homeimportsomedata"  >Import Some Data</a>'; 
	
	},

	toggleHomeWidget : function(target) {
		//console.log('toggle',$(target).parent().children('div:visible'));
		if ($(target).parent().children('div:visible') && $(target).parent().children('div:visible').length>0) {
			$(target).data('mini',true); 
			$(target).parent().css('min-height','0');
			$(target).parent().css('height','1.6em');
			$(target).parent().children('div').hide();
			
		} else {
			$(target).parent().css('height','');
			$(target).parent().css('min-height','10em'); 
			$(target).parent().children('div').show();
			$(target).data('mini',false);}
	},
	
	
	saveTags:function(transactionId,tagIds) {
		var queries=[];
		queries.push("delete from mm_transactionstags where transactions='"+transactionId+"'");
		$.each(tagIds,function(i,tagId) {
			if (tagId>0) queries.push("insert into mm_transactionstags (transactions,tags) values ('"+transactionId+"','"+tagId+"')");
		});
		console.log(queries)
		db.query(queries) //,updateSql,toUpdate])
		.fail(function (tx, err) {
			if (true) console.log(err);
		})
		.done(function (result) {
			console.log('saved tag mms');
		});
		
	},
	showRuleWizard : function(plugin) {
		$("#createrulewizard").remove();
		$("#hometransactionmanager").prepend('<div id="createrulewizard"><span class="ruletokens" /></div>');
		// tag
		var tagSelector="<span class='ruletagselector' >Tag <input type='text' /><input type='hidden' /></span>"
		$("#createrulewizard").append(tagSelector);	
		$("#createrulewizard .ruletagselector input[type=text]").first().focus();			
		$("#createrulewizard").append("<img src='images/tick.png' class='saverulebutton' title='Save Rule' /><img src='images/deleterecord.png' id='cancelrulewizardbutton' /><br/>");
		var preWizardSearch=$("#hometransactionmanagersearch .searchers .search-field-name input").val();
		$("#cancelrulewizardbutton").click(function() {
			$("#createrulewizard").remove();
			$("#hometransactionmanagersearch .searchers .search-field-name input").val(preWizardSearch);
			plugin.api.controller.initList();	
		});	
		$("#createrulewizard .ruletagselector input[type=text]").autocomplete({
			source: function( request, response ) {
				console.log('AUTOCOMP',$(this.element))
				var query="select * from tags_label where label like '%"+request.term+"%'";
				var items=[];
				plugin.api.model.executeIteratorQuery(query,[],function(result) {
					items.push({label:result.label,value:result.rowid})
				},
				function () {
					response(items);
				});
			},
			focus: function() {
				// prevent value inserted on focus
				return false;
			},
			select: function( event, ui ) {
				this.value = ui.item.label;
				$(this).parent().find('input[type=hidden]').first().val(ui.item.value);
				return false;
			}
		});
		return preWizardSearch;
	},
	showRuleWizardSearchers : function(plugin) {
		//var searchParams=plugin.api.view.getSearchParameters('transactions','list');
			// date filter
			//$("#createrulewizard").append("<span class='ruledateselectors' ><span class='ruledatefrom' >Date From <input type='date'></span><span class='ruledateto' >Date To<input type='date'></span></span>");
			// account filter
			/*var spParts=$.trim(searchParams._account_ids).split(",");
			if (spParts.length==1) {
				var options=[];
				var values=[];
				$("#hometransactionmanager input:checked.listrowcheckbox").each(function() {
					console.log("MEEEEE",this);
					options.push($(this).parents('.collatedlist').find('h3').text());
					values.push($(this).data('rowid'));
				});
				if (values.length==1) $("#createrulewizard").append("<span class='ruleaccountselector' >Account <select><option value='"+values.join(",")+"'>"+options.join(",")+"</option><option value='' >All</option></select></span>");
			} 
			*/
	},
	showRuleWizardTokens : function (tokenDOM,ruleText,plugin) {
			if ($.trim(ruleText)=='') ruleText=$(tokenDOM).parent().parent().find('.list-field-description').text();
			var ruleFinal='';
			$.each(ruleText.split(' '),function(i,token) {
				if (token.length>0) {
					//console.log(token);
					ruleFinal+='<span class="ruletoken" >'+token+'<span class="killrulebutton">X</span></span>';
				}
			});
			$("#createrulewizard .ruletokens").append(ruleFinal);
			// BUTTON TRIGGERS
			$(".killrulebutton").click(function() {
				var currentRules=$(this).parent().parent().find('.ruletoken');
				var context=$(this).parent().parent();
				if (currentRules.length==1) {
					$("#createrulewizard").remove();
				} else {
					console.log('KILL TOKEN','PREV',$(this).parent().prev().text(),'NEXT',$(this).parent().next().text());
					if ($(this).parent().prev().length>0 && $(this).parent().next().length>0 && $.trim($(this).parent().next().text())!="%" && $.trim($(this).parent().prev().text())!="%") {
						console.log('CONVERT');
						$(this).parent().html('%').append(this);
						$(this).html('&nbsp;&nbsp;');
					} else {
					console.log('kill');
						$(this).parent().remove();
					}
					
					currentRules=context.find('.ruletoken'); 
					var rulesText={};
					var rulesCounter=1;
					currentRules.each(function(i,rule) {
						var a=$(this).clone();
						$('.killrulebutton',a).remove();
						var text=$(a).wrap("<p>").parent().text();
						if ($.trim(text)=="%") {
							rulesCounter++;
						} else {
							if (!rulesText[rulesCounter]) rulesText[rulesCounter]=[];
							rulesText[rulesCounter].push(text);
						}
					});
					var ruleFinal=[];
					$.each(rulesText,function(key,value) {
						if (value.length>0) ruleFinal.push('"'+value.join(' ')+'"');
					});
					console.log('update search ',ruleFinal.join(' NEAR '));
					$("#hometransactionmanagersearch .searchers .search-field-name input").val(ruleFinal.join(' * ')); //rulesText);
					plugin.api.controller.initList();
				}
			});
			return ruleText;
	},
	collateAndSaveTags : function(row) {
		var selIds=[];
		$.each($('.selected',row),function() {
			selIds.push($(this).data('join-rowid'));
		});
		var transactionId=row.find('.listrowcheckbox').first().data('rowid');
		finance.home.saveTags(transactionId,selIds);		
	},
	bindHomeTransactionListButtons : function(plugin) {
		//$('tr.row').unbind('click');
		$('tr.row').click(function()  {var checkBoxes = $('.listrowcheckbox',this); checkBoxes.attr("checked", !checkBoxes.attr("checked"));});

		$("#hometransactionmanager .editablerecords .rulebutton").click(function() {
			var preWizardSearch=finance.home.showRuleWizard(plugin);
			finance.home.showRuleWizardSearchers(plugin);
			var ruleText=finance.home.showRuleWizardTokens(this,'',plugin);
			$("#hometransactionmanagersearch .searchers .search-field-name input").val(ruleText);
			plugin.api.controller.initList();
			$("#createrulewizard .saverulebutton").click(function() {
				console.log('SAVENOW');
				var tagId=$("#createrulewizard .ruletagselector input[type=hidden]").first().val();
				var tagName=$("#createrulewizard .ruletagselector input[type=text]").first().val();
				if (parseInt(tagId)>0) {
					var rule={"name":$("#hometransactionmanagersearch .searchers .search-field-name input").val(),"filtertext":$("#hometransactionmanagersearch .searchers .search-field-name input").val().replace(/\*/g,' NEAR '),"tags":tagId};
					plugin.api.model.saveRecords('rules',[rule],function() {
						$("#createrulewizard").remove(); 
						$("#hometransactionmanagersearch .searchers .search-field-name input").val(preWizardSearch); 
						plugin.api.controller.initList(); 
						console.log('saved rule');
						$("#createrulewizard").remove();
					});
				} else {
					// save new tag
					db.query(["insert into tags (name) values ('"+tagName+"')"])
					.done(function(res) {
						//var rule={"name":$("#hometransactionmanagersearch .searchers .search-field-name input").val(),"filtertext":"%"+$("#hometransactionmanagersearch .searchers .search-field-name input").val()+"%","tags":res.insertId};
						console.log('saved new tag for rule'+res.insertId,rule);
						//plugin.api.model.saveRecords('rules',[rule],function() {
						db.query("insert into rules (name,filtertext,tags) values ('"+$("#hometransactionmanagersearch .searchers .search-field-name input").val()+"','"+$("#hometransactionmanagersearch .searchers .search-field-name input").val().replace(/\*/g,' NEAR ')+"','"+res.insertId+"')") 
						.done(function() {
							$("#createrulewizard").remove(); 
							$("#hometransactionmanagersearch .searchers .search-field-name input").val(preWizardSearch); 
							plugin.api.controller.initList(); 
							console.log('saved rule');
							$("#createrulewizard").remove();
						});
					});
		
				}
			
				
			});
		});

			// per row
		$('#hometransactionmanager .removetagbutton').click(function() {
			console.log('initLists',$(plugin)[0].api);
			var row=$(this).parents('.row');
			$(this).parent().remove();
			finance.home.collateAndSaveTags(row);
			console.log('REMOVE TAGS DONE');
			//$(plugin)[0].api.controller.initList();
		});
		$('#hometransactionmanager .approvetagbutton').click(function() {
			var row=$(this).parents('.row');
			$(this).parent().addClass('selected').append('<img src="images/deleterecord.png" class="removetagbutton" title="Deselect Tag">').find('.approvetagbutton').remove();
			finance.home.collateAndSaveTags(row);
			console.log('APPROVE TAG',$(this).parents('.row').find('.listrowcheckbox'));
		});
		$('#hometransactionmanager .approvebutton').click(function() {
			console.log('APPROVE TAGS');
			var row=$(this).parents('.row');
			$(this).parents('.row').find('.list-field-selectedtags .approvetagbutton').each(function() {
				$(this).parent().addClass('selected').append('<img src="images/deleterecord.png" class="removetagbutton" title="Deselect Tag">').find('.approvetagbutton').remove();
			});
			finance.home.collateAndSaveTags(row);
		});
		$('#hometransactionmanager .tagbutton').click(function() {
			// WIZARD
			var tagButton=this;
			finance.home.showRuleWizard(plugin);
			$("#createrulewizard .saverulebutton").click(function() {
				console.log('SAVETAG TO TRANSACTIONS NOW',$(this).parents('#createrulewizard').find('.ruletagselector').html());
				var tagName=$(this).parents('#createrulewizard').find('.ruletagselector input[type=text]').first().val();
				console.log('SAVETAG ',tagName);
				if (tagName && tagName.length>0) {
					console.log('SAVETAG2 ',tagName);
					var tagId=$(this).parents('#createrulewizard').find('input[type=hidden]').first().val();
					console.log('SAVETAG2 ',tagName,tagId);
					if (parseInt(tagId)>0) {
						$(tagButton).parents('.row').find('.list-field-selectedtags').append('<span class="join-value selected" data-join-rowid="'+tagId+'">'+tagName+'<img src="images/deleterecord.png" class="removetagbutton" title="Deselect Tag"></span>');
						finance.home.collateAndSaveTags($(tagButton).parents('.row'));
					} else {
						// save new tag
						db.query(["insert into tags (name) values ('"+tagName+"')"])
						.done(function(res) {
							console.log('saved new tag '+res.insertId);
							$(tagButton).parents('.row').find('.list-field-selectedtags').append('<span class="join-value selected" data-join-rowid="'+res.insertId+'">'+tagName+'<img src="images/deleterecord.png" class="removetagbutton" title="Deselect Tag"></span>');
							finance.home.collateAndSaveTags($(tagButton).parents('.row'));
							$("#createrulewizard").remove();
						});
			
					}
				}
			});
			console.log('SELECT TAG');
		});
		$('#hometransactionmanager .splitbutton').hide();
		$('#hometransactionmanager .splitbutton').click(function() {
		console.log('SPLIT SINGLE');
		});
		// per table
		$('#hometransactionmanager .approveselectedbutton').click(function() {
			$('#hometransactionmanager input:checked.listrowcheckbox').each(function(key,value) {
				$(this).parents('.row').find('.approvebutton').click();
			});
			console.log('APPROVE MANY');
		});
		$('#hometransactionmanager .tagselectedbutton').click(function() {
			// WIZARD
			$("#createrulewizard .saverulebutton").click(function() {
				var tagName=$(this).parents('#createrulewizard').find('.ruletagselector input[type=text]').first().val();
				if (tagName && tagName.length>0) {
					var tagId=$(this).parents('#createrulewizard').find('input[type=hidden]').first().val();
					if (parseInt(tagId)>0) {
						$(tagButton).parents('.row').find('.list-field-selectedtags').append('<span class="join-value selected" data-join-rowid="'+tagId+'">'+tagName+'<img src="images/deleterecord.png" class="removetagbutton" title="Deselect Tag"></span>');
						finance.home.collateAndSaveTags($(tagButton).parents('.row'));
					} else {
						// save new tag
						db.query(["insert into tags (name) values ('"+tagName+"')"])
						.done(function(res) {
							console.log('saved new tag '+res.insertId);
							$(tagButton).parents('.row').find('.list-field-selectedtags').append('<span class="join-value selected" data-join-rowid="'+res.insertId+'">'+tagName+'<img src="images/deleterecord.png" class="removetagbutton" title="Deselect Tag"></span>');
							finance.home.collateAndSaveTags($(tagButton).parents('.row'));
							$("#createrulewizard").remove();
						});
			
					}
				}
				$('#hometransactionmanager input:checked.listrowcheckbox').each(function(key,value) {
					//$(this).parents('.row').find('.approvebutton').click();
				});
			
				console.log('SAVETAG TO TRANSACTIONS NOW',$(this).parents('#createrulewizard').find('.ruletagselector').html());
				var tagName=$(this).parents('#createrulewizard').find('.ruletagselector input[type=text]').first().val();
				console.log('SAVETAG ',tagName);
				if (tagName && tagName.length>0) {
					console.log('SAVETAG2 ',tagName);
					var tagId=$(this).parents('#createrulewizard').find('input[type=hidden]').first().val();
					console.log('SAVETAG2 ',tagName,tagId);
					if (parseInt(tagId)>0) {
						$(tagButton).parents('.row').find('.list-field-selectedtags').append('<span class="join-value selected" data-join-rowid="'+tagId+'">'+tagName+'<img src="images/deleterecord.png" class="removetagbutton" title="Deselect Tag"></span>');
						finance.home.collateAndSaveTags($(tagButton).parents('.row'));
						$("#createrulewizard").remove();
					} else {
						// save new tag
						db.query(["insert into tags (name) values ('"+tagName+"')"])
						.done(function(res) {
							console.log('saved new tag '+res.insertId);
							$(tagButton).parents('.row').find('.list-field-selectedtags').append('<span class="join-value selected" data-join-rowid="'+res.insertId+'">'+tagName+'<img src="images/deleterecord.png" class="removetagbutton" title="Deselect Tag"></span>');
							finance.home.collateAndSaveTags($(tagButton).parents('.row'));
							$("#createrulewizard").remove();
						});
			
					}
				}
			});
			finance.home.showRuleWizard(plugin);
			console.log('TAG MANY');
		});
		$('#hometransactionmanager .rulefromselectedbutton').click(function() {
			// COMPILE LARGEST COMMON RULE
			var ruleFinal='';
			$("#hometransactionmanager input:checked.listrowcheckbox").each(function() {});
			// WIZARD
			finance.home.showRuleWizard(plugin);
			finance.home.showRuleWizardSearchers(plugin);
			finance.home.showRuleWizardTokens(this,ruleFinal,plugin);
			$("#hometransactionmanagersearch .searchers .search-field-name input").val(ruleText);
			plugin.api.controller.initList();
			$("#saverulewizardbutton").click(function() {
				console.log('save rule');
			});
			
		});
		$('#hometransactionmanager .splitrulefromselectedbutton').hide();
		$('#hometransactionmanager .splitrulefromselectedbutton').click(function() {
			console.log('SPLIT MANY');
		});
		
	},

	bindAccountsCheckboxes : function(plugin) {
		console.log('BIND CHECKS on accts');
		$("#homeaccountsmanager input[type='checkbox']").unbind('click.accountscheckboxes');
		$("#homeaccountsmanager input[type='checkbox']").bind('click.accountscheckboxes',function() {
			console.log('BIND CHECKS on accts CLICK');
			var enabled=$("#homeaccountsmanager input.listrowtoggleall").prop('checked');
			if (enabled)  {
				checkedIds=[];
				$(this).parents('.editablerecords').find('input:checked.listrowcheckbox').each(function() {
					if (parseInt($(this).data('rowid'))>0) checkedIds.push($(this).data('rowid'));
				});
				// no results if toggle all checked but no selected children
				if (checkedIds.length==0) checkedIds.push('-1');
				console.log('updated accounts search critera to ',checkedIds);
				$("#hometransactionmanagersearch .searchers .search-field-account input[type=hidden]").val(checkedIds.join(","));
			} else {
				console.log('updated accounts search critera to EMPTY');
				if (!$(this).hasClass('listrowtoggleall')) $("#homeaccountsmanager input.listrowtoggleall").prop('checked',true);
				$("#hometransactionmanagersearch .searchers .search-field-account input[type=hidden]").val('');
			}
			$('#hometransactionmanagersearch .search-field-name input').keyup();
			console.log(enabled);
			
		});
	// REBIND CLICK EVENTS ON CHECKBOXES TO HANDLE SELECTION _THEN_ UPDATE THE LIST
		/*
			$("#homeaccountsmanager input[type='checkbox'].listrowtoggleall").unbind('click.accountscheckboxes');
			$("#homeaccountsmanager input[type='checkbox'].listrowtoggleall").bind('click.accountscheckboxes',function() {
				//console.log('TOGGLE ALL',$(this).prop('checked'));
				// ALL CHECKBOXES FOLLOW SUIT
				$(this).parents('.editablerecords').find('input.listrowcheckbox').prop('checked',$(this).prop('checked'));
				$(this).parents('.editablerecords').find('input.listrowtogglecollated').prop('checked',$(this).prop('checked'));
				var checkedIds=[];
				if ($(this).prop('checked')==true) {
					$(this).parents('.editablerecords').find('.collatedlistrows').show();
					$(this).parents('.editablerecords').find('input.listrowcheckbox').each(function() {
						if (parseInt($(this).data('rowid'))>0) checkedIds.push($(this).data('rowid'));
					});					
					// no results if toggle all checked but no selected children
					if (checkedIds.length==0) checkedIds.push('-1');
					//console.log('MASTER CHECKED',checkedIds);
				} else {
					$(this).parents('.editablerecords').find('.collatedlistrows').hide();
				}
				$("#hometransactionmanagersearch .searchers .search-field-account input[type=hidden]").val(checkedIds.join(","));
				plugin.api.controller.initList();
				return false;
			});
			$("#homeaccountsmanager input[type='checkbox'].listrowtogglecollated").unbind('click');
			$("#homeaccountsmanager input[type='checkbox'].listrowtogglecollated").click(function() {
				//console.log('III',$(this).parents('.collatedlist').find('.collatedlistrows'));
				$(this).parents('.collatedlist').find('input.listrowcheckbox').prop('checked',$(this).prop('checked'));
				$(this).parents('.collatedlist').find('.collatedlistrows').toggle();
				var checkedIds=[];
				if ($(this).prop('checked')==true) {
					$(this).parent().parent().find('.collatedlistrows').show();
					console.log('MASTER CHECKED',checkedIds);
				} else {
					$(this).parent().parent().find('.collatedlistrows').hide();
				}
				$(this).parents('.editablerecords').find('input:checked.listrowcheckbox').each(function() {
					if (parseInt($(this).data('rowid'))>0) checkedIds.push($(this).data('rowid'));
				});
				// no results if toggle all checked but no selected children
				if (checkedIds.length==0) checkedIds.push('-1');
				
				$("#hometransactionmanagersearch .searchers .search-field-account input[type=hidden]").val(checkedIds.join(","));
				//plugin.api.controller.initList();
				$('#hometransactionmanagersearch .search-field-name input').keyup();
				return false;
			});
		
		
			$('#homeaccountsmanager input[type=checkbox].listrowcheckbox').unbind('change');
			$('#homeaccountsmanager input[type=checkbox].listrowcheckbox').bind('change',function() {
				var checkedIds=[];
				$(this).parents('.editablerecords').find('input:checked.listrowcheckbox').each(function() {
					checkedIds.push($(this).data('rowid'));
				});
				if (checkedIds.length==0) checkedIds.push('-1');
				$(".searchers .search-field-account input[type=hidden]",plugin).val(checkedIds.join(","));
				plugin.api.controller.initList();
				return false;
			})
			*/
	}

};


		