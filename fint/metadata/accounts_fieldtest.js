$.fn.quickDB.defaultOptions.tables = {
	categories:{
		fields: {
			name: {type:'text',label:'Category',dvalidation:{required:true,match:[{rule:"no",message:"You must type no somewhere"},{rule:"way",message:"You must type way somewhere"}]}},
			image: {type:'image',label:'image'},
			file: {type:'file',label:'file'},
			color: {type:'color',label:'color',validathion:{required:true},depends:{'field':'name'}},
			date: {type:'date',label:'date'},
			datetime: {type:'datetime',label:'datetime'},
			email: {type:'email',label:'email'},
			month: {type:'month',label:'month'},
			number: {type:'number',label:'number'},
			range: {type:'range',label:'range'},
			search: {type:'search',label:'search'},
			tel: {type:'tel',label:'tel'},
			time: {type:'time',label:'time'},
			url: {type:'url',label:'url'},
			week: {type:'week',label:'week'},
			password: {type:'password',label:'password',dvalidation:{required:true,password:true}},
			rte: {type:'rte',label:'rte'},
			textarea: {type:'textarea',label:'textarea',dvalidation:{required:true}},
			svg:{type:'svg',label:'svg'},
			sheet:{type:'sheet',label:'sheet'},
			selecttype: {type:'select',label:'Select',values:{1:'this is the stuff',2:'that was the stuff',3:'what stuff'},validation:{required:true}},
			radio: {type:'radio',label:'Radio',values:{'choose A':'choose A',2:'chooseB','aaaa':'chooseC'}},
			checkbox: {type:'checkbox',label:'checkbox',values:{1:'Apples',2:'Oranges',3:'Pineapple'},dvalidation:{required:true}},
			bool: {type:'boolean',label:'Boolean'}
			
		},
		views: {
			label: { fields:'categories.name as label' },
			ddefault: { fields:'name,file,image' },
			ddefault: { fields:'categories.name as name,selecttype,radio,checkbox,bool' },
			default: { fields:'categories.name as name,color,date,datetime,email,month,range,search,tel,time,url,week,file,image,password,textarea,rte,selecttype,radio,checkbox,bool' }
		}
	},
	banks: {
		fields: {
			name: {type:'text',label:'Bank'}
		},
		joins:{
			accounts:{
				label:'Accounts',
				table:'accounts',
				condition:'accounts.banks=banks.rowid',
				allow : {select :'false'}
			},	
			categories: {
				label:'Categories',
				table:'categories',
				mmTable:'mm_bankscategories',
				condition:'banks.rowid=mm_bankscategories.banks and categories.rowid=mm_bankscategories.categories or banks.rowid<0',
			}
		},
		views: {
			label: { fields:'banks.name as label' },
			default : { joins: 'accounts,categories',fields:"banks.name name,GROUP_CONCAT(accounts.name,',') as accounts,','||GROUP_CONCAT(accounts.rowid,',')||',' as _accounts_ids,GROUP_CONCAT(categories.name,',') as categories,','||GROUP_CONCAT(categories.rowid,',')||',' as _categories_ids",groupBy:'banks.rowid',filter:'' ,collateFields:'accounts,categories',collateToken:','
			}
			//,form:{} // copied from default and tweaked below
		},
		searchers: {
			default : {
				search: {
					label:'Search',
					name: {type: 'text','fields':'banks.name,accounts.name,accounts.number'}
				}	
			}
		}
	},
	accounts: {
		fields: {
			name: {type:'text', label:'Account'},
			number: {type:'text', label:'Number'}
		},
		joins: {
			banks:{
				label:'Bank',
				table:'banks',
				condition:"accounts.banks=banks.rowid",
				render:'select',
				allow : {edit :'false'}
			},
			transactions: {
				label:'Transactions',
				table:'transactions',
				condition:'transactions.accounts=accounts.rowid',
				allow : {select :'false'}	
			}	
		},
		views: {
			label:{fields:"accounts.name || ' ' || accounts.number as label"},
			default: { joins: 'banks', fields:"accounts.name name,accounts.number as number,banks.name as banks,banks.rowid as _banks_ids",groupBy:'accounts.rowid'}	,
		}
	},
	transactions:{
		fields: {
			date: {type:'date', label:'Date'},
			description: {type:'text', label:'Description'},
			amount: {type:'text', label:'Amount'}
		},
		joins: {
			banks:{
				label:'Bank',
				table:'banks',
				condition:'accounts.banks=banks.rowid',
				render:'value'
			},
			accounts:{
				label:'Account',
				table:'accounts',
				condition:'accounts.rowid=transactions.accounts',
				render:'value'
			}		
		},
		views: {
			label:{ fields:"date || ' $' || amount || ' ' || description as label" },
			default: { joins: 'accounts', fields:"accounts.rowid as _accounts_ids,transactions.description as description,transactions.amount as amount,transactions.date as date,accounts.name||accounts.number as accounts"}	
		}
	}
}
