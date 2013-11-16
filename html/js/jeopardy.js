window.board = [];
window.categories = [];

$(document).ready(function(){
	load_board();

	// set up event listeners
	$("#board td").bind("click", event, function(){
		show_question(event);
	});

	$("#cancel").bind("click", event, function(){
		close_fullscreen();
	});
});

function close_fullscreen(){
	$("#fullscreen").fadeOut(function(){
		$("#question").html("");
	});
}

function show_question(click){
	var element = click.target;
	column = $(element).attr('id').replace(/^\D+/g, '');
	row = $(element).parent().attr('id').replace(/^\D+/g, '');

	$("#question").html(window.board[row][column].question.q).fitText(1.0, { minFontSize: '100px'});
	$("#fullscreen").fadeIn();
	console.log(window.board[row][column].question.q + " for " + window.board[row][column].value);
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
	jQuery("th").fitText(0.85);
	jQuery("td").fitText(0.45);
	jQuery("#award td").fitText(1.0, { minFontSize: '50px'});
	jQuery("#t1_holder").fitText(1.0, { minFontSize: '30px'});
	jQuery("#t2_holder").fitText(1.0, { minFontSize: '30px'});

}










