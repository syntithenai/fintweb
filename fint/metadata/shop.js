$.fn.quickDB.defaultOptions.tables={
	categories:{
		fields: {
			name: {type:'text',label:'Name'},
			image: {type:'image',label:'Image'},
		},
		views: {
			label: { fields:'categories.name as label' },
			default: { fields:'categories.name as name,file,password,sheet' }
		}
	},
	products : {
		fields: {
			name: {type:'text',label:'Name'},
			price: {type:'text',label:'Price'},
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
				condition:'banks.rowid=mm_bankscategories.banks and categories.rowid=mm_bankscategories.categories',
			}
		},
		views: {
			label: { fields:'products.name as label' },
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

}
