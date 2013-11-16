<?php

?>
<!DOCTYPE html>
<html>
	<head>
		<title>???</title>
		<link rel="stylesheet" type="text/css" href="css/jeopardy.css"/>
		<link href="//netdna.bootstrapcdn.com/bootstrap/3.0.2/css/bootstrap.min.css" rel="stylesheet">
		<script src="//netdna.bootstrapcdn.com/bootstrap/3.0.2/js/bootstrap.min.js"></script>
	</head>
	<body>

		<div class="wrapper">
			<form class="form-horizontal" action="jeopardy.php" method="get">  
		        <fieldset>  
		          <legend>Game Info</legend>  
		          <div class="control-group">  
		            <label class="control-label" for="f">Source File</label>  
		            <div class="controls">  
		              <input type="text" class="input-xlarge" id="f" name="f">  
		            </div> 
		            <label class="control-label" for="t1">Team 1</label>  
		            <div class="controls">  
		              <input type="text" class="input-xlarge" id="t1" name="t1">  
		            </div>  
		            <label class="control-label" for="t2">Team 2</label>  
		            <div class="controls">  
		              <input type="text" class="input-xlarge" id="t2" name="t2">  
		            </div> 
		          </div>  
		          <div class="form-actions">  
		            <button type="submit" class="btn btn-primary">GO!</button>  
		          </div>  
		        </fieldset>  
			</form>  
		</div>



	</body>
</html>