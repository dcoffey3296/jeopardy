<?php

$teams = 2;
$json = "filename";

if (!isset($_GET["t1"]) || !isset($_GET["t2"]) || !isset($_GET["f"]) || !file_exists("boards/" . $_GET["f"]))
{
	header("Location: index.php");
	exit;
}

if ($game = json_decode(file_get_contents("boards/" . $_GET["f"])) == false)
{
	header("Location: index.php");
	exit;
}


?>
<!DOCTYPE html>
<html>

	<head>
		<title>Jeopardy50</title>
		<script src="//codeorigin.jquery.com/jquery-latest.min.js"></script>
		<link href="//netdna.bootstrapcdn.com/bootstrap/3.0.2/css/bootstrap.min.css" rel="stylesheet">
		<script src="//netdna.bootstrapcdn.com/bootstrap/3.0.2/js/bootstrap.min.js"></script>
		<script src="js/jeopardy.js"></script>

		<link rel="stylesheet" type="text/css" href="css/jeopardy.css"/>

		<script type="text/javascript">
			<?php echo "window.data = " . file_get_contents("boards/" . $_GET["f"]) ?>
		</script>
	</head>
	<body>
		<div id="score">
			<div><?= $_GET["t1"] ?></div>
			<div><?= $_GET["t2"] ?></div>
		</div>
		

		<div id="board">

		</div>
	</body>

</html>