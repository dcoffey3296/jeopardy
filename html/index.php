<?php

	$select = "";
	// get dir listing of boards
	if ($handle = opendir("boards")) {
    while (false !== ($file = readdir($handle)))
    {
        if ($file != "." && $file != ".." && strtolower(substr($file, strrpos($file, '.') + 1)) == 'json')
        {
            $select = "<option value='$file'>$file</option>";
        }
    }
    closedir($handle);

}


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
		            <label class="control-label" for="cf">Round 1 File</label>  
		            <div class="controls">  
		              <select name="cf">
		              	<?= $select ?>
		              </select> 
		            </div> 
		            <label class="control-label" for="f1">Double Jeopardy File</label>  
		            <div class="controls">  
		              <select name="f1">
		              	<?= $select ?>
		              </select> 
		            </div> 
		            <label class="control-label" for="f2">Final Jeopardy File</label>  
		            <div class="controls">  
		              <select name="f2">
		              	<?= $select ?>
		              </select> 
		            </div> 
		            <label class="control-label" for="t1">Team 1</label>  
		            <div class="controls">  
		              <input type="text" class="input-xlarge" id="t1" name="t1">  
		            </div>  
		            <label class="control-label" for="t2">Team 2</label>  
		            <div class="controls">  
		              <input type="text" class="input-xlarge" id="t2" name="t2">  
		            </div> 
		            	<input type="text"  name="r" value="0" style="visibility:hidden;"></input>
		          </div>  
		          <div class="form-actions">  
		            <button type="submit" class="btn btn-primary">GO!</button>  
		          </div>  
		        </fieldset>  
			</form>  
		</div>



	</body>
</html>