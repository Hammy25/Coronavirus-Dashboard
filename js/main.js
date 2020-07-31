/*
	Main js file.
	Controller file.
*/

$("document").ready( () => { 

	// Display the preloader for 2 seconds to allow documents to be downloaded
	$(window).on("load", () => {
		setTimeout( () => {
			$("#pre-loader").fadeOut("slow", function() {$(this).remove();})},2000);
	});
	// Loading data
	var promises = [d3.json("https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.json"), d3.json("data/counties.json"), d3.csv("data/kenya_daily_covid.csv"), d3.json("https://pomber.github.io/covid19/timeseries.json")];

	Promise.all(promises).then(data => {
		// Drawing visualizations
		worldIntialize(data[0]);
		drawTimeSeries(data[0]);
		populateKenyaSummary(data[3]);
		drawMap(data[1], data[2]);
		populateDetails(data[2]);
	}).catch( (error) => {
		console.log("An error occurred: ");
		console.log(error);
	});


});
