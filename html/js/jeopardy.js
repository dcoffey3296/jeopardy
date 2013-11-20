// global vars
window.board = [];
window.jeopardy = {};
window.jeopardy.answer_showing = false;
window.jeopardy.current_row = -1;
window.board.current_column = -1;
window.jeopardy.current_team = -1;
window.jeopardy.current_question = null;
window.categories = [];
window.score = {};
window.score.t1 = 0;
window.score.t2 = 0;
window.round = 0;
window.jeopardy.doublefile = "";
window.jeopardy.disable_clicks = false;

// initialize
$(document).ready(function(){
	
	// set scores if passed via get
	if (query_string("t1_score") != null && parseInt(query_string("t1_score")) > 0)
	{
		window.score.t1 = parseInt(query_string("t1_score"));
	}

	if (query_string("t2_score") != null && parseInt(query_string("t2_score")) > 0)
	{
		window.score.t2 = parseInt(query_string("t2_score"));
	}

	// load and draw the board
	load_board();

	play_sound("populate");

	// check if this is for final jeopardy
	if (query_string("r") != null && parseInt(query_string("r")) > 0)
	{
		window.round = parseInt(query_string("r"));
	}

	// store double jeopardy round if we were given a board
	if (query_string("f2") != null && parseInt(query_string("f2")) !="")
	{
		window.jeopardy.doublefile = query_string("f2");
	}

	// check if this is for final jeopardy
	if (window.round == 3)
	{
		play_sound("final_jeopardy");
		alert("final_jeopardy");
	}




	// set up event listeners
	$("#board td").bind("click", event, function(){
		show_question(event);
	});

	$("#cancel").bind("click", event, function(){
		style_clicked(event.target);

		// if the answer was showing, no one got it right, remove the question
		if (window.jeopardy.answer_showing == true)
		{
			remove_and_update();
		}
		
		// close the window
		close_fullscreen();
	});

	$("#question").bind("click", function(){

		// ignore input if supposed to
		if (window.jeopardy.disable_clicks == true)
		{
			return;
		}

		reveal_answer();
	});

	$("#award_t1").bind("click", function(){

		// ignore input if supposed to
		if (window.jeopardy.disable_clicks == true)
		{
			return;
		}

		// don't accept more than one answer per question
		if (window.jeopardy.t1answered == true)
		{
			return;
		}

		style_clicked(event.target);

		show_correct();
		window.jeopardy.current_team = "t1";
	});

	$("#award_t2").bind("click", function(){

		// ignore input if supposed to
		if (window.jeopardy.disable_clicks == true)
		{
			return;
		}

		// don't accept more than one answer per question
		if (window.jeopardy.t2answered == true)
		{
			return;
		}

		style_clicked(event.target);

		show_correct();
		window.jeopardy.current_team = "t2";
	});

	$("board th").bind("click", function(){

		play_sound("jeopardy_open");

		// once played, disable
		$("board th").off("click");
	});

	$("#right").bind("click", function(){
		// ignore input if supposed to
		if (window.jeopardy.disable_clicks == true)
		{
			return;
		}

		play_sound("ding");
		window.jeopardy.correct = true;
		style_clicked(event.target);
		award_team();
		$("#correct_holder").css("display", "none");
		reset_all_clicked();
	});

	$("#wrong").bind("click", function(){
		console.log("click-wrong() = " + window.jeopardy.answer_showing);

		// ignore input if supposed to
		if (window.jeopardy.disable_clicks == true)
		{
			return;
		}

		play_sound("buzz");
		window.jeopardy.correct = false;
		style_clicked(event.target);
		award_team();
		$("#correct_holder").css("display", "none");
		reset_all_clicked();
	});


});

// function to calculate the point value and call award_points() based on which is the global, current_team
function award_team(){

	// determine point value
	var points = 0;
	if (window.jeopardy.current_question.question.dj == true)
	{
		// use the last user input if it's double jeopardy
		points = window.jeopardy.keyboard;

		// special case: mark both teams as answered so second team can't steal
		window.jeopardy.t1answered = true;
		window.jeopardy.t2answered = true;
	}
	else
	{
		points = parseInt(window.jeopardy.current_question["value"]);
	}
	

	// if incorrect, subtract the points
	if (window.jeopardy.correct != true)
	{
		points = points * -1;
	}

	// if daily double, * 2
	if (window.jeopardy.current_question.dj == true)
	{
		award_points((points * 2), window.jeopardy.current_team);
	}
	else
	{
		award_points(points, window.jeopardy.current_team);
	}
}

