"use strict";
window.onload = function(){
connections();
};

function connections(){

	var groups = [
			{group: "1", sub:"a", svg: "#_x31_a", btn: ".g1a"},
			{group: "1", sub:"b", svg: "#_x31_b", btn: ".g1b"},

			{group: "2", sub:"a", svg: "#_x32_a", btn: ".g2a"},
			{group: "2", sub:"b", svg: "#_x32_b", btn: ".g2b"},
			{group: "2", sub:"c", svg: "#_x32_c", btn: ".g2c"},
			{group: "2", sub:"d", svg: "#_x32_d", btn: ".g2d"},
			{group: "2", sub:"e", svg: "#_x32_e", btn: ".g2e"},

			{group: "3", sub:"a", svg: "#_x33_a", btn: ".g3a"},
			{group: "3", sub:"b", svg: "#_x33_b", btn: ".g3b"},
			{group: "3", sub:"c", svg: "#_x33_c", btn: ".g3c"},
			{group: "3", sub:"d", svg: "#_x33_d", btn: ".g3d"},
			{group: "3", sub:"e", svg: "#_x33_e", btn: ".g3e"},

			{group: "4", sub:"a", svg: "#_x34_a", btn: ".g4a"},
			{group: "4", sub:"b", svg: "#_x34_b", btn: ".g4b"},
			{group: "4", sub:"c", svg: "#_x34_c", btn: ".g4c"},
			{group: "4", sub:"d", svg: "#_x34_d", btn: ".g4d"},
			{group: "4", sub:"e", svg: "#_x34_e", btn: ".g4e"},

			{group: "5", sub:"a", svg: "#_x35_a", btn: ".g5a"},
			{group: "5", sub:"b", svg: "#_x35_b", btn: ".g5b"},
			{group: "5", sub:"c", svg: "#_x35_c", btn: ".g5c"},
			{group: "5", sub:"d", svg: "#_x35_d", btn: ".g5d"},
			{group: "5", sub:"e", svg: "#_x35_e", btn: ".g5e"},
		],
		connect = {},
		circles = document.querySelectorAll("#nodes_2_ circle"), 
		lines = document.querySelectorAll("#edges_2_ path"),
		background = document.querySelector("#BACKGROUND rect"),
		
		btnClear = document.querySelector(".clear-all"),

		active,
		activeBtn
	;

	
	/*Set Group Buttons*/

	/*Create function scope variables for buttons and groups*/
	groups.forEach(function(mol){
		connect["group" + mol.group + mol.sub] = document.querySelector(mol.svg);
		connect["btn" + mol.group + mol.sub] = document.querySelector(mol.btn);
	});

	function groupOn(btn, group){
		btn.onclick = function(){
			group.style.display = "block";
			if(active){ 
				active.style.display = "none";
				activeBtn.className = activeBtn.className.replace(" buttonOn", "");
			}
			if (active != group){
				btn.className += " buttonOn"; 
				active = group;
				activeBtn = btn; 
			} 
			else { 
				active = activeBtn = null;
			}
			clearNodeConnects();
		};
	}

	/*Associate buttons with groups and set to function*/
	groups.forEach(function(mol){
		groupOn(connect["btn" + mol.group + mol.sub], connect["group" + mol.group + mol.sub]);
	});

	
	function pointCheck(circleVector, lineVector){
		/*search a 3x3 "radius" from circle center*/
		for(var i = -3; i <= 3; i++){
			if(parseInt(circleVector) == parseInt(lineVector) + i){
				return true;		
			}
		}
	}

	/*Personal Networks*/

	function findLines(circleVector){
		for(var i = 0; i < lines.length; i++){
			var M = lines[i].getAttribute("d"), xEnd, yEnd;
			/*for IE*/
			if ( M.match(/M\s\d/) ){
				var x = M.match(/\d{2,3}/)[0],
						y = M.match(/\d\s(\d{2,3})/)[1],
						xl = M.match(/l\s(-?\d{1,3})/),
						yl = M.match(/l\s-?\d+\.*\d+\s(-?\d{1,3})/),
						xL = M.match(/L\s(-?\d{1,3})/),
						yL = M.match(/L\s-?\d+\.*\d+\s(-?\d{1,3})/)
				;
			} else { /*All others*/
				var x = M.match(/\d{2,3}/)[0],
						y = M.match(/,(\d{2,3})/)[1],
						xl = M.match(/l(-?\d{1,3})/),
						yl = M.match(/l-?\d+\.*\d+,?(-?\d{1,3})/),
						xL = M.match(/L(-?\d{1,3})/),
						yL = M.match(/L-?\d+\.*\d+,?(-?\d{1,3})/)
				;
			}

			/*Interpret Illustrator's randomized notation*/
			if(xl === null){
				xEnd = xL[1];
				yEnd = yL[1];
			} else {
				xEnd = String(parseInt(x) + parseInt(xl[1]));
				yEnd = String(parseInt(y) + parseInt(yl[1]));
			}

			/*Check both endpoints of the current line*/
			if( (pointCheck(circleVector.x, x) && pointCheck(circleVector.y, y)) || (pointCheck(circleVector.x, xEnd) && pointCheck(circleVector.y, yEnd)) ){
				lines[i].setAttribute("name", "node-on");
			} else {
				lines[i].removeAttribute("name");
			}
		}
	}

	function check(ev){
		var cx = this.getAttribute("cx").match(/\d{2,3}/)[0],
				cy = this.getAttribute("cy").match(/\d{2,3}/)[0],
				circleLoc = {x: cx, y: cy}
		;
		findLines(circleLoc);
		clearButtons();
		ev.stopPropagation();
	}
	for(var i = 0; i < circles.length; i++){
		circles[i].addEventListener("click", check);
	}

	/*User Reset*/
	function clearButtons(){
		if(activeBtn && active){
			active.style.display = "none";
			activeBtn.className = activeBtn.className.replace(" buttonOn", "");
			active = activeBtn = null;
		}
	}
	function clearNodeConnects(){
		var activeLines = document.querySelectorAll("path[name='node-on']");
		for(var i = 0; i < activeLines.length; i++){
			activeLines[i].removeAttribute("name");
		}
	}

	btnClear.addEventListener("click", clearButtons);
	btnClear.addEventListener("click", clearNodeConnects);
	background.addEventListener("click", clearNodeConnects);
}