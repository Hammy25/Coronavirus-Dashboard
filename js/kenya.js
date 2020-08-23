class KenyaMap{

	constructor(_parentElement, _width, _height){
		this.parentElement = _parentElement;
		this.width = _width;
		this.height = _height;

		this.initializeChart();
	}

	initializeChart(){
		var vis = this;

		//  Defining svg
		vis.svg = d3.select(vis.parentElement)
					.append("svg")
					.attr("preserveAspectRatio", "xMinYMin meet")
					.attr("viewBox", "0 0 " + vis.width + " " + vis.height)
					.attr("id", "map-canvas")
					.classed(".svg-content", true);

		// Defining color scale to be used (NB: using reds.)
		// vis.colorScale = d3.scaleSequential().interpolator(d3.interpolateReds);
		vis.radiusScale = d3.scaleLinear().range([4, 50]);

		// Defining the projection of the map
		// Coordinates of the center of the map (logitude, latitude)
		// Zoom on map 
		vis.projection = d3.geoMercator().center([37.9062, 0.0236]).scale(3100).translate([vis.width/2, vis.height/2]);
		
		// Definig geoGenerator to help draw map
		vis.geoGenerator = d3.geoPath().projection(vis.projection);

		vis.wrangleData();
	}

	wrangleData(){
		var vis = this;

		// Get columns from the data read from the csv.
		var columns = covid_data.columns;

		// Get values to be used with the color scale.
		vis.values = [];

		// Get the picked color.
		vis.date = $("#kenya-date").val();

		// Cleaning up data before using it to draw the map.
		covid_data.forEach(data => {
			for(let index=0; index < columns.length; index++){
				if(columns[index] != "County"){
					data[columns[index]] = +data[columns[index]];
					if(vis.values.indexOf(data[columns[index]]) === -1 && data.County != "Total"){
						vis.values.push(data[columns[index]]);
					}
				}
			}
		});

		vis.totalValCases = covid_data.map(county => {
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

		vis.totalValCases = vis.totalValCases.filter(county => county != undefined);

		$("#county-name").text(vis.totalValCases[0].county.toUpperCase());
		$("#county-cases").text(vis.totalValCases[0].cases);

		vis.updateChart();
	}

	updateChart(){
		var vis = this;

		// Define a domain for the color scale
		vis.radiusVals = vis.totalValCases.map(one => one.cases);
		// vis.colorScale.domain(d3.extent(vis.values));
		vis.radiusScale.domain([d3.min(vis.radiusVals), d3.max(vis.radiusVals)]);

		// Data join
		vis.dataJoin = vis.svg.selectAll("path").data(topojson.feature(kenyaMapData, kenyaMapData.objects.counties).features);

		vis.bubblesData = topojson.feature(kenyaMapData, kenyaMapData.objects.counties).features;
		
		//D3 Update pattern
		vis.dataJoin.exit().remove();

		vis.dataJoin.attr("class", "county")
		   .attr("d", vis.geoGenerator)
		   .attr("data-county", d => d.properties.COUNTY_NAM)
		   .attr("data-date", $("#kenya-date").val())
		   .attr("data-county-code", d => {
			 	if(d.properties.COUNTY_COD > 0) {
			 		return d.properties.COUNTY_COD;
			 	}
		 	})
		   	.attr("fill", d => {
			 	if(d.properties.COUNTY_NAM != null && d.properties.COUNTY_COD > 0){
				 	var county = covid_data.filter(obj => obj.County.toUpperCase() === d.properties.COUNTY_NAM);
				 	var value = county[0][vis.date];
				 	if(county[0] != "Total"){
				 		return vis.colorScale(value);
				 	}
		 	}
		 	})
		 	.attr("data-cases", d => {
			 	if(d.properties.COUNTY_NAM != null && d.properties.COUNTY_COD > 0){
				 	var county = covid_data.filter(obj => obj.County.toUpperCase() === d.properties.COUNTY_NAM);
				 	var value = county[0][vis.date];
				 }
			return value
		});

		vis.dataJoin.enter()
		 .append("path")
		 .attr("class", "county")
		 .attr("d", vis.geoGenerator)
		 .attr("stroke", "rgba(255, 0, 0, 0.3)")
		 .attr("stroke-width", 1)
		 .attr("data-county", d => d.properties.COUNTY_NAM)
		 .attr("data-date", $("#kenya-date").val())
		 .attr("data-county-code", d => {
		 	if(d.properties.COUNTY_COD > 0) {
		 		return d.properties.COUNTY_COD;
		 	}
		 })
		 .attr("data-cases", d => {
		 	if(d.properties.COUNTY_NAM != null && d.properties.COUNTY_COD > 0){
			 	var county = covid_data.filter(obj => obj.County.toUpperCase() === d.properties.COUNTY_NAM);
			 	var value = county[0][vis.date];
			 }
			return value
		 })
		 .attr("fill", "white");


    	vis.bubbles = vis.svg.selectAll(".bubbles")
	      .data(vis.bubblesData)
	      .enter().append("circle")
	      .attr("class", "bubbles")
	      .attr("r", d => {
	      	if(d.properties.COUNTY_NAM != null && d.properties.COUNTY_COD > 0){
			 	var county = vis.totalValCases.filter(obj => obj.county.toUpperCase() === d.properties.COUNTY_NAM);
			 	var value = county[0].cases;
			 	if(county[0] != "Total"){
			 		return vis.radiusScale(value);
			 	}
		 	}
	      })
	      .attr("cx", function(d) { return vis.geoGenerator.centroid(d)[0] })
	      .attr("cy", function(d) { return vis.geoGenerator.centroid(d)[1] })
	      .attr("fill", "rgba(255, 0, 0, 0.1)")
	      .attr("stroke", "rgba(255, 0, 0, 0.5)")
	      .on("mouseover", d => {
		   		// Mouseover effects
		   		var county = vis.totalValCases.filter(obj => obj.county.toUpperCase() === d.properties.COUNTY_NAM);
			 	$("#county-name").text(county[0].county.toUpperCase());
			 	$("#county-cases").text(numbersWithCommas(county[0].cases));
		   		var county = covid_data.filter(obj => obj.County.toUpperCase() === d.properties.COUNTY_NAM);
			 	var value = county[0][vis.date];
		   	    var area = d3.select(event.currentTarget);
		   		area.attr("stroke", "rgba(255, 0, 0, 0.5)");
		   		area.attr("stroke-width", 1);
		   		area.style("z-index", 1);
		   		area.attr("fill", "rgba(255, 0, 0, 0.3)")
	      	})
        .on("mouseout", (d) => {
        		// Mouseout effects
        		var area = d3.select(event.currentTarget);
      			toolTip.style("visibility", "hidden");
      			area.style("z-index", 0);
		 		area.attr("fill", "rgba(255, 0, 0, 0.1)")
    		});

      	vis.legend = vis.svg.append("g").attr("transform", "translate(" + (vis.width-200) + ", " + (vis.height-200) + ")");

		vis.svg.selectAll("legend")
		.data(vis.radiusScale.ticks(4))
		.enter()
		.append("circle")
		.attr("cx", vis.width-200)
		.attr("cy", (d) => { return (vis.height-200) - vis.radiusScale(d) } )
		.attr("r", (d) => { return vis.radiusScale(d) })
		.attr("fill", "none")
		.attr("stroke", "rgba(255, 0, 0, 0.5)")

		vis.svg.selectAll("legend")
		.data(vis.radiusScale.ticks(4))
		.enter()
		.append("line")
	    .attr("x1", (d) =>{ return vis.width-200 + vis.radiusScale(d) } )
	    .attr("x2", vis.width-100)
	    .attr("y1", (d) => { return (vis.height-200) - vis.radiusScale(d) } )
	    .attr("y2", (d) => { return (vis.height-200) - vis.radiusScale(d) } )
	    .attr("stroke", "grey")
	    .attr("stroke-dasharray", ("2,2"))

		vis.svg.selectAll("legend")
		.data(vis.radiusScale.ticks(4))
		.enter()
		.append("text")
	 	.style("color", "grey")
	    .attr("class", "text-muted")
 	    .attr("x", vis.width-100)
	    .attr("y", (d) => (vis.height-200) - vis.radiusScale(d) )
	    .text( (d) => numbersWithCommas(d) )
	    .attr("font-size", "0.5rem");
	}
}

