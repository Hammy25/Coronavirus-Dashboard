/*
	Methods for drawing visualizations.
*/

import * as d3 from "d3";
import $ from "jquery";
import BarChart from "./bar";
import Timeline from "./timeline";
import DonutChart from "./pie";
import TimeSeries from "./timeseries";
import KenyaMap from "./kenya";
import {numbersWithCommas,
		formatForDisplay,
		formatForDisplay_2,
		formatTime_2} from "./formating.js";

let allData,
	allCases,
	wrkData,
	kenyaMapData,
	barChart,
	timeline,
	smokersPieChart,
	timeseries,
	covid_data,
	kenya;

// Initialize first visualizations.
const worldIntialize = (data) => {
		const countryCodes = Object.keys(data);
		countryCodes.map( code => {
			if(code === "KEN"){
				$("#country-select").append($("<option>").attr("value", code).attr("selected", "selected").text(data[code].location));
				editInformation(data[code]);
			}else{
				$("#country-select").append($("<option>").attr("value", code).text(data[code].location));
			}
		});

		allData = data;

		allCases = data;
		
		barChart = new BarChart("#bar", 600, 300);
		timeline = new Timeline("#bar", 600, 60);
		smokersPieChart = new DonutChart("#smokers", 340, 170);

		$("#country-select").on("change", (allData) => {
			const country_code = $("#country-select").val();
			editInformation(allCases[country_code]);
			timeline.wrangleData();
		});
};

// Edit General info
const editInformation = (d) => {
	d.location === "World" ? $("#continent").text(d.location) : $("#continent").text(d.continent);
	$("#population").text(d.population === undefined ? "N/A" : numbersWithCommas(d.population));
	$("#pop-den").text(d.population_density === undefined ? "N/A" : d.population_density + " per square km");
	$("#median-age").text( d.median_age === undefined ? "N/A" : d.median_age);
	$("#older").text( d.aged_65_older === undefined ? "N/A" : d.aged_65_older + "%");
	$("#oldest").text( d.aged_70_older === undefined ? "N/A" : d.aged_70_older + "%");
	$("#gdp").text( d.gdp_per_capita === undefined ? "N/A" : "$" + numbersWithCommas(d.gdp_per_capita));
	$("#handwash").text( d.handwashing_facilities === undefined ? "N/A" : d.handwashing_facilities + "%");
	$("#beds").text( d.hospital_beds_per_thousand === undefined ? "N/A" : d.hospital_beds_per_thousand);
	$("#poverty").text( d.extreme_poverty === undefined ? "N/A" : d.extreme_poverty + "%");
	$("#diabetes").text( d.diabetes_prevalence === undefined ? "N/A" : d.diabetes_prevalence + "% of population aged 20 to 79");
	$("#life").text( d.life_expectancy === undefined ? "N/A" : d.life_expectancy);
	$("#cvd").text( d.cardiovasc_death_rate === undefined ? "N/A" : d.cardiovasc_death_rate + " deaths per 100,000 people");
	$("#general-heading").text(d.location + " General Information")
};

//  Draw the Kenya map
const drawMap = (ke, c_data) => {

	kenyaMapData = ke; 
	covid_data = c_data;

	let columns = c_data.columns;

	columns = columns.filter(column => (column != "County" && column != ""));

	$("#kenya-last").text("Last update: " + formatForDisplay(columns[columns.length-1]));

	$("#kenya-date").attr("min", columns[0]).attr("max", columns[columns.length-1]).attr("value", columns[columns.length-1]);

	$("#date-range").attr("min", columns[0]);
	$("#date-range").attr("max", columns[columns.length-1]);


	kenya = new KenyaMap("#kenya-map", 900, 600);

	$("#kenya-date").on("change", () => {
		const chosenDate = $("#kenya-date").val();
		kenya.wrangleData();
		$("#kenya-details-container h2").text(formatForDisplay(chosenDate));
		$("#range-value").text($("#kenya-date").val());
		populateDetails(c_data);
	});

};


