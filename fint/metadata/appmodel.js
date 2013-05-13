$.fn.quickDB.defaultOptions.tables={
	applications: {
		fields:{
			name: {type:'text',label:'Name',validation:{required:true}},
			description: {type:'textarea',label:'Description'},
			author: {type:'text',label:'Author',required:true},
			extra:{type:'textarea',label:'',depends:{field:'author',isOneOf:'Steve,Joe'}}
		},
		joins:{
			tables:{
				label:'Tables',
				table:'tables',
				condition:'tables.applications=applications.rowid'
			}
		},
		views: {
			default:{
				joins: 'tables',
				fields: "applications.name as name,applications.description as description,applications.author as author,GROUP_CONCAT(tables.name,',') as tables,','||GROUP_CONCAT(tables.rowid,',')||',' as _tables_ids",
				groupBy: 'applications.rowid'
			}
		}
	},
	tables :{
		fields:{
			name: {type:'text',label:'Name'}
		},
		joins:{
			fields:{
				label:'Fields',
				table:'fields',
				condition:'fields.tables=tables.rowid'
			}
		},		
		views: {
			default:{
				joins: 'fields',
				fields: "tables.name as name, GROUP_CONCAT(fields.name,',') as fields,','||GROUP_CONCAT(fields.rowid,',')||',' as _fields_ids",
				groupBy: 'tables.rowid'
			}
		}
	},
	fields :{
		fields:{
			label: {type:'text',label:'Label'},
			name: {type:'text',label:'Name'},
			type: {type:'select',label:'Data Type',values:{'text':'Text','textarea':'Textarea','rte':'Document','date':'Date','datetime':'Date and Time','time':'Time','select':'Select','radio':'Radio','checkbox':'Checkbox','boolean':'Boolean','email':'Email','url':'Link','color':'Color','file':'File','image':'Image','svg':'Drawing','sheet':'Spreadsheet'}}
			
		},
		views: {
			label:{
				fields: "fields.label || ' ' || fields.name || ' ' || fields.type as label"
			}
		}
	}
}
	