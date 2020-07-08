/*
	Bar Chart Class
*/
class BarChart{

	constructor(_parentElement){
		this.parentElement = _parentElement;
		this.initializeChart();
	}

	initializeChart(){
		var vis = this;

		// Defining dimensions
		vis.margin = {top: 50, right: 50, bottom: 50, left: 50};
		vis.width = 600;
		vis.height = 200;

		// Transitions
    	vis.t = () => { return d3.transition().duration(1000); }

		// Defining svg
		vis.svg = d3.select(vis.parentElement)
					.append("svg")
					.attr("preserveAspectRatio", "xMinYMin meet")
					.attr("viewBox", "0 0 700 300")
					.classed(".svg-content", true);

		// Defining graph area
		vis.g = vis.svg.append("g")
		           .attr("class", "bar-chart")
                   .attr("width", vis.width)
                   .attr("height", vis.height)
                   .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


		// Defining scales
		vis.xScale = d3.scaleTime().range([0, vis.width]);
		vis.yScale = d3.scaleLinear().range([vis.height, 0]);

		// Defining axes
		vis.xAxis = vis.g.append("g")
		               .attr("transform", "translate(0, " + vis.height + ")");
		vis.yAxis = vis.g.append("g");

		vis.wrangleData();
	}

	wrangleData(){
		var vis = this;

		vis.key = $("#var-select").val();
		vis.code = $("#country-select").val();

		vis.data = formatData(allCases[vis.code].data)

		vis.titleText = determineTitle(vis.key);
		// Get data to  work on 
		vis.y_data = vis.data.map( item => item[vis.key]);
		vis.x_data = vis.data.map( item => item.date);

		vis.updateChart();
	}

	updateChart(){
		var vis = this;

		// Setting domain of scales
		vis.xScale.domain(d3.extent(vis.x_data));
		vis.yScale.domain([0, d3.max(vis.y_data) + 10]);

		// Setting up axes
		vis.xAxis.call(d3.axisBottom(vis.xScale).ticks(10).tickFormat(d3.timeFormat("%d %b")));
		vis.yAxis.call(d3.axisLeft(vis.yScale));
		// Setting fonts of axes' labels
		vis.g.selectAll("text").style("font-family", "'Coming Soon', cursive").style("font-size", "0.35rem");

		// Heading code
		vis.svg.select(".barTitle").remove();

		vis.heading = vis.svg.append("g")
						 .attr("transform", "translate(" + vis.width/2 + ", " + vis.margin.top/2 + ")")
						 .append("text")
						 .attr("class", "barTitle")
						 .attr("text-anchor","center")
	       				 .attr("font-size", 14)
	       				 .style("text-decoration", "underline")
	       				 .text(vis.titleText)

	    // y-axis label code
	    vis.svg.select("#y-label").remove();

	    vis.yaxisLabel = vis.svg.append("text")
                         	.attr("id", "y-label")
                         	.attr("transform", "rotate(-90)")
                         	.attr("x", 0 -((vis.height+vis.margin.top+vis.margin.bottom)/2))
                         	.attr("y", (vis.margin.left/4))
                         	.attr("font-size", "0.35rem")
                         	.attr("text-anchor", "middle")
                         	.text(vis.titleText);

		// Drawing bars
		vis.bars = vis.g.selectAll(".bar").data(vis.data);

		vis.bars.exit().remove();

		vis.bars.attr("class", "bar")
		   .attr("fill-opacity", 0.8)
		   .attr("ry", 0.5)
		   .attr("x", d =>  vis.xScale(d.date))
		   .attr("y", d => vis.yScale(d[vis.key]))
		   .attr("height", d => vis.height - vis.yScale(d[vis.key]))
		   .attr("width", (vis.width/vis.data.length));

		vis.bars.enter().append("rect")
		   .attr("class", "bar")
		   .attr("fill", "#4285F4")
		   .attr("fill-opacity", 0.8)
		   .attr("ry", 0.5)
		   .attr("x", d =>  vis.xScale(d.date))
		   .attr("y", d => vis.yScale(d[vis.key]))
		   .attr("width", (vis.width/vis.data.length))
		   .attr("height", d => vis.height - vis.yScale(d[vis.key]))
		   .on("mouseover", d => {
		   		// Mouseover effects
		   	    var bar = d3.select(event.currentTarget);
		   		bar.attr("fill-opacity", 1);
		   		bar.attr("stroke", "black");
		   		bar.attr("stroke-width", 0.5);
      			toolTip.style("visibility", "visible");
	      		toolTip.html( () => {
	            return (
	              "Date :" + d.date +
	              "<br>" +
	              vis.titleText + " :" + d[vis.key] +
	              "<br>");
	        	});
	        	toolTip.style("left", d3.event.pageX - 150+ "px");
        		toolTip.style("top", d3.event.pageY + "px");
	      	})
        	.on("mouseout", function (d) {
        		// Mouseout effects
        		var bar = d3.select(event.currentTarget);
      			toolTip.style("visibility", "hidden");
      			bar.attr("fill-opacity", 0.8);
		   		bar.attr("stroke", "none");
    		});
    }

}