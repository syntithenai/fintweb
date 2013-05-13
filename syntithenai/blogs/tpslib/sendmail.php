<?php

if ($_POST['sendmailpassword']=='niceviewovertathra')  {
	//print_r($_POST);
	//return;
	// multiple recipients
	$to  = 'graham.a.roberts@det.nsw.edu.au';
	//$to  = 'syntithenai@gmail.com';
	// note the comma
	//$to .= ', '.'wez@example.com';

	// subject
	$subject = $_POST['date'].' Class '.$_POST['schoolClass'].'  '.$_POST['title'];
	// message
	$message = '
	<html>
	<head>
	  <title>'.$_POST['date'].' '.$_POST['title'].'</title>
	</head>
	<body>
	 <div>'.$_POST['message'].'</div>
	</body>
	</html>
	';

	// To send HTML mail, the Content-type header must be set
	$headers  = 'MIME-Version: 1.0' . "\r\n";
	$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";

	// Additional headers
	//$headers .= 'To: Mary <mary@example.com>, Kelly <kelly@example.com>' . "\r\n";
	$headers .= 'From: Tathra Primary School <graham.a.roberts@det.nsw.edu.au>' . "\r\n";
	//$headers .= 'Cc: birthdayarchive@example.com' . "\r\n";
	//$headers .= 'Bcc: birthdaycheck@example.com' . "\r\n";

	// Mail it
	mail($to, $subject, $message, $headers);
	echo "Sent message for moderation and forwarding	";
}
?>