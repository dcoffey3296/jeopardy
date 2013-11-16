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
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
		<link href="//netdna.bootstrapcdn.com/bootstrap/3.0.2/css/bootstrap.min.css" rel="stylesheet">
		<script src="//netdna.bootstrapcdn.com/bootstrap/3.0.2/js/bootstrap.min.js"></script>
		<script src="lib/FitText.js/jquery.fittext.js"></script>
		<script src="js/jeopardy.js"></script>

		<link rel="stylesheet" type="text/css" href="css/jeopardy.css"/>

		<script type="text/javascript">
			<?php echo "window.data = " . file_get_contents("boards/" . $_GET["f"]) ?>
		</script>
	</head>
	<body>
		<div id="score_holder">
			<div id="t1_holder" class="scorecard"><?= $_GET["t1"] ?><div id="t1_score">0</div></div>
			<div id="t2_holder" class="scorecard"><?= $_GET["t2"] ?><div id="t2_score">0</div></div>
		</div>
		

		<div id="board_holder">
			<div id="fullscreen" style="display:none" class="square">
				<div id="question"></div>
				<div id="award_holder">
					<table id="award">
						<tr>
							<td><?= $_GET["t1"] ?></td><td id="cancel">cancel</td><td><?= $_GET["t2"] ?></td>
						</tr>
					</table>
				</div>
			</div>
		</div>
	</body>

</html>