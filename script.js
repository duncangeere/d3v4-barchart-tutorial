/* globals d3:false, window:false */

// Set margins
var margin = {
	top: 40,
	right: 20,
	bottom: 30,
	left: 40
};

// Define height and width of chart
var width = 0.8 * window.innerWidth - margin.right;
var height = 0.8 * window.innerHeight - margin.top - margin.bottom;

var svg = d3.select("body").append("svg") // add an svg element to body
	.attr("width", width + margin.left + margin.right) // set its width
	.attr("height", height + margin.top + margin.bottom) // and height
	.append("g") // add a group
	// then move it to the top left corner inside the margins
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Make the axes
var x = d3.scaleLinear()
	.range([0, width]);

var y = d3.scaleBand()
	.range([height,0]);

var xAxis = d3.axisTop(x)
	.ticks(10, "%");

var yAxis = d3.axisLeft(y);

// Let's get the data
d3.tsv("data.tsv", function(error, data) {
	if (error) throw error;
	
	// Convert from string to number
	data.forEach(function(d) {
		d.frequency = +d.frequency;
		return d.frequency;
	});
	
	// Sort from most to least
	data.sort(function(a,b) {
		return a.frequency - b.frequency;		
	});
	
	// Now we can define the domains for the x and y scale
	
	// x goes from 0 to the highest frequency value
	x.domain([0, d3.max(data, function(d) {return d.frequency; })]);
	// y maps each letter to an index value with some spacing
	y.domain(data.map(function(d) {return d.letter; }))
		.paddingInner(0.1); // spacing between bars
	
	// Make the y axis appear on screen	
	svg.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(-3, 0)") // move it left a bit
		.call(yAxis);
	
	// Make the x axis appear on screen
	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0, -3)") // move it down a bit
		.call(xAxis);
	
	//Let's plot the bars!
	svg.selectAll(".bar") // Select the bars
		.data(data) // Bind the data
		// Add a rectangle for each datapoint that doesn't have one
		.enter().append("rect") 
		.attr("class", "bar")
		.attr("x", 0) // position
		.attr("height", y.bandwidth()) // width 
		.attr("y",function(d) {return y(d.letter);}) // position
		.attr("width", function(d) {return x(d.frequency);}); // width
	
});

