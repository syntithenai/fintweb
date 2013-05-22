var root;
FintUI.initFunctions.reports=function()  {
	$('#reports').tabs($.extend(FintUI.tabSettings,{active:1}))
}

FintUI.activateFunctions.reports=function()  {
//	console.log('activate reports');
}

FintUI.initFunctions.personalsummary=function(settings)  {
	console.log('init personalsummary');
//select tags.rowid rowid,tags.name tagname,tags.parenttags parent from tags left join tags parenttags on parenttags.rowid=tags.parenttags
 
 //select name,sum(transactions.amount) sum from tags left join mm_transactionstags on  tags.rowid=mm_transactionstags.tags left join transactions on transactions.rowid=mm_transactionstags.transactions group by tags.rowid
	var plugin=$('#reportsmanager').quickDB(settings)[0];
	$(plugin).hide();
	// populate accounts picklist
	//console.log('POP ACCOUTS PICKLIST');
	var tags={};
	plugin.api.model.executeIteratorQuery('select tags.rowid rowid,tags.name tagname,tags.parenttags parent,sum(transactions.amount) sum from tags left join tags parenttags on parenttags.rowid=tags.parenttags left join mm_transactionstags on tags.rowid=mm_transactionstags.tags left join transactions on transactions.rowid=mm_transactionstags.transactions group by tags.rowid order by parenttags.rowid;',[],function(row) {
		console.log('row',row);
		if (!tags[row.rowid]) tags[row.rowid]={children:[]};
		tags[row.rowid].name=row.tagname;
		tags[row.rowid].parent=row.parent;
		tags[row.rowid].amount=row.sum;
	},function() {
		// assign parents
		$.each(tags,function(key,value) {
			if (value.parent>0) {
				tags[value.parent].children.push(value);
			}
		});
		// sum children and flag parents
		var recursiveSum=function(tag) {
			if (tag.recursiveSum!=undefined)  {
				console.log('been here',tag.recursiveSum);
				return tag.recursiveSum;
			} else {
				var sum=tag.amount;
				$.each(tag.children,function(key,value) {
					sum+=recursiveSum(value);
				});
				console.log('calc sum',sum);
				//tag.recursiveSum=sum;
				return sum;
			}
		}
		var parents=[]; // tags with no parents
		$.each(tags,function(key,value) {
			value.recursiveSum=recursiveSum(value);
			value.color='blue';
			value.size=value.recursiveSum;
			if (!value.parent) parents.push(value);
		});
		root={'name':'','children':parents};
		$('#vis').data('sunburstdata',root);
		$('#vis').zoomableSunburst();
	//	d3.json("lib/wheel.json", function(json) {
			//initWheel([root]);//json);
			//console.log('done',root); //,JSON.stringify(root));
		
	//	});
	});
	
}

FintUI.activateFunctions.personalsummary=function()  {
//	console.log('activate personalsummary');
}

FintUI.initFunctions.taxsummary=function()  {
//	console.log('init taxsummary');
}

FintUI.activateFunctions.taxsummary=function()  {
//	console.log('activate taxsummary');
}