$.fn.quickDB.defaultOptions.tables={		
	rules:{
		fields: {
			name: {type:'text',label:'Rule',validation:{required:true}},
			filtertext: {type:'text',label:'Match Text',validation:{required:true}},
			startdate: {type:'date',label:'Match Date From'},
			enddate: {type:'date',label:'Match Date To'},
		},
		joins:{
			accounts:{
				label:'Match Account',
				table:'accounts',
				condition:'accounts.rowid=rules.accounts',
				cdonditionFields:{'accounts':[],'rules':[{'field':'accounts'}]},
			},
			tags:{
				label:'Tag',
				table:'tags',
				condition:'tags.rowid=rules.tags',
			}
		},
		views: {
			label: { joins:'',fields:"rules.name as label",orderBy:'label' }, 
			default: { joins:'tags,accounts',fields:"rules.name as name,','||GROUP_CONCAT(tags.rowid,',')||',' as _tags_ids, GROUP_CONCAT(tags.name,',') as tags,rules.filtertext as filtertext,rules.startdate as startdate,rules.enddate as enddate,','||GROUP_CONCAT(accounts.rowid,',')||',' as _accounts_ids, GROUP_CONCAT(accounts.name,',') as accounts ",groupBy:"rules.rowid",orderBy:'name' }
		}
	},
	tags:{
		fields: {
			name: {type:'text',label:'Tag',validation:{required:true}},
			isBudget: {type:'checkbox',label:'Budget'},
			budgetMonthlyTarget: {type:'text',label:'Monthly Budget Amount',requires:'isBudget'},
		},
		joins:{
			parenttags:{
				label:'Parent',
				table:'tags',
				condition:'parenttags.rowid=tags.parenttags',
			}
		},
		views: {
			label: { joins:'',fields:"tags.name as label",orderBy:'label' }, 
			default: { joins:'parenttags',fields:"','||GROUP_CONCAT(parenttags.rowid,',')||',' as _parenttags_ids,tags.name as name, GROUP_CONCAT(parenttags.name,',') as parenttags",groupBy:"tags.rowid",orderBy:'parenttags,name',searchers: {
				name: {label:'', type: 'text','fields':'tags.name,parenttags.name'},
			} }
		}
	},
	ebankingsites: {
		fields: {
			name : {type:'text',label:'Name',validation:{required:true}},
			method : {type:'textarea',label:'Method'}
		}
	},
	banks: {
		fields: {
			name: {type:'text',label:'Bank',validation:{required:true}},
			logo: {type:'file',label:'Logo'}
		},
		views: {
			label: { fields:'banks.name as label' },
			default : { joins: '',fields:"banks.name name",groupBy:'banks.rowid',filter:'' ,collateFields:'accounts',collateToken:','
			}
		}
	},
	accounts: {
		fields: {
			name: {type:'text', label:'Account',validation:{required:true}},
			number: {type:'text', label:'Number'}
		},
		joins: {
			banks:{
				label:'Bank',
				table:'banks',
				condition:"banks.rowid=accounts.banks",
			}
			,ebankingsites:{
				label:'Online Banking',
				table:'ebankingsites',
				condition:"accounts.ebankingsites=ebankingsites.rowid",
			}
		},
		views: {
			label:{fields:"accounts.name || ' ' || accounts.number as label",filter:"",groupBy:'accounts.rowid'},
			ddefault: { joins: 'banks,ebankingsites', fields:"accounts.name name,accounts.number as number,GROUP_CONCAT(banks.name,',') as banks,','||GROUP_CONCAT(banks.rowid,',')||',' as _banks_ids,GROUP_CONCAT(ebankingsites.name,',') as ebankingsites,','||GROUP_CONCAT(ebankingsites.rowid,',')||',' as _ebankingsites_ids",filter:"",groupBy:'accounts.rowid'}	,
			default:{ joins: 'banks', fields:"GROUP_CONCAT(banks.name,',') as banks,','||GROUP_CONCAT(banks.rowid,',')||',' as _banks_ids,accounts.name name,accounts.number as number",filter:"",groupBy:'accounts.rowid',searchers: {
				name: {label:'', type: 'text','fields':'name,number,banks'},
			}}	
			//,transactions.rowid as _transactions_ids,transactions.description as transactions
		}
	},
	transactions:{
		fts:true,
		fields: {
			date: {type:'date', label:'Date',validation:{required:true}},
			description: {type:'text', label:'Description',validation:{required:true}},
			amount: {type:'text', label:'Amount',validation:{required:true}},
			balance: {type:'text', label:'Balance'},
			split: {type:'text', label:'Split Parent'},
			comment: {type:'textarea', label:'Comment'},
			status: {type:'text	', label:'Status'}
		},
		joins: {
			accounts:{
				label:'Account',
				table:'accounts',
				condition:'accounts.rowid=transactions.accounts',
				render:'value'
			},
			banks:{
				label:'Bank',
				table:'banks',
				condition:'banks.rowid=accounts.banks',
				render:'value'
			},
			selectedtags:{
				label:'Tags',
				table:'tags',
				condition:'selectedtags.rowid=mm_transactionstags.tags',
				mmTable:'mm_transactionstags',
				mmTableCondition:'transactions.rowid=mm_transactionstags.transactions',
				render:'value'
			},	
			ruleswithtags:{
				label:'Auto Tags',
				table:'rules',
				condition:"transactions.rowid in (select rowid from transactions where description match ruleswithtags.filtertext)  left join tags ruletags on ruletags.rowid=ruleswithtags.tags",
				conditionFields:{'transactions':[],'rules':[{'field':'tags'}]},
			}
		},
		views: {
			label:{ fields:"date || ' $' || amount || ' ' || description as label" },
			form: { 
				joins: 'accounts,selectedtags', 
				fields:"accounts.name||accounts.number as accounts,accounts.rowid as _accounts_ids,transactions.description as description,transactions.amount as amount,transactions.date as date,transactions.balance as balance,transactions.split as split,transactions.comment as comment,selectedtags.name as selectedtags,selectedtags.rowid as _selectedtags_ids",
				groupBy:'transactions.rowid',
			},
			list: {
				joins: "accounts,selectedtags,banks,ruleswithtags",
				fields: "accounts.name||' '||accounts.number as accounts,accounts.rowid as _accounts_ids,transactions.date,transactions.description,transactions.amount,transactions.balance,group_concat(selectedtags.name) as selectedtags,group_concat(selectedtags.rowid) as _selectedtags_ids,group_concat(ruletags.name) as ruleswithtags,group_concat(ruletags.rowid) as _ruleswithtags_ids, transactions.status status",
				groupBy: "transactions.rowid",
				searchers: {
					name: {label:'Search', type: 'text','fields':'description'},
					date: {label:'Date', type: 'date','fields':'date'},
					type: {label:'', type: 'radio',dfields:'status',options:
						[
							{value:'all',label:'All',sqlSort:'date desc',sql:'(transactions_list.status > 0 or (1=1))'},
							{value:'pending',label:'TODO',sql:'((1=1) or (transactions_list.status <= 0 or transactions_list.status is null))',sqlSort:'ruleswithtags, selectedtags'}
						]
					},
					account: {label:'Account', type: 'livesearch',fields:'accounts',hidde:true}
				}
			},
			shortlist: {
				joins: "accounts,selectedtags,banks,ruleswithtags",
				fields: "accounts.name||' '||accounts.number as accounts,accounts.rowid as _accounts_ids,transactions.date,transactions.description,transactions.amount,transactions.balance,group_concat(selectedtags.name) as selectedtags,group_concat(selectedtags.rowid) as _selectedtags_ids, transactions.status status",
				groupBy: "transactions.rowid",
				searchers: {
					name: {label:'Search', type: 'text','fields':'description'},
					date: {label:'Date', type: 'date','fields':'date'},
					type: {label:'', type: 'radio',dfields:'status',options:
						[
							{value:'all',label:'All',sqlSort:'date desc',sql:'(transactions_list.status > 0 or (1=1))'},
							{value:'pending',label:'TODO',sql:'_selected_tags_ids=null',sqlSort:'ruleswithtags, selectedtags'}
						]
					},
					account: {label:'Account', type: 'livesearch',fields:'accounts',hidde:true}
				}
			}
		}
	}
}