// adds poings to team score globals and calls update_scores() to re-draw the scores
function award_points(points, team){
	console.log("award_points() = " + window.jeopardy.answer_showing);
	if (team == "t1"){
		window.score.t1 += points;
		window.jeopardy.t1answered = true;
	}
	else if (team == "t2"){
		window.score.t2 += points;
		window.jeopardy.t2answered = true;
	}
	else
	{
		console.log("error awarding points");
		return false;
	}

	// update the scores
	update_scores();
	window.jeopardy.current_team = -1;

	// only remove and update if both teams have had a chance to answer or correct answer
	if (window.jeopardy.correct == true || (window.jeopardy.t1answered == true && window.jeopardy.t2answered == true))
	{
		// show the answer for 2 seconds if it's not up yet
		if (window.jeopardy.answer_showing == false)
		{
			console.log("answer = " + window.jeopardy.answer_showing);
			reveal_answer(function(){
					setTimeout(function(){
					remove_and_update();
					console.log("top");
					return;
				}, 1500);
			});
			// show the answer and wait 1.5 secs before closing
			
		}
		else
		{
			console.log("bottom");
			console.log("answer = " + window.jeopardy.answer_showing);
			reveal_answer();
			
			remove_and_update();
			return;
		}
		
		
	}
}

// returns true if all of the questions have been answered
function check_complete(){
	for (var i = 0; i < window.board.length; i++)
	{
		for (var j = 0; j < window.board[i].length; j++)
		{
			if (window.board[i][j] != "answered")
			{
				return false;
			}
		}
	}
	return true;
}

// closes the full-screen question and hides the correctness buttons.  Also calls clear_rowcol()
function close_fullscreen(){

		$("#fullscreen").fadeOut(function(){
			$("#question").html("");
			clear_rowcol();

			// hide the correctness buttons
			$("#correct_holder").css("display", "none");
			reset_all_clicked();
		});
		window.jeopardy.answer_showing = false;
}

// clears the globals for the current row and current column
function clear_rowcol(){
	window.jeopardy.current_column = -1;
	window.jeopardy.current_row = -1;
}

function goto_next_round(){
	var redirect = "jeopardy.php?t1=" + $("#t1_score").val() + "&t2=" + $("#t1_score").val() + "&t1=" + $("#t1_holder").val() + "&t2=" + $("#t2_holder").val() + "&r=" + (parseInt(window.round) + 1);

	if (parseInt(window.round) == 1)
	{
		redirect += "&f=" + window.jeopardy.doublefile;
	}

	// don't continue after final jeopardy
	if (window.round == 2)
	{
		return;
	}

	window.location.replace(redirect);
}

// loads the global version of the 2D board array from the php inserted .json data
function load_board(){
	var current_row = 0;
	var current_column = 0;
	var width = 0;
	var height = 0;

	window.board = [];

	// iterate over the categories
	for (var category in window.data)
	{
		height = 0;
		current_row = 0;
		for (var value in window.data[category])
		{
			window.categories[width] = category;

			// assign the questions
			if (window.board[current_row] == undefined)
			{
				window.board[current_row] = [];
			}

			window.board[current_row][current_column] = {"value": value, question : window.data[category][value]};
			current_row++;
			height++;
		}
		current_column++;
		width++;
	}

	window.jeopardy.height = height;
	window.jeopardy.width = width;
	draw_board();
}

// draws the table of the board from the global 2D array of the board data
function draw_board(){
	var table = "<table id='board'>";
	for (var i = 0; i <= window.jeopardy.height; i++)
	{
		if (i == 0)
		{
			table += "<tr id='first'>";
		}
		else
		{
			table += "<tr id='r-" + (i - 1) + "'>";
		}
		
		for (var j = 0; j <= window.jeopardy.width - 1; j++)
		{
			if (i == 0)
			{
				table += "<th style='height: " + (100 / (window.jeopardy.height + 1)) + "%; width: " + (100 / window.jeopardy.width) + "%' class='square'>" + window.categories[j] + "</th>";
			}
			else
			{
				table += "<td id='c-" + j + "' style='height: " + (100 / (window.jeopardy.height + 1)) + "%; width: " + (100 / window.jeopardy.width) + "%' class='square'>" + window.board[i - 1][j].value + "</td>";
			}
		}
		table += "</tr>";
	}
	table += "</table>";

	// update the scores
	update_scores();

	// size the text according to the screen
	$("#board_holder").append(table);
	jQuery("#board th").fitText(0.85);
	jQuery("#board td").fitText(0.45);
	jQuery("#award td").fitText(1.0, { minFontSize: '50px'});
	jQuery("#t1_holder").fitText(1.0, { minFontSize: '30px'});
	jQuery("#t2_holder").fitText(1.0, { minFontSize: '30px'});
}

// function to play sounds
function play_sound(sound)
{
	document.getElementById('sound_' + sound).play();
}

// function to get a specified query parameter from the get string: http://stackoverflow.com/questions/7731778/jquery-get-query-string-parameters
function query_string(key) {
    key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&"); // escape RegEx meta chars
    var match = location.search.match(new RegExp("[?&]"+key+"=([^&]+)(&|$)"));
    return match && decodeURIComponent(match[1].replace(/\+/g, " "));
}

// removes a question from the 2D board array and the value from the board on screen
function remove_and_update(){
	// remove the question
	window.board[window.jeopardy.current_row][window.jeopardy.current_column] = "answered";

	// clear number from the screen
	$("#r-" + window.jeopardy.current_row).children("#c-" + window.jeopardy.current_column).html("");

	// close thei window
	close_fullscreen();

	// check if the round is over
	if (check_complete())
	{
		goto_next_round();
	}
}

// reset all button CSS
function reset_all_clicked(){
	var buttons = ["#right", "#wrong", "#award_t1", "#award_t2", "#cancel"];
	console.log("in reset");
	for (var b in buttons)
	{
		console.log("resetting " + buttons[b]);
		style_clicked_reset(buttons[b]);
	}
}

// replaces the question text with the answer text
function reveal_answer(after){
	console.log('reveal answer() = ' + window.jeopardy.answer_showing);
	window.jeopardy.answer_showing = true;
	$("#question").html("Answer: " + window.board[window.jeopardy.current_row][window.jeopardy.current_column].question.a);
	if(typeof after != 'undefined')
	{
		after();
	}
}

// un-hides the buttons to mark a team's answer correct or incorrect
function show_correct(){
	$("#correct_holder").css("display", "table");
}

// pop up the virtual keyboard
function show_keyboard(after){
	// initialize the number pad, setup callbacks
	$('#keyboard').keyboard({layout: 'num', accepted:function(callback){
		if (isNaN(parseInt($("#keyboard").val())) || parseInt($("#keyboard").val()) < 1)
		{
			console.log("not a number");
			$("#keyboard").getkeyboard().destroy();
			$("#keyboard").val("");
			$("#dialog").dialog("close");
			show_keyboard(after);
			
		}
		else
		{
			window.jeopardy.keyboard = parseInt($("#keyboard").val());
			$("#dialog").dialog("close");
			after();
		}
	}});

	$("#dialog").dialog();
}

// gets the clicked coordinates, checks the global array if the quesiton has been answered, if not tracks who has answered and whether or not a square is a daily double.  Lastly, it inserts the question fullscreen
function show_question(click){
	var element = click.target;
	window.jeopardy.current_column = $(element).attr('id').replace(/^\D+/g, '');
	window.jeopardy.current_row = $(element).parent().attr('id').replace(/^\D+/g, '');

	// don't react to already answered questions
	if (window.board[window.jeopardy.current_row][window.jeopardy.current_column] == "answered")
	{
		return;
	}

	// no one has tried to answer yet
	window.jeopardy.t1answered = false;
	window.jeopardy.t2answered = false;

	// remember this question for easy access
	window.jeopardy.current_question = window.board[window.jeopardy.current_row][window.jeopardy.current_column];

	var dd = "";
	// check if daily double
	if (window.jeopardy.current_question.question.dj == true)
	{
		play_sound("daily_double");
		dd = "Daily Double: ";

		// disable clicks elsewhere until input is reached
		window.jeopardy.disable_clicks = true;
		$("#question").html("DAILY DOUBLE").fitText(1.0, { minFontSize: '100px'});
		$("#fullscreen").show();

		// show the keyboard then do the following:
		show_keyboard(function(){
			$("#question").html(dd + window.board[window.jeopardy.current_row][window.jeopardy.current_column].question.q).fitText(1.0, { minFontSize: '100px'});
			window.jeopardy.disable_clicks = false;
		});

		return;
	}

	// normal question, show the question
	$("#question").html(dd + window.board[window.jeopardy.current_row][window.jeopardy.current_column].question.q).fitText(1.0, { minFontSize: '100px'});
	$("#fullscreen").fadeIn();
}

// gray out clicked things
function style_clicked(selector){
	$(selector).css("background-color", "gray");
}

function style_clicked_reset(selector){
	$(selector).css('background-color', "");
}

// re-draws the scores on the screen according to the global values
function update_scores(){
	$("#t1_score").html(window.score.t1);
	$("#t2_score").html(window.score.t2);
}	










