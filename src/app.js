import $ from "jquery";
import * as d3 from "d3";
import React from "react";
import ReactDOM from "react-dom";
import Dashboard from "./js/components/Dashboard";
import {worldIntialize,
		drawTimeSeries,
		populateKenyaSummary,
		drawMap,
		populateDetails,
		barChart,
		timeline,
		smokersPieChart,
		timeseries} from "./js/visualizations/drawing";
import "normalize.css/normalize.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/nprogress.css";
import "./css/style.css";

// Reader the dashboard
ReactDOM.render(<Dashboard />, document.getElementById("app"));

// Event handling
$("#var-select").on("change", () => {
	barChart.wrangleData();
	timeline.wrangleData();
});


$("#country-select").on("change", () => {
	barChart.wrangleData();
	smokersPieChart.wrangleData();
	timeline.wrangleData();
});


$("#time-series-country-select").on("change", () => {
	if($("#time-series-country-select").val() === "all"){
		timeseries.wrangleData()
	}else{
		timeseries.wrangleData();
		timeseries.filterCountry($("#time-series-country-select").val());
	}	
});

$("#time-series-date-select").on("change", () => {
	timeseries.wrangleData();
});



$("document").ready( () => { 
	// Top progress bar
	NProgress.inc();

	// Loading data
	const promises = [d3.json("/data/owid-covid-data.json"),
					  d3.json("/data/counties.json"),
					  d3.csv("/data/kenya_daily_covid.csv")
	];

	Promise.all(promises).then(data => {
		// Drawing visualizations
		worldIntialize(data[0]);
		drawTimeSeries(data[0]);
		drawMap(data[1], data[2]);
		populateDetails(data[2]);
		setTimeout( () => {
			$("#pre-loader").fadeOut("slow", () => $(this).remove());
			NProgress.done(true);
		}, 1500);
		$("#navigation-bar").addClass("sticky-top");
	}).catch( (error) => {
		console.log("An error occurred: ");
		console.log(error);
	});


});