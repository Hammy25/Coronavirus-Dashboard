/*
	Main js file.
	Controller file.
*/

$("document").ready( () => { 
	// Top progress bar
	NProgress.inc();

	// Loading data
	var promises = [d3.json("https://covid.ourworldindata.org/data/owid-covid-data.json"), d3.json("data/counties.json"), d3.csv("data/kenya_daily_covid.csv"), d3.json("https://pomber.github.io/covid19/timeseries.json")];

	Promise.all(promises).then(data => {
		// Drawing visualizations
		worldIntialize(data[0]);
		drawTimeSeries(data[0]);
		populateKenyaSummary(data[3]);
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
