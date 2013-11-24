<?php

$teams = 2;
$json = "filename";

if (!isset($_GET["t1"]) || !isset($_GET["t2"]) || !isset($_GET["cf"]) || !file_exists("boards/" . $_GET["cf"]) || !isset($_GET["f1"]) || !file_exists("boards/" . $_GET["f1"]) || !isset($_GET["f2"]) || !file_exists("boards/" . $_GET["f2"]))
{
	header("Location: index.php?1");
	exit;
}

if ($game = json_decode(file_get_contents("boards/" . $_GET["cf"])) == false)
{
	header("Location: index.php?2");
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
		<!-- jQuery & jQueryUI + theme -->
		<link href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/ui-lightness/jquery-ui.css" rel="stylesheet">
		<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js"></script>

		<!-- keyboard widget css & script -->
		<link href="css/keyboard.css" rel="stylesheet">
		<script src="js/jquery.keyboard.js"></script>

		<!-- keyboard optional extensions -->
		<script src="js/jquery.mousewheel.js"></script>
		<script src="js/jquery.keyboard.extension-autocomplete.js"></script>
		<script src="js/jquery.keyboard.extension-typing.js"></script>
		<script src="js/jquery.keyboard.extension-mobile.js"></script>
		<script src="js/jquery.keyboard.extension-navigation.js"></script>
		<script src="js/jquery.keyboard.extension-scramble.js"></script>

		<script src="lib/FitText.js/jquery.fittext.js"></script>
		<script src="js/jeopardy.js"></script>

		<link rel="stylesheet" type="text/css" href="css/jeopardy.css"/>

		<script type="text/javascript">
			<?= "window.data = " . file_get_contents("boards/" . $_GET["cf"]) ?>
		</script>
	</head>
	<body>
		<div id="score_holder">
			<div id="t1_holder" class="scorecard">
				<p id="t1" class="team"><?= $_GET["t1"] ?></p>
				<div id="t1_score" class="score"></div>
				<div id="t1_adjust_holder" class="adjuster">
					<table id="t1_adjust" class="adjuster">
						<tr>
							<td class="minus_100">-100</td><td class="plus_100">+100</td>
						</tr>
					</table>
				</div>
			</div>
			<div id="t2_holder" class="scorecard">
				<p id="t2" class="team"><?= $_GET["t2"] ?></p>
				<div id="t2_score" class="score"></div>
				<div id="t2_adjust_holder" class="adjuster">
					<table id="t2_adjust" class="adjuster">
						<tr>
							<td class="minus_100">-100</td><td class="plus_100">+100</td>
						</tr>
					</table>
				</div>
			</div>
			<div id="t3_holder" class="scorecard">
				<p id="t3" class="team"><?= $_GET["t3"] ?></p>
				<div id="t3_score" class="score"></div>
				<div id="t3_adjust_holder" class="adjuster">
					<table id="t3_adjust" class="adjuster">
						<tr>
							<td class="minus_100">-100</td><td class="plus_100">+100</td>
						</tr>
					</table>
				</div>
			</div>
		</div>
		

		<div id="board_holder">
			<div id="fullscreen" style="display:none" class="square">
				<div id="question"></div>
				<div id="award_holder">
					<table id="award">
						<tr>
							<td id="cancel">close</td>
						</tr>
					</table>
				</div>
			</div>
		</div>
		<div style="visibility:hidden;" id="sounds">
			<audio src="assets/daily_double.mp3" id="sound_daily_double"></audio>
			<audio src="assets/time_up.mp3" id="sound_time_up"></audio>
			<audio src="assets/jeopardy_open.mp3" id="sound_jeopardy_open"></audio>
			<audio src="assets/final_jeopardy.mp3" id="sound_final_jeopardy"></audio>
			<audio src="assets/buzz.mp3" id="sound_buzz"></audio>
			<audio src="assets/ding.mp3" id="sound_ding"></audio>
			<audio src="assets/populate.mp3" id="sound_populate"></audio>
		</div>
		<div id="dialog" title="Manual Adjust" style="display:none">
		  <input id="keyboard" type="number" placeholder="0"></input>
		</div>
		<div id="hidden-resizer" style=""></div>
	</body>

</html>