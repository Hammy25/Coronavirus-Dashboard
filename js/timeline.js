/*
Code for brush area
*/ 

class Timeline{

	// Constructor
	constructor(_parentElement, _width, _height){
		this.parentElement = _parentElement;
		this.svgWidth = _width;
		this.svgHeight = _height;

		this.intializeChart();
	}

	// Initializing chart
	intializeChart(){
		var vis = this;

		// Dimensions
    	vis.margin = {top: 0, right: 50, bottom: 30, left: 50};
    	vis.height = vis.svgHeight - vis.margin.top - vis.margin.bottom;
    	vis.width = vis.svgWidth - vis.margin.left - vis.margin.right;

    	// Creating svg canvas
    	vis.svg = d3.select(vis.parentElement).append("svg")
                         .attr("preserveAspectRatio", "xMinYMin meet")
                         .attr("viewBox", "0 0 " + vis.svgWidth + " " + vis.svgHeight)
                         .classed(".svg-content", true);

		vis.t = () => { return d3.transition().duration(1000); };

    	vis.g = vis.svg.append("g")
    			   .attr("fill-opacity", 0.7)
            	   .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    	vis.x = d3.scaleTime()
        		  .range([0, vis.width]);

	    vis.y = d3.scaleLinear()
	        .range([vis.height, 0]);

	    vis.xAxisDates = d3.axisBottom()
	        .ticks(3);

	    vis.xAxis = vis.g.append("g")
	        .attr("class", "x axis")
	        .attr("transform", "translate(0," + vis.height +")");

	    vis.areaPath = vis.g.append("path")
	        .attr("fill", "#ccc");

	    // Initialize brush component
	    vis.brush = d3.brushX()
	        .handleSize(10)
	        .extent([[0, 0], [vis.width, vis.height]])
	        .on("brush end", brushed)

	    // Append brush component
	    vis.brushComponent = vis.g.append("g")
	        .attr("class", "brush")
	        .call(vis.brush);

		vis.wrangleData();
	}

	// Wrangle Data
	wrangleData(){
		var vis = this;

		vis.variable = $("#var-select").val();
		vis.country = $("#country-select").val();


		vis.dayNest = d3.nest()
	        .key(d => d.date)
	        .entries(allCases[vis.country].data);

	    vis.dataFiltered = vis.dayNest
	        .map(function(day){
	        	// console.log(day);
	            return {
	                date: day.key,
	                sum: day.values.reduce(function(accumulator, current){
	                    return accumulator + current[vis.variable];
	                }, 0)               
	            }
	       	});

	    vis.dataFiltered = vis.dataFiltered.filter(item => item.sum > 0);

		vis.updateChart();
	}

	// Update chart
	updateChart(){
		var vis = this;

		var dateArray = vis.dataFiltered.map(d => new Date(d.date));
		vis.x.domain(d3.extent(vis.dataFiltered, d => new Date(d.date)));
    	vis.y.domain([0, d3.max(vis.dataFiltered, (d) => d.sum)]);

    	vis.xAxisDates.scale(vis.x);

    	vis.xAxis.transition(vis.t()).call(vis.xAxisDates);

    	vis.area0 = d3.area()
				      .x(d => vis.x(new Date(d.date)))
				      .y0(vis.height)
				      .y1(vis.height);

   	 	vis.area = d3.area()
        			 .x( d => vis.x(new Date(d.date)))
        			 .y0(vis.height)
        			 .y1( d => vis.y(d.sum));

    	vis.areaPath
           .data([vis.dataFiltered])
           .attr("d", vis.area);
	}
}