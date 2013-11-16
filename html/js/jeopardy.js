window.board = [];
window.board.current_row = -1;
window.board.current_column = -1;
window.board.current_team = -1;
window.board.current_question = null;
window.categories = [];
window.score = {};
window.score.t1 = 0;
window.score.t2 = 0;

$(document).ready(function(){
	load_board();

	// set up event listeners
	$("#board td").bind("click", event, function(){
		show_question(event);
	});

	$("#cancel").bind("click", event, function(){
		// if the answer was showing, no one got it right, remove the question
		if (window.board.answer_showing == true)
		{
			remove_and_update();
		}
		
		// close the window
		close_fullscreen();
	});

	$("#question").bind("click", function(){
		reveal_answer();
	});

	$("#award_t1").bind("click", function(){

		// don't accept more than one answer per question
		if (window.board.t1answered == true)
		{
			return;
		}

		show_correct();
		window.board.current_team = "t1";
	});

	$("#award_t2").bind("click", function(){
		// don't accept more than one answer per question
		if (window.board.t2answered == true)
		{
			return;
		}

		show_correct();
		window.board.current_team = "t2";
	});

	$("#right").bind("click", function(){
		window.board.correct = true;
		award_team();
	});

	$("#wrong").bind("click", function(){
		window.board.correct = false;
		award_team();
		$("#correct_holder").css("display", "none");
	});
});

function award_team()
{

	// determine point value
	var points = parseInt(window.board.current_question["value"]);

	// if incorrect, subtract the points
	if (window.board.correct != true)
	{
		points = points * -1;
	}

	// if daily double, * 2
	if (window.board.current_question.dj == true)
	{
		award_points((points * 2), window.board.current_team);
	}
	else
	{
		award_points(points, window.board.current_team);
	}
}

function award_points(points, team){
	if (team == "t1"){
		window.score.t1 += points;
		window.board.t1answered = true;
	}
	else if (team == "t2"){
		window.score.t2 += points;
		window.board.t2answered = true;
	}
	else
	{
		console.log("error awarding points");
		return false;
	}

	// update the scores
	update_scores();
	window.board.current_team = -1;

	// only remove and update if both teams have had a chance to answer or correct answer
	if (window.board.correct == true || (window.board.t1answered == true && window.board.t2answered == true))
	{
		// show the answer for 2 seconds if it's not up yet
		if (window.board.answer_showing == false)
		{
			reveal_answer();
			
		}
		else
		{
			reveal_answer();
		}
		
		remove_and_update();
	}
}

function remove_and_update()
{
	// remove the question
	window.board[window.board.current_row][window.board.current_column] = "answered";

	// clear number from the screen
	$("#r-" + window.board.current_row).children("#c-" + window.board.current_column).html("");

	// close thei window
	close_fullscreen();
}

function close_fullscreen(){

	window.board.answer_showing = false;
	$("#fullscreen").fadeOut(function(){
		$("#question").html("");
		clear_rowcol();

		// hide the correctness buttons
		$("#correct_holder").css("display", "none");
	});
}

function clear_rowcol(){
	window.board.current_column = -1;
	window.board.current_row = -1;
}

function show_question(click){
	var element = click.target;
	window.board.current_column = $(element).attr('id').replace(/^\D+/g, '');
	window.board.current_row = $(element).parent().attr('id').replace(/^\D+/g, '');

	// don't react to already answered questions
	if (window.board[window.board.current_row][window.board.current_column] == "answered")
	{
		return;
	}

	// no one has tried to answer yet
	window.board.t1answered = false;
	window.board.t2answered = false;

	// remember this question for easy access
	window.board.current_question = window.board[window.board.current_row][window.board.current_column];

	var dd = "";
	// check if daily double
	if (window.board.current_question.question.dj == true)
	{
		dd = "Daily Double: ";
	}



	$("#question").html(dd + window.board[window.board.current_row][window.board.current_column].question.q).fitText(1.0, { minFontSize: '100px'});
	$("#fullscreen").fadeIn();
	console.log(window.board[window.board.current_row][window.board.current_column].question.q + " for " + window.board[window.board.current_row][window.board.current_column].value);
}

function reveal_answer(){
	window.board.answer_showing = true;
	$("#question").html("Answer: " + window.board[window.board.current_row][window.board.current_column].question.a);
}


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

	window.board.height = height;
	window.board.width = width;
	// console.log("width = " + width);
	// console.log("height = " + height);
	// console.log(window.board);
	draw_board();
}

function draw_board()
{
	var table = "<table id='board'>";
	for (var i = 0; i <= window.board.height; i++)
	{
		if (i == 0)
		{
			table += "<tr id='first'>";
		}
		else
		{
			table += "<tr id='r-" + (i - 1) + "'>";
		}
		
		for (var j = 0; j <= window.board.width - 1; j++)
		{
			if (i == 0)
			{
				table += "<th style='height: " + (100 / (window.board.height + 1)) + "%; width: " + (100 / window.board.width) + "%' class='square'>" + window.categories[j] + "</th>";
			}
			else
			{
				table += "<td id='c-" + j + "' style='height: " + (100 / (window.board.height + 1)) + "%; width: " + (100 / window.board.width) + "%' class='square'>" + window.board[i - 1][j].value + "</td>";
			}
		}
		table += "</tr>";
	}
	table += "</table>"

	$("#board_holder").append(table);
	jQuery("#board th").fitText(0.85);
	jQuery("#board td").fitText(0.45);
	jQuery("#award td").fitText(1.0, { minFontSize: '50px'});
	jQuery("#t1_holder").fitText(1.0, { minFontSize: '30px'});
	jQuery("#t2_holder").fitText(1.0, { minFontSize: '30px'});

}



function show_correct()
{
	$("#correct_holder").css("display", "table");
}

function update_scores(){
	$("#t1_score").html(window.score.t1);
	$("#t2_score").html(window.score.t2);
}