// Populates Kenya's details on a table
const populateDetails = (data) => {
	const chosenDate = data.columns[data.columns.length-1];
	$("#kenya-details-container h3").text(formatForDisplay(chosenDate));
	let chosenDateValues = [];
	let totalValues = [];
	chosenDateValues = data.map(county => {
		let obj = {};
		if(county.County != "Total"){
			let co = county.County;
			let value = county[chosenDate];
			obj = {county : co,
				   cases: value};
			return obj;
		}
	});
	totalValues = data.map(county => {
		let obj = {};
		let sum = 0;
		let keys = Object.keys(county);
		keys.forEach(key => {
			if(key != "County"){
				sum += county[key];
			}
		});
		if(county.County != "Total"){
			let co = county.County;
			obj = {county : co,
				   cases: sum};
			return obj;
		}
	});

	const compare = (a, b) => {
	  const countyA = a.cases;
	  const countyB = b.cases;

	  let comparison = 0;
	  if(countyA > countyB){
	    comparison = -1;
	  }else if(countyA < countyB){
	    comparison = 1;
	  }
	  return comparison;
	}

	chosenDateValues = chosenDateValues.sort(compare).filter(county => county != undefined);
	totalValues = totalValues.sort(compare).filter(county => county != undefined);
	let counties = chosenDateValues.map(county => {
		if(county != undefined){
			return(county.county);
		}
	});

	counties.map(county => {
		let countyName = county.toUpperCase();
		$("#kenya-details-table").append("<div class=\"county-row\"></div>")
		let last = $("#kenya-details-table .county-row").last();
		last.append("<div class=\"county-name text-muted\">" + countyName + "</div>");
		const chosen_1 = chosenDateValues.filter(c => c.county == county);
		last.append("<div class=\"county-today\">" + numbersWithCommas(chosen_1[0].cases) + "</div>");
		const chosen_2 = totalValues.filter(c => c.county == county);
		last.append("<div class=\"county-total\">" + numbersWithCommas(chosen_2[0].cases) + "</div>");
	})
};

// Draw the death to cases scatter plot
const drawTimeSeries = (data) => {

	let workingData = [];
	Object.entries(data).map(data => {
		if(data[0] != "OWID_WRL"){
			let obj = {};
			obj["country_code"] = data[0];
			obj["country"] = data[1].location;
			obj["continent"] = data[1].continent;
			obj["cases"] = data[1].data;
			obj["population"] = data[1].population;
			workingData.push(obj);
		}
	});

	wrkData = workingData;

	let dates = [];
	let continents = [];
	let countries = [];
	
	wrkData.forEach(country => {
		if(continents.indexOf(country.continent) < 0){
			continents.push(country.continent);
		}
		// if(countries.indexOf(country.country) < 0){
		// 	countries.push(country.country);
		// }
		country.cases.map(one => {
			if(dates.indexOf(one.date) < 0){
				dates.push(one.date);
			}
		});
	});

	dates = Array.from( new Set(dates));
	let datesObjects = dates.map(date => new Date(date));
	datesObjects.sort( (a,b) => a-b);
	dates = datesObjects.map(date => formatTime_2(date));

	continents.map(continent => {$("#time-series-continent-select").append($("<option>").attr("value", continent).text(continent));});
	wrkData.map(country => $("#time-series-country-select").append($("<option>").attr("value", country.country).text(country.country)));
	$("#time-series-date-select").attr("min", dates[0]).attr("max", dates[dates.length-1]).attr("value", dates[dates.length-1]);

	timeseries = new TimeSeries("#time-series", 600, 300);

	$("#time-series-continent-select").on("change", () => {
		timeseries.wrangleData();
		$("#time-series-country-select").empty();
		$("#time-series-country-select").append($("<option>").attr("value", "all").text("All"));
		if($("#time-series-continent-select").val() === "world"){
			wrkData.map(country => $("#time-series-country-select").append($("<option>").attr("value", country.country).text(country.country)));
		}
		wrkData.map(country => {
			if(country.continent === $("#time-series-continent-select").val()){
				$("#time-series-country-select").append($("<option>").attr("value", country.country).text(country.country));
			}
		});
	});
};

export {
	worldIntialize,
	drawTimeSeries,
	drawMap,
	populateDetails,
	allCases,
	allData,
	wrkData,
	kenyaMapData,
	covid_data,
	barChart,
	timeline,
	smokersPieChart,
	timeseries
};