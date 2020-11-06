/*
	TimeSeries (Total deaths against total cases) Class.
*/

import $ from "jquery";
import * as d3 from "d3";
import toolTip from "./tooltip";
import {wrkData} from "./drawing";
import {numbersWithCommas} from "./formating";

export default class TimeSeries{

	constructor(_parentElement, _width, _height){
		this.parentElement = _parentElement;
		this.svgWidth = _width;
		this.svgHeight = _height;

		this.initializeChart();
	}

	initializeChart(){
		const vis = this;

		vis.margin = {top: 0, right: 50, bottom: 50, left: 30};
		vis.width = vis.svgWidth - vis.margin.right - vis.margin.left;
		vis.height = vis.svgHeight - vis.margin.top - vis.margin.bottom;

		vis.svg = d3.select("#time-series")
					.append("svg")
					.attr("preserveAspectRatio", "xMinYMin meet")
					.attr("viewBox", "0 0 "+ vis.svgWidth + " " + vis.svgHeight)
					.classed(".svg-content", true);

		// Transitions
    	vis.t = () => { return d3.transition().duration(1000); }

		// Appending graph header
		vis.heading = vis.svg.append("g")
						 .attr("transform", "translate(" + vis.svgWidth/3 + ", " + (vis.margin.bottom/2) + ")")
						 .append("text")
						 .attr("class", "barTitle")
						 .attr("text-anchor","center")
	       				 .text("Total Deaths Against Total Cases")

		// Defining graph area
		vis.g =  vis.svg.append("g")
					.attr("class", "time-series-chart")
					.attr("width",  vis.width).attr("height",  vis.height)
					.attr("transform", "translate(" +  vis.margin.left + "," +  vis.margin.top + ")");

		// Appending X axis label
		vis.xAxisText = vis.g.append("text")
						   .attr("class", "x axis-label")
						   .attr("x", (vis.svgWidth - vis.margin.left - vis.margin.right) / 2)
						   .attr("y", vis.svgHeight - (vis.margin.bottom/4))
						   .attr("text-anchor", "middle")
						   .style("font-size", "0.5rem")
						   .text("Total Cases");

		// Apppending Y axis label
		vis.yAxisText = vis.g.append("text")
						   .attr("transform", "rotate(-90)")
				           .attr("y", 0 - vis.margin.left / 2)
				           .attr("x",0 - ((vis.svgHeight-vis.margin.top-vis.margin.bottom) / 2))
				           .attr("dy", "1em")
				           .style("text-anchor", "middle")
				           .style("font-size", "0.5rem")
				           .text("Total Deaths");

		// Defining scales
		vis.xScale = d3.scaleLinear().range([vis.margin.left,  vis.width]);
		vis.yScale = d3.scaleLinear().range([vis.height, vis.margin.bottom]);
		vis.radiusScale = d3.scaleLinear().range([2, 20]);
		vis.continentColor = d3.scaleOrdinal().range(d3.schemeCategory10);

		// Defining axes
		vis.xAxisGroup = vis.g.append("g").attr("class", "x axis").attr("transform", "translate(0, " + (vis.svgHeight - vis.margin.bottom) + ")" );
		vis.yAxisGroup = vis.g.append("g").attr("class", "y axis").attr("transform", "translate(" + vis.margin.left + ",0)");

		vis.wrangleData();
	}

	wrangleData(){
		const vis = this;

		// Arrays to create domains of the axes
		vis.totalCases = [];
		vis.deaths = [];
		vis.continents = [];
		vis.population = [];

		// Getting Continents for our color scale
		wrkData.forEach(country => {
			if(vis.continents.indexOf(country.continent) < 0){
				vis.continents.push(country.continent);
			}
		});

		// Get values chosen by user
		vis.chosenDate = $("#time-series-date-select").val();
		vis.chosenContinent = $("#time-series-continent-select").val();

		// Get data to work with given the chosen country
		switch(vis.chosenContinent){
			case "Asia":
				vis.data = wrkData.filter(country => country.continent == "Asia");
				break;
			case "Africa":
				vis.data = wrkData.filter(country => country.continent == "Africa");
				break;
			case "Europe":
				vis.data = wrkData.filter(country => country.continent == "Europe");
				break;
			case "North America":
				vis.data = wrkData.filter(country => country.continent == "North America");
				break;
			case "South America":
				vis.data = wrkData.filter(country => country.continent == "South America");
				break;
			case "Oceania":
				vis.data = wrkData.filter(country => country.continent == "Oceania");
				break;
			default:
				vis.data = wrkData;
				break;
		}
		
		vis.data.forEach(country => {
			// Get the populations 
			vis.population.push(country.population);
			// Get the total deaths
			country.cases.map(one => {
				if(vis.deaths.indexOf(one.total_deaths) < 0 && one.date == vis.chosenDate){
					vis.deaths.push(one.total_deaths);
				}
			});
			// Get the total cases
			country.cases.map(one => {
				if(vis.totalCases.indexOf(one.total_cases) < 0 && one.date == vis.chosenDate){
					vis.totalCases.push(one.total_cases);
				}
			});
		});

		vis.updateChart();
	}

