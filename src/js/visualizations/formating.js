/*
	Contains methods to format data.
*/
import * as d3 from "d3";

// Time parser
const timeParser = d3.timeParse("%Y-%m-%d");
const timeParser2 = d3.timeParse("%d/%m/%Y");

// Time format
const formatTime = d3.timeFormat("%A %d %B, %Y");
const formatTime_2 = d3.timeFormat("%Y-%m-%d");

//  Add commas to digits for display
const numbersWithCommas = (x) => {
    return x != undefined ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0;
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


// Add sign infront of number
const addSign = (theNumber) => (theNumber > 0 ? ("+" + theNumber) : theNumber.toString());


export {
	timeParser,
	timeParser2,
	formatTime,
	formatTime_2,
	numbersWithCommas,
	formatForDisplay,
	formatForDisplay_2,
	formatData,
	determineTitle,
	addSign
};