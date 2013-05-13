TODO
restore existing admin and categorise functions
graphing



!TECH NOTES
!!Defining a model
Skeleton structure for table definitions as follows
tables[<tableName>]={
	fields:{<fieldKey>:{
		label:'',
		type:'text|date|...' <and other field specific options>}
	},
	joins:{<joinKey> : {
		label:'',
		table:'',
		condition:'',
		mmTable:'',
		render:'select|livesearch|radio|checkbox|value',allow:{add:'',delete:'',....}
	}
	views:{<viewKey>:{
		joins:'<csv joins referenced here>',
		fields:'<fields part of select statement>'}
	}
	searchers:{}
}



EASY FINANCE SOFTWARE     266783351

The software is designed to minimise the amount of work to prepare personal finance and taxation information.
The target audience is small business and individuals.
The software reduces time spent on data entry by relying on electronic download of transaction records from online banking. 
The software improves the quality of the information by using rule based categorisation to transactions. As the rule set grows, most transactions will be automatically categorised. 
The software allows flexibility in adjusting the transaction data by providing splits and full transaction editing.
The software provides reports and graphical analysis to review the transactions by category and prepare printable tax reports for Australian small business.

There are many financial management packages out there catering to a range of requirements. This software defines itself by - 
1. Cross Platform Web Application. Completely client side browser based software development using javascript. Once the application has been downloaded into a web browser, Internet access is no longer required. The big advantage of using browser based technology is that it can be used on many types of computers including tablets and installation is as easy as visiting a website.
2. Secure Direct Online Banking Import. Import of banking information from online banking directly so electronic banking password stays secure. The main solution available currently requires giving electronic banking password to a third party so they can download information on your behalf which is a major security concern.
3. Smart Text Import. Highly flexible import of information using smart algorithms to extract relevant row data from pasted or uploaded transaction data.
4. Rules based categorisation with unique rule creation wizard.
5. Wizard workflow to ensure up to date transactions and then relevant reporting. Easy to use wizard to guide the user through the import, manage and report process and get the result quickly. Most financial applications are object based showing lists and forms for accounts, transactions, categories etc.

Business Model
The application will be available to be downloaded and used in a web browser for the cost of a membership signup providing personal details and product interest.
The application will sold on the Google Chrome Store with additional features for a per user fee.
Support in using or extending of fixing bugs with the free application provided at hourly rates to support application development.

Advertising revenue income sources built into the free website generate income.
Android and iPhone applications could be optimised for phone and tablet use and deployed into the google and apple markets and charged per user. 
Again providing a free access 'Application' and a paid version with more features.

Development Plan
The first feature complete release of the software is expected 28/2/2013. This initial will include all the features above EXCEPT direct online banking import. This and other features including expanded tax reporting will be developed as part of the next public release.
The software will be developed working towards usable releases each fortnight.


!!Choice of Technology
As well as session, cookies and localStorage, there are more comprehensive storages solutions for persistent data in browsers provided by the Web SQL standard and the IndexedDB standard.
My view is that the Web SQL standard provides tools far and above those provided by the indexedDB standard.  Particularly when using relationships. Specifically being able to join, group, sort, filter, create views, triggers and all the sql magic easily without client side code.
Using a object store introduces other possibilities. Dependant objects or MM relationships can be properties of the parent object in the store. In this case it would not be possible to build indexes on the child objects so searching and direct iteration would be limited.
It would also be possible to replicate the foreign key concept used in relational databases and make an independant store child object a full top level object.
With an object store, the ability to traverse and seek objects will be a primary consideration in the implementation of the relationship.

Chrome and Webkit browsers including Safari, iOS and Android support the Web SQL standard. Mozilla have rejected it and the W3C have deprecated the Web SQL standard leading to concerns about the long term viability of software developed using the technology.
While the long term viability question is serious, 1. I believe that developers using the advanced features will drive adoption of the technology and force acceptance by Mozilla. (The main issue as I understand it is the availability of at least two implementations so we need an alternative to sqlLite) 2. In the medium term future (say 5 years) it is unlikely that the Web SQL features will be removed from the Webkit and Chrome browsers so there is at least that kind of viable lifetime for a software product. This allows plenty of lead time to adapt a product to the shifts in technology.
Possible the most significant impact of choosing to use Web SQL is to exclude Firefox users. Chrome is easy to install on all platforms. Webkit is also available cross platform.

The particular project I have in mind (fint) uses Chrome apis for web driving so functionality is limited for  Safari, iOS and Android users.
I also see that the target market is tablet users as well as web users and Web SQL is well supported in Android and iOS
So my choice of technology is to use the Web SQL standard and write off Firefox. 


NOTES FROM ANZ MONEY MANGER
http://www.yodlee.com/developers-and-alliances/yodlee-apis/
- CONS
	- no manual import of trns (initially only brings 3 months no good for tax)
	- web based POST so SLOWWWWWW
	- automatic categorisation a bit too aggressive and can't change default rules only add new custom rules
- FEATURES
- automated spending categories
- automated transfer categories
- multi user access with read only
- grouping of accounts
- account summary
- transaction editor
- bill reminders
- real estate and mortgage, investments
- rewards plans
- splits - split a transaction into two related records of the same total with different categories
- net worth
- Expenses Reports
	- Cash Flow Analysis
	- Expense Analysis - search time range and pie chart of expense categories and table showing category, percent and amount for time range 
	- Spending by Category - bar graph of amount by date for selected category
	- Budget vs. Actual Spending - search time range,accounts, categories view graph total budget by category and table showing budget, actual and variance for time period
	- Credit Card Utilisation
	- Personalised Reports - advanced search transactions
	- Set Budget Goals - - table showing this month, average per category set budget per category, notifications for budget blowout
!!!! Taxation details
	- cars
	- shares
	- depreciation
	
!!!! Exploration tools - savings, investments

!!!! Invoicing and reconciliation
- budget goals notifications
- financial calendar







Release Schedule

3/12/12  RELEASE 1 - UI prototype     
BZR LAUNCHPAD revision 1
Prototype - HTML and basic JS to implement the UI
Import - basic import in fixed format

18/12/12 RELEASE 2 - Record editing and categorise wizard  
BZR LAUNCHPAD revision 2
Record editing for accounts, transactions, rules, categories
Categorise wizard first cut with tokenise on click and list filter for current rule
Static demo reports

7/1/12 RELEASE 3 - Reporting and tidy up
Tax/Personal Profit/Loss by Category
Click through reports to filtered transactions
Wizard workflow to guide user through the process from import to report.
User documentation

18/1/13 RELEASE 4 
Transaction Splits
Smart Import
Start user testing with small select group to iron out bugs.

2/2/13 RELEASE 5 Beta Release 1
User feedback integration
Develop website with user documentation and free access to use the application.
Send out testing requests to a larger group of personal contacts with testing and feedback criteria.
Bug Fixes


14/2/13 RELEASE 4 Testing Release 1
Develop website with user documentation and free access to use the application.
Send out testing requests to a larger group of personal contacts with testing and feedback criteria. 
Bug Fixes

28/2/13 RELEASE 5 Public Release 1
List website in search engines
Include banner advertising in website
Include facebook like button
Bug Fixes and Feedback


In future releases
- direct online banking import
- financial calendar
- budget goals and notifications
- invoicing and reconciliation
- online/between computers/tablets synchronisation of locally stored financial records



NOTES
Coming to release 2, still no graphing or reporting, just starting on categorisation with two days to release!!
Issues
- primary keys. sqllite supports automatic rowid column. what methods rely on pk
	- 
- tweaks for full text search fts3
- joins/view for rules/categories/transactions
# uncategorised transactions
select * from transactions tr where tr.rowid not in (select t.rowid from transactions t  join rules r where t.description MATCH r.rule);
# transactions with category
select t.*,r.category from transactions t  join rules r where t.description MATCH r.rule
# transactions with top level category ??
# transactions categories that are children of ... ??




SIMILAR SOFTWARE FOR ANDROID
ACORE Australian tax https://play.google.com/store/apps/details?id=acore.TaxAustralia&feature=search_result#?t=W251bGwsMSwyLDEsImFjb3JlLlRheEF1c3RyYWxpYSJd


LIBRARIES
Phonegap - for native compilation to various phones
Thumbs - for touch events http://mwbrooks.github.com/thumbs.js/
Bluff or some graphing library ??
web sql API 
	- available in chrome, android, safari, opera has better support in mobile browsers ie android and IOS
	- INDEXED DB is available in IE10, firefox, chrome and is the official path forward


! RELEASES
CURRENT
||||| RELEASE 2 due 16/12/12  -  UI and minimal functioning database to get the basic outline of import, categorise, report	



DONE !!!! database structure and API
	- transactions
	- categories and mm?? relations
	- rules
		- API
		- transaction - import, (executeQuery -> getAll, get?? ), deleteall, deleteone,.....
		- rules - CRUD, find overlap
		- categories - 

DONE !!!! user messages via header - import, categorise

!!!! marking transactions by bank account on import 
	- import to selector
	- mod db add field, set value on import

!!!! categorise records create rule wizard
	- real records listing
	- row click to wizard
		- deletable description tokens
		- category selector

!!!! UI for rules/categories records management
	- DONE list/forms for rules
	- tree editor for categories

!!!! reports 
		- from real data
		- pie graphs of subcategories
		- marking categories as bank accounts (no reporting)
			- other similar special rules
!!!! Improved import
- auto detection
- show hightlight and scroll to errors in refused import data 
- validation - dates, sequential dates?, numbers, dupes, balance


PENDING
!!! RELEASE 3 - 
!!!! Phonegap build

!!! Transactions splits for multi category transactions eg elec/phone ...

!!!! Layout and positioning for multi platforms, rotation

!!!! Transaction record manager - for fixing imported data
- BAS, home energy audit, tax form


!!COMPLETE








!FINT Financial Toolkit
Application
- tie to scrape extension
- finish categorise
- reports
- password to access


!Scraping
- tried for generalisable solution from config using css3 selectors
- using chrome extension tabs permission to find/drive bank window
- scrapes accounts then transactions for each account
- in developing an abstraction to scrape a bank site
	- scrape accts and trns
	- navPath 
	- uses chrome.storage.local for scrape state to determine next step on register
		- accounts {name,number,transactions[{date,description,amount,balance}], haveAllTransactions)
	- the broad steps are 
		- login
		- find/scrape accounts list page
			- foreach account, find/scrape transactions search page including fill search form with parameterised account number
	- so the assumptions include
		- there is an accounts list page showing account names and numbers
		- there is a transactions search page with a select input that has labels that match the account numbers	
		- there is a consistently available navigation start point for - logout, accounts list, transactions search
		- that the DOM and attributes and labels are stable. Dynamic learning will be included in the future.!!


 TODO
- save to database (check anz import function)
- ?? logging for config.debug>1
- ?? error handling and feedback for failure to scrape - download updates ..
DONE
- fix mash result arrays
- wrapper method for selectors to allow for LINKTITLE:: and ACCOUNTFIELD::name|number
	- hmm so far setElement,clickElement support LINKTITLE::
- delays between clicks


FINT
* Sync Tool on home page
- bg
	- refresh
	- status - no banking .. downloading
	- notifications
* Transactions search on home page


!Website
- description
- features
	- import
	- categorisation
	- report
	- cross platform and synchronised between chromes
- security
- source code

- ?? submit scrape recipes


##### LOG #####
25/11/12	Start Project

28/11/12	Migrate sample application to abstracted quickdb.js
30/11/12	Migrate quickdb.js to plugin format quickdb.jquery.js
3/12/12 	Add create table feature to quickdb.jquery.js
4/12/12		Chat with Carey and explore yodlee and anz money manager
			Add public functions for quickdb db,messages
18/12/12 	Release 2, meeting Ed/Iona
19/12/12	Research javascript manipulation of online banking			
20-23/12	Research chrome webapp apis. cross document messaging. Add iframe to anz site with cross messaging.
21-29/12 	Bank scrape component first cut of configurable scraper
15/1		Still chugging relns 




