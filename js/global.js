/*
	This file contains  global variables ,event handlers and helper functions.
*/

// Charts
let barChar, smokersPieChart, kenya, timeline, timeseries;

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

// Handle brushes
const brushed = () => {
      const selection = d3.event.selection || timeline.x.range();
      const newValues = selection.map(timeline.x.invert)
      barChart.wrangleData(newValues);
};

// Tooltip 
const toolTip = d3.select("body").append("div").attr("id", "tooltip")
				.style("background-color", "rgb(139, 166, 106)")
				.style("visibility", "hidden");

// Time parser
const timeParser = d3.timeParse("%Y-%m-%d");
const timeParser2 = d3.timeParse("%d/%m/%Y");

// Time format
const formatTime = d3.timeFormat("%A %d %B, %Y");
const formatTime_2 = d3.timeFormat("%Y-%m-%d");


//  Add commas to digits for display
const numbersWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Format time to be displayed on dashboards
const formatForDisplay = (time) => {
	let t = timeParser2(time);
	return(formatTime(t));
};

const formatForDisplay_2 = (time) => {
	let t = timeParser(time);
	return(formatTime(t));
};

//determine title heading
const determineTitle = (key) => {
	let titleText = "";

	switch(key){
		case "new_deaths":
		titleText = "New Deaths";
		break;
		case "new_tests":
		titleText = "New Tests";
		break;
		case "total_cases":
		titleText = "Total Cases";
		break;
		case "total_deaths":
		titleText = "Total Deaths";
		break;
		case "total_tests":
		titleText = "Total Tests";
		break;
	    default:
		titleText = "New Cases";
		break;
	}
	return titleText;
};


// Format Data
const formatData = (data) => {
	data.forEach( item => {
		if(typeof item.date === "string"){
			item.date = timeParser(item.date);
		}
		item.aged_65_older = +item.aged_65_older;
		item.aged_70_older = +item.aged_70_older;
		item.cvd_death_rate = +item.cvd_death_rate;
		item.diabetes_prevalence = +item.diabetes_prevalence;
		item.extreme_poverty = +item.extreme_poverty;
		item.female_smokers = +item.female_smokers;
		item.gdp_per_capita = +item.gdp_per_capita
		item.handwashing_facilities = +item.handwashing_facilities;
		item.hospital_beds_per_thousand = +item.hospital_beds_per_thousand;
		item.life_expectancy = +item.life_expectancy; 
		item.male_smokers = +item.male_smokers;
		item.median_age = +item.median_age;
		item.new_cases = +item.new_cases;
		item.new_cases_per_million = +item.new_cases_per_million;
		item.new_deaths = +item.new_deaths;
		item.new_deaths_per_million = +item.new_deaths_per_million;
		item.new_tests = +item.new_tests;
		item.new_tests_per_thousand = +item.new_tests_per_thousand;
		item.population = +item.population;
		item.population_density = +item.population_density;
		item.stringency_index = +item.stringency_index;
		item.total_cases = +item.total_cases;
		item.total_cases_per_million = +item.total_cases_per_million;
		item.total_deaths = +item.total_deaths;
		item.total_deaths_per_million = +item.total_deaths_per_million;
		item.total_tests = +item.total_tests;
		item.total_tests_per_thousand = +item.total_tests_per_thousand;
	});

	return data;
};

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
		$("#pop-den").text(d.population_density === undefined ? "N/A" : d.population_density);
		$("#median-age").text( d.median_age === undefined ? "N/A" : d.median_age);
		$("#older").text( d.aged_65_older === undefined ? "N/A" : d.aged_65_older + "%");
		$("#oldest").text( d.aged_70_older === undefined ? "N/A" : d.aged_70_older + "%");
		$("#gdp").text( d.gdp_per_capita === undefined ? "N/A" : numbersWithCommas(d.gdp_per_capita));
		$("#handwash").text( d.handwashing_facilities === undefined ? "N/A" : d.handwashing_facilities + "%");
		$("#beds").text( d.hospital_beds_per_thousand === undefined ? "N/A" : d.hospital_beds_per_thousand);
		$("#poverty").text( d.extreme_poverty === undefined ? "N/A" : d.extreme_poverty + "%");
		$("#diabetes").text( d.diabetes_prevalence === undefined ? "N/A" : d.diabetes_prevalence);
		$("#life").text( d.life_expectancy === undefined ? "N/A" : d.life_expectancy);
		$("#cvd").text( d.cardiovasc_death_rate === undefined ? "N/A" : d.cardiovasc_death_rate);
		$("#general-heading").text(d.location + " General Information")
	};

	// Kenya summary displays
	const populateKenyaSummary = (data) => {
		const addSign = (theNumber) => (theNumber > 0 ? ("+" + theNumber) : theNumber.toString());
		const workingData = data["Kenya"];
		const last = workingData[workingData.length-1];
		const secondLast = workingData[workingData.length-2];
		const todayConfirmed = last.confirmed;
		const todayDeaths = last.deaths;
		const todayRecovered = last.recovered;
		const todayActive = last.confirmed - last.recovered - last.deaths;
		const todayConfirmedChange = last.confirmed - secondLast.confirmed;
		const todayDeathsChange = last.deaths - secondLast.deaths;
		const todayRecoveredChange = last.recovered - secondLast.recovered;
		const todayActiveChange = todayActive - (secondLast.confirmed - secondLast.recovered - secondLast.deaths);
		$("#kenya-heading small").text("Last update: " + formatForDisplay_2(last.date));
		$("#kenya-confirmed small").text(numbersWithCommas(addSign(todayConfirmedChange)));
		$("#kenya-active small").text(numbersWithCommas(addSign(todayActiveChange)));
		$("#kenya-recovered small").text(numbersWithCommas(addSign(todayRecoveredChange)));
		$("#kenya-deceased small").text(numbersWithCommas(addSign(todayDeathsChange)));
		$("#kenya-confirmed .kenya-value").text(numbersWithCommas(todayConfirmed));
		$("#kenya-active .kenya-value").text(numbersWithCommas(todayActive));
		$("#kenya-recovered .kenya-value").text(numbersWithCommas(todayRecovered));
		$("#kenya-deceased .kenya-value").text(numbersWithCommas(todayDeaths));
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
		counties = chosenDateValues.map(county => {
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
				obj = {};
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
		datesObjects = dates.map(date => new Date(date));
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