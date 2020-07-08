/*
	Main js file.
	Controller file.
*/

// Global variables
// Charts
var barChar, smokersPieChart;

// Country code
var defaultCode = "KEN";

// Tooltip code
 var toolTip = d3.select("body")
    			 .append("div")
    			 .attr("id", "tooltip")
    			 .style("background-color", "rgba(139, 166, 106)")
    			 .style("visibility", "hidden");

// Time parser
var timeParser = d3.timeParse("%Y-%m-%d");

// Edit General info
const editInformation = (d) => {
	if(d.location === "World"){
		$("#continent").text(d.location);
	}else{
		$("#continent").text(d.continent);
	}
	console.log(d);
	$("#population").text(typeof d.population == undefined ? "N/A" : d.population);
	$("#pop-den").text(typeof d.population_density === undefined ? "N/A" : d.population_density);
	$("#median-age").text(typeof d.median_age === undefined ? "N/A" : d.median_age);
	$("#65-older").text(typeof d.aged_65_older === undefined ? "N/A" : d.aged_65_older);
	$("#70-older").text(typeof d.aged_70_older === undefined ? "N/A" : d.aged_70_older);
	$("#gdp").text(typeof d.gdp_per_capita === undefined ? "N/A" : d.gdp_per_capita);
	$("#handwash").text(typeof d.handwashing_facilities === undefined ? "N/A" : d.handwashing_facilities);
	$("#beds").text(typeof d.hospital_beds_per_thousand === undefined ? "N/A" : d.hospital_beds_per_thousand);
	$("#poverty").text(typeof d.extreme_poverty === undefined ? "N/A" : d.extreme_poverty);
	$("#diabetes").text(typeof d.diabetes_prevalence === undefined ? "N/A" : d.diabetes_prevalence);
	$("#life").text(typeof d.life_expectancy === undefined ? "N/A" : d.life_expectancy);
	$("#cvd").text(typeof d.cvd_death_rate === undefined ? "N/A" : d.cvd_death_rate);
	$("#general-heading").text(d.location + " General Information")
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
}

// Event handling selector
$("#var-select").on("change", () => {
	barChart.wrangleData();
});

$("#country-select").on("change", () => {
	barChart.wrangleData();
	smokersPieChart.wrangleData();
});

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


$("document").ready( () => { 

d3.json("https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.json").then( (data) => {

	var countryCodes = Object.keys(data);
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

	barChart = new BarChart("#bar");
	smokersPieChart = new DonutChart("#smokers");

	$("#country-select").on("change", (allData) => {
		var country_code = $("#country-select").val();
		editInformation(allCases[country_code]);
	});

}).catch( (error) => {
	console.log("An error occurred: ");
	console.log(error);
});

});
