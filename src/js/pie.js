/*
	Code for Donut Chart
*/

import $ from "jquery";
import * as d3 from "d3";
import {allData} from "./drawing";

// Defining donut-chart class
export default class DonutChart{

	// Constructor
	constructor(_parentElement, _width, _height){
		this.parentElement = _parentElement;
		this.svgWidth = _width;
		this.svgHeight = _height;

		this.initializeChart();
	}

	// Initialize chart
	initializeChart(){
		const vis = this;

		// Define constants
		vis.margin = {top: 20, right: 0, bottom: 20, left: 40};
		vis.height = vis.svgHeight - vis.margin.top - vis.margin.bottom;
		vis.width = vis.svgWidth - vis.margin.left - vis.margin.right;
		vis.radius = Math.min(vis.width, vis.height)/2;

		 // Transitions
    	vis.t = () => { return d3.transition().ease(d3.easeLinear).duration(1000); }


		// Select area and append chart
		vis.svg = d3.select(vis.parentElement).append("svg")
						 .attr("preserveAspectRatio", "xMinYMin meet")
                         .attr("viewBox", "0 0 " + vis.svgWidth + " " + vis.svgHeight)
                         .classed(".svg-content", true);

		vis.donut = vis.svg.append("g")
						 .attr("height", vis.height)
						 .attr("width", vis.width)
						 .attr("id", "donut")
		    			 .attr("transform", "translate(" + (vis.width + vis.margin.left + vis.margin.right) / 2 + "," + (vis.height + vis.margin.top + vis.margin.bottom)/ 2 + ")");

		// Define arcs
		vis.arc = d3.arc()
					.outerRadius(vis.radius)
					.innerRadius(Math.min(vis.width, vis.height)/2 - Math.min(vis.width, vis.height)/4);

		// Pie layout initialization
		vis.pie = d3.pie()
		            .sort(null)
		            .value( d => d.count);

		//Color scale
		vis.pieScale = d3.scaleOrdinal(["blue", "red"]);
		vis.wrangleData();

		// Title
	    vis.svg.append("text")
	       .attr("class", "title")
	       .attr("x", (vis.width + vis.margin.left + vis.margin.right) / 2)
	       .attr("y", vis.margin.top/1.5)
	       .attr("text-anchor","middle")
	       .style("font-size", "1rem")
	       .style("text-decoration", "underline")
	       .text("Smokers Distribution");

	}

	// Wrangle Data
	wrangleData(values){
		const vis = this;

		vis.key = $("#var-select").val();
		vis.code = $("#country-select").val();

		vis.data = allData[vis.code];

		vis.genderArray = ["female", "male"];

		vis.pieData = [
		  {gender: "female", count: vis.data.female_smokers},
		  {gender: "male", count: vis.data.male_smokers},
		  ];
		
		vis.updateChart();
	}

	// Update chart
	updateChart(){
		const vis = this;

		const arcTween = (d) =>  {
		const i = d3.interpolate(this._current, d);
		this._current = i(0);
		return function(t) { return vis.arc(i(t)); };
		}

		// Domain of ordinal scale
		vis.pieScale.domain(vis.genderArray);

		vis.donut.selectAll(".arc").remove();

		vis.curves = vis.donut.selectAll(".arc").data(vis.pie(vis.pieData));

		vis.curves.transition()
	       .duration(750)
	       .attrTween("d", arcTween);

		vis.pieChart =vis.curves.enter().append("g").attr("class", "arc");


		vis.pieChart.append("path")
		        .attr("fill", d => vis.pieScale(d.data.count))
		        .attr("fill-opacity", 0.2)
	        	.transition(vis.t())
	        	.attr("fill-opacity", 0.7)
	        	.attrTween("d", arcTween);

	    // Pie chart legend
	    vis.pieLegend = d3.select("#donut").selectAll(".pieLegends")
	            .data(vis.genderArray)
	            .enter().append("g")
	            .attr("class", "pieLegends")
	            .attr("transform", (d, i) => "translate(75," + i * 20 + ")");
	        
	    vis.pieLegend.append("rect")
	           .attr("x", 0)
	           .attr("y", 0)
	           .attr("width", 10)
	           .attr("height", 10)
	           .attr("stroke", "black")
	           .style("fill", d => vis.pieScale(d));
	        
	    vis.pieLegend.append("text")
	           .attr("x", 20)
	           .attr("y", 10)
	           .attr("class", "text-muted")
	           .text((d, i) => d )
	           .style("text-anchor", "start")
	           .style("font-size", "0.5rem");
	}
}



