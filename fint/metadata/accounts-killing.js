$.fn.quickDB.defaultOptions.tables={		
	rules:{
		fields: {
			name: {type:'text',label:'Rule',validation:{required:true}},
			filtertext: {type:'text',label:'Match Text',validation:{required:true}},
			startdate: {type:'date',label:'Match Date From'},
			enddate: {type:'date',label:'Match Date To'},
		},
		
	},
	tags:{
		fields: {
			name: {type:'text',label:'Tag',validation:{required:true}},
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
		},
		views: {
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
		
	}
}

