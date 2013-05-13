<?php 
$relPath='../'; 
include "../template/template_start.php" 
?>
	<div id='bloglist' >
	<div class='blogitem' >
	<a class='morebutton' href='speechify/index.php' >READ MORE</a>
	<h1>10/05/2013 Speech Recognition Jquery Style</h1>
	<p>The latest versions of chrome make speech recognition available through javascript objects. The chrome team have put together a <a href='https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html' target='_new' >W3C draft</a> outlining an API and have implemented some of the API already. You can create a recogniser and start it</p>
<pre>
var speechRecognitionHandler = new webkitSpeechRecognition();</pre>
	</div>
	</div>
<?php include "../template/template_end.php" ?>