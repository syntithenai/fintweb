$.fn.quickDB.defaultOptions.tables={
	projects: {
		fields:{
			name: {type:'text',label:'Name'},
			description: {type:'textarea',label:'Description'}
		},
		joins: {
			documents:{
				label:'Documents',
				table:'documents',
				condition:'documents.projects=projects.rowid',
				allow : {select :'false'}
			},
			spreadsheets:{
				label:'Spreadsheets',
				table:'spreadsheets',
				condition:'spreadsheets.projects=projects.rowid',
				allow : {select :'false'}
			},
			drawings:{
				label:'Drawings',
				table:'drawings',
				condition:'drawings.projects=projects.rowid',
				allow : {select :'false'}
			}	
		},
		views: {
			default:{
				joins: 'documents,spreadsheets,drawings',
				fields: "projects.name as name,projects.description as description,GROUP_CONCAT(spreadsheets.name,',') as spreadsheets,','||GROUP_CONCAT(spreadsheets.rowid,',')||',' as _spreadsheets_ids,GROUP_CONCAT(drawings.name,',') as drawings,','||GROUP_CONCAT(drawings.rowid,',')||',' as _drawings_ids,GROUP_CONCAT(documents.name,',') as documents,','||GROUP_CONCAT(documents.rowid,',')||',' as _documents_ids",
				groupBy: 'projects.rowid'
			}
		}
	},
	documents:{
		fields:{
			name: {type:'text',label:'Name'},
			file: {type:'rte',label:''}
		}
	},
	spreadsheets:{
		fields:{
			name: {type:'text',label:'Name'},
			file: {type:'sheet',label:''}
		}
	},
	drawings:{
		fields:{
			name: {type:'text',label:'Name'},
			file: {type:'svg',label:''}
		}
	}

}
	