	updateChart(){
		const vis = this;

		// Set up domains for our scales
		vis.continentColor.domain(vis.continents);
		vis.radiusScale.domain(d3.extent(vis.population));
		vis.xScale.domain([0, d3.max(vis.totalCases)]);
		vis.yScale.domain([0, d3.max(vis.deaths)]);

		// Set up axes
		vis.xAxis = d3.axisBottom(vis.xScale).ticks(5);
		vis.yAxis = d3.axisLeft(vis.yScale);

		// Call axes
		vis.xAxisGroup.transition(vis.t()).call(vis.xAxis);
		vis.yAxisGroup.transition(vis.t()).call(vis.yAxis);

		// Style text on the axes
		vis.xAxisGroup.selectAll("text").attr("class", "text-muted").style("font-family", "'Open Sans', sans-serif").style("font-size", "0.35rem");
		vis.yAxisGroup.selectAll("text").attr("class", "text-muted").style("font-family", "'Open Sans', sans-serif").style("font-size", "0.35rem");

		// Data join
		vis.circles = vis.g.selectAll("circle").data(vis.data);

		// D3 update pattern
		vis.circles.exit().remove();

		vis.circles.enter().append("circle")
		   .attr("fill-opacity", 0.7)
		   .attr("data-country", d => d.country)
		   .attr("data-deaths", d =>{
			   	let totalDeaths = d.cases.filter(one => one.date == vis.chosenDate);
			   	return((totalDeaths.length > 0) ? totalDeaths[0].total_deaths : 0);		
		   	})
		   .attr("data-cases", d => {
		   		const totalCase = d.cases.filter(one => one.date == vis.chosenDate);
		   		return((totalCase.length > 0) ? totalCase[0].total_cases : 0);			
		   	})
		   .attr("stroke", "grey")
		   .style("cursor", "pointer")
		   .on("mouseover", d => {
		   		// Mouseover effects
		   		const totalCase = d.cases.filter(one => one.date == vis.chosenDate)
		   	    const circle = d3.select(event.currentTarget);
		   		circle.attr("fill-opacity", 1);
		   		circle.attr("stroke", "black");
		   		circle.attr("stroke-width", 1);
      			toolTip.style("visibility", "visible");
      			toolTip.style("text-align", "left")
	      		toolTip.html( () => {
	            return(
	            	"<span class=\"tooltip-label\">Continent: </span>" + d.continent +
	            	"<br>" +
	            	"<span class=\"tooltip-label\">Country Code: </span>" + d.country_code +
	            	"<br>" +
	            	"<span class=\"tooltip-label\">Country: </span>" + d.country +
	            	"<br>" +
	            	"<span class=\"tooltip-label\">Date: </span>" + totalCase[0].date +
	            	"<br>" +
	            	"<span class=\"tooltip-label\">Population: </span>" + numbersWithCommas(d.population) +
	            	"<br>" +
	            	"<span class=\"tooltip-label\">Total Cases: </span>" + numbersWithCommas(totalCase[0].total_cases) +
	            	"<br>" + 
	            	"<span class=\"tooltip-label\">Total Deaths: </span>" + numbersWithCommas(totalCase[0].total_deaths) +
	            	"<br>")
	        	});
	        	toolTip.style("left", d3.event.pageX + "px");
        		toolTip.style("top", d3.event.pageY + "px");
	      	})
           .on("mouseout", function (d) {
        		// Mouseout effects
        		var circle = d3.select(event.currentTarget);
      			toolTip.style("visibility", "hidden");
      			circle.attr("fill-opacity", 0.7);
		   		circle.attr("stroke", "grey");
    		})
    	   .merge(vis.circles)
    	   .transition(vis.t())
    	   .attr("cx", d => {
		   		const totalCase = d.cases.filter(one => one.date == vis.chosenDate);
		   		return((totalCase.length > 0 && totalCase[0].total_deaths >= 0) ? vis.xScale(totalCase[0].total_cases) : null)
		   })
		   .attr("cy", d => {
		   		const totalDeaths = d.cases.filter(one => one.date == vis.chosenDate);
		   		return((totalDeaths.length > 0 && totalDeaths[0].total_cases >= 0) ? vis.yScale(totalDeaths[0].total_deaths) : null);		
		   })
		   .attr("r", d => {
			   	const totalCase = d.cases.filter(one => one.date == vis.chosenDate);
			   	return((totalCase[0] != undefined && (totalCase[0].total_deaths != undefined && totalCase[0].total_cases != undefined)) ? vis.radiusScale(d.population) : 0);
		   })
		   .attr("fill", d => {
		   		return(vis.continentColor(d.continent))
		   });

		
		// Code for the legend
		// NB: We remove the legend if it already exists.
		d3.select("#timeseries-legend").remove(); 

		vis.legend = vis.g.append("g").attr("id", "timeseries-legend").attr("transform", "translate("+ (vis.svgWidth - vis.margin.right + 5) + "," + (vis.svgHeight - vis.margin.bottom - 125) + ")" )

		vis.continents.forEach((continent, i) => {
				const legendRow = vis.legend.append("g").attr("transform", "translate(0, " + (i*20) + ")");

				legendRow.append("rect")
						 .attr("width", 10)
						 .attr("height", 10)
						 .attr("fill", vis.continentColor(continent))
						 .attr("stroke", "grey")
						 .attr("fill-opacity", 0.6);

			    legendRow.append("text")
			    		 .attr("x", -2)
			    		 .attr("y", 10)
			    		 .attr("text-anchor", "end")
			    		 .attr("class", "text-muted")
			    		 .style("text-transform", "capitalize")
			    		 .style("font-family", "cursive, sans-serif")
			    		 .style("font-size", "0.35rem")
			    		 .text(continent);
		});
	}

	filterCountry(country){
		const vis = this;

		// Get selected country
		vis.data = vis.data.filter( item =>  item.country == country);

		// Data join
		vis.circles = vis.g.selectAll("circle").data(vis.data);

		// D3 update pattern
		vis.circles.exit().remove();

		vis.circles.enter().append("circle")
		   .attr("fill-opacity", 0.7)
		   .attr("data-country", d => d.country)
		   .attr("data-deaths", d =>{
			   	const totalDeaths = d.cases.filter(one => one.date == vis.chosenDate);
			   	return(totalDeaths.length > 0 ? totalDeaths[0].total_deaths : 0);
		   	})
		   .attr("data-cases", d => {
		   		const totalCase = d.cases.filter(one => one.date == vis.chosenDate);
		   		return(totalCase.length > 0 ? totalCase[0].total_cases : 0);
		   	})
		   .attr("stroke", "grey")
		   .on("mouseover", d => {
		   		// Mouseover effects
		   		const totalCase = d.cases.filter(one => one.date == vis.chosenDate)
		   	    const circle = d3.select(event.currentTarget);
		   		circle.attr("fill-opacity", 1);
		   		circle.attr("stroke", "black");
		   		circle.attr("stroke-width", 1);
      			toolTip.style("visibility", "visible");
      			toolTip.style("text-align", "left");
	      		toolTip.html( () => {
	            return(
	            	"<span class=\"tooltip-label\">Continent: </span>" + d.continent +
	            	"<br>" +
	            	"<span class=\"tooltip-label\">Country Code: </span>" + d.country_code +
	            	"<br>" +
	            	"<span class=\"tooltip-label\">Country: </span>" + d.country +
	            	"<br>" +
	            	"<span class=\"tooltip-label\">Date: </span>" + totalCase[0].date +
	            	"<br>" +
	            	"<span class=\"tooltip-label\">Population: </span>" + numbersWithCommas(d.population) +
	            	"<br>" +
	            	"<span class=\"tooltip-label\">Total Cases: </span>" + numbersWithCommas(totalCase[0].total_cases) +
	            	"<br>" + 
	            	"<span class=\"tooltip-label\">Total Deaths: </span>" + numbersWithCommas(totalCase[0].total_deaths) +
	            	"<br>")
	        	});
	        	toolTip.style("left", d3.event.pageX + "px");
        		toolTip.style("top", d3.event.pageY + "px");
	      	})
           .on("mouseout", function (d) {
        		// Mouseout effects
        		const circle = d3.select(event.currentTarget);
      			toolTip.style("visibility", "hidden");
      			circle.attr("fill-opacity", 0.7);
		   		circle.attr("stroke", "grey");
    		})
    	   .merge(vis.circles)
    	   .transition(vis.t())
    	   .attr("cx", d => {
		   		const totalCase = d.cases.filter(one => one.date == vis.chosenDate);
		   		return(totalCase.length > 0 ? vis.xScale(totalCase[0].total_cases) : null);
		   })
		   .attr("cy", d => {
		   		const totalDeaths = d.cases.filter(one => one.date == vis.chosenDate);
		   		return(totalDeaths.length > 0 ? vis.yScale(totalDeaths[0].total_deaths) : null);
		   })
		   .attr("r", d => {
			   	const totalCase = d.cases.filter(one => one.date == vis.chosenDate);
			   	const totalDeaths = d.cases.filter(one => one.date == vis.chosenDate);
			   	return((totalDeaths[0] != undefined && totalCase[0] != undefined) ? vis.radiusScale(d.population) : 0);
		   })
		   .attr("fill", d => {
		   		return(vis.continentColor(d.continent))
		   });
	}
}