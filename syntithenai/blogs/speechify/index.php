<?php 
$relPath='../../'; 
include "../../template/template_start.php" 
?>
<link rel="stylesheet" href="../../../lib/jquery-ui/jquery-ui.css" type="text/css" media="all" />
<link rel="stylesheet" href="../../../lib/speechify/jquery.speechify.css" type="text/css" media="all" />

<script src="../../../lib/jquery.js" type="text/javascript"></script>
<script src="../../../lib/jquery-ui.js" type="text/javascript"></script>
<script src="../../../lib/speechify/jquery.speechify.js" type="text/javascript"></script>
<script>
$.fn.speechify.relPath='../../../lib/speechify/';
</script>
<script src="../../../lib/speechify/lib/speak.js/speakClient.js" type="text/javascript"></script>
<script>
$(document).ready(function() {
	$('#content').speechify();
	$('#sayitbutton').click(function() {
		$.fn.speechify.say($('#sayit').val());
		return false;
	})
});
</script>
		<div id="intro" >		
		<h1>10/05/2013 Speech Recognition Jquery Style</h1>
		<p>The latest versions of chrome make speech recognition available through javascript objects. Members of the Chrome team have put together a <a href='https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html' target='_new' >W3C draft</a> outlining an API and have implemented some of the API already from version 25 of Chrome Browser for desktop. </p><p>
		To make it easy to add speech to existing sites I've written a jQuery plugin <b>jquery.speechify.js</b>. </p>
		<p>With HTML5 as a cross platform development environment, the possibilities and challenges of working with various input availabilities are exciting.
		Where speech is available, workflows could be optimised to minimise speech recognition options ensuring accuracy.
		</p><p>The childrens games software industry is great inspiration for one direction voice, telling kids what to click.
		Now we can do games and applications where we go both ways !! In the browser !!!!! Thanks Google.
		</div>

		<div id='theplugin' >
		<h3>About the plugin</h3>
		The plugin is called with DOM context in the typical style
		<pre>
$('body').speechify({commands:{'do stuff':function() {console.log('busy doing');}}});
		</pre>
		The plugin provides various assistance.
		<ul>
			<li>It starts a speech recogniser. Each utterance is used </li>
			<ul><li>to search for submit or button or image inputs with a name matching the utterance</li>
				<li>to search for commands matching the utterance</li>
				<li>to fill text into currently focused inputs, textareas and contenteditables</li>
			</ul>
			<li>It adds a microphone on/off button in the top right of the window</li>
			<li>It binds focus events to inputs,textareas and contenteditables to restart voice recognition</li>	
		</ul>
		The plugin also leverages <b>speak.js</b> provide a public method speak to convert text to speech audio without a network request.
		<pre>
$.fn.speechify.speak('short sentence');
		</pre>
		<textarea id='sayit' ></textarea><input type='submit' id='sayitbutton' >
		</div>
		
		<div id='texttospeech' >
		
<pre>
http://translate.google.com/translate_tts?tl=en&q=testing
b=new Audio('http://translate.google.com/translate_tts?tl=en&q=testing'); 
b.load();
b.addEventListener("load", function() { 
  b.play(); 
  console.log('ddd');
}  
$('body').append($('<!--iframe src="http://translate.google.com/translate_tts?tl=en&q=whatami" -->'));
</pre>
		</div>
	
		<div id='apibasics' >
		<h3>Raw API Basics</h3>
		You can create a recogniser and start it</p>
		<pre>
var speechRecognitionHandler = new webkitSpeechRecognition();
//https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html#dfn-continuous
speechRecognitionHandler.continuous = true;
speechRecognitionHandler.lang='en-AU';
speechRecognitionHandler.start();
		</pre>

		<p>then bind events to the recogniser</p>
		<pre>
speechRecognitionHandler.onstart = function(){
	console.log('start speech recognition');
};
speechRecognitionHandler.onerror = function(e){
	console.log('Something wrong happened', e.error);
};
speechRecognitionHandler.onresult = function(event){
	for (var i = event.resultIndex; i < event.results.length; ++i) {
		if (event.results[i].isFinal) {
			transcript = $.trim(event.results[i][0].transcript);
		}
	}
};
speechRecognitionHandler.onend = function(e){
	console.log('done for all');
};
		</pre>
		<img src='getsmart.jpg' />
		</div>
		
		<div id='references'>	
		<h1>References</h1>
			<div><a href='https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html#speechreco-attributes' >Web Speech API</a></div>
			<div><a href='http://www.w3.org/TR/speech-grammar/' >SpeechGrammar objects</a></div>
			http://www.w3.org/TR/nl-spec/   Natural Language Semantics Markup Language for the Speech Interface Framework
		<a href='http://translate.google.com/translate_tts?tl=en&q=testing'>Testing</a>
http://www.jtalkplugin.com/#instructions_server
https://github.com/kripken/speak.js

</div>
<?php include "../template/template_end.php" ?>