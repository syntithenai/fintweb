var FintDefaults= {
  categories:[
		{'rowid':'1',description:'Income',parent:''},
		{'rowid':'2',description:'Taxable Income',parent:'1'},
		{'rowid':'3',description:'Non Taxable Income',parent:'1'},
		{'rowid':'4',description:'Expenses',parent:''},
		{'rowid':'5',description:'Business Expenses',parent:'4'},
		{'rowid':'6',description:'Personal Expenses',parent:'4'},
		{'rowid':'7',description:'Phone',parent:'5'},
		{'rowid':'8',description:'Stationery',parent:'5'},
		{'rowid':'9',description:'Repairs/Maintenance',parent:'5'},
		{'rowid':'10',description:'Electricity',parent:'5'},
		{'rowid':'11',description:'Interest',parent:'5'},
		{'rowid':'12',description:'Rent',parent:'5'},
		{'rowid':'13',description:'Other',parent:'5'},
		{'rowid':'14',description:'Food',parent:'6'},
		{'rowid':'15',description:'Car',parent:'6'},
		{'rowid':'16',description:'Electricity',parent:'6'},
		{'rowid':'17',description:'Other',parent:'6'},
		{'rowid':'18',description:'Phone',parent:'6'},
		{'rowid':'19',description:'Clothing',parent:'6'},
		{'rowid':'20',description:'Entertainment',parent:'6'}	,
		{'rowid':'21',description:'Internal Transfer',parent:''}
	],
	rules:[
		{'rowid':'1',rule:'"TRANSFER FROM NICHOLAS GRAHAM- NGHENVIRONMENTAL"',category:'2'},
		{'rowid':'2',rule:'"TO CSA OFFICIAL RECEIP"',category:'17'},
		{'rowid':'3',rule:'"CALTEX"',category:'15'},
		{'rowid':'4',rule:'"TRANSFER FROM ATO"',category:'3'},
		{'rowid':'5',rule:'"TRANSFER FROM HCU"',category:'2'},
		{'rowid':'6',rule:'"TRANSFER FROM RYAN B E"',category:'3'},
		{'rowid':'7',rule:'"ANZ INTERNET BANKING FUNDS TFER TRANSFER" NEAR/1 "TO 012525576016945"',category:'21'},
		{'rowid':'8',rule:'"ANZ INTERNET BANKING BPAY TELSTRA CORP LTD"',category:'18'}
	],
	accounts:[
		{'rowid':'1',description:'ANZ Day to Day',accountnumber:'11111111111'},
		{'rowid':'2',description:'ANZ Saver',accountnumber:'22222222222'},
		{'rowid':'3',description:'ANZ Credit Card',accountnumber:'333333333333'},
		{'rowid':'4',description:'ING Saver',accountnumber:'444444444444'}
	]

}