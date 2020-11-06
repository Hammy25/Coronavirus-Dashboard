import React from "react";

export default () => (
		<div className="container-fluid">
			<div className="row">
				<div className="col-12" id="more-info">
					<h2 id="more-info-heading">More Information</h2>
				</div>
			</div>
			<div className="row">
				<div className="col-md-6 col-sm-12">
					<div id="general-info">
						<h3 id="general-heading"></h3>
						<i className="fas fa-globe"> </i><p> Continent: <span id="continent" className="font-weight-bold"></span></p>
						<i className="material-icons">person</i><p> Population: <span id="population" className="font-weight-bold"></span></p>
						<i className="material-icons">person_add</i><p> Population Density: <span id="pop-den" className="font-weight-bold"></span></p>
						<i className="far fa-life-ring"></i><p> Life Expectancy: <span id="life" className="font-weight-bold"></span></p>
						<i className="material-icons">unfold_less</i><p> Median Age: <span id="median-age" className="font-weight-bold"></span></p>
						<i className="fas fa-walking"></i><p> 65 Older: <span id="older" className="font-weight-bold"></span></p>
						<i className="material-icons">directions_walk</i><p> 70 Older: <span id="oldest" className="font-weight-bold"></span></p>
						<i className="fas fa-money-bill-wave-alt"></i><p> GDP per Capita: <span id="gdp" className="font-weight-bold"></span></p>
						<i className="fas fa-hands-wash"></i><p> Handwashing Facilities Access: <span id="handwash" className="font-weight-bold"></span></p>
						<i className="fas fa-bed"></i><p> Hospital Beds per Thousand: <span id="beds" className="font-weight-bold"></span></p>
						<i className="far fa-money-bill-alt"></i><p> Extreme Poverty: <span id="poverty" className="font-weight-bold"></span></p>
						<i className="material-icons">people</i><p> Diabetes prevalence: <span id="diabetes" className="font-weight-bold"></span></p>
						<i className="fas fa-calendar-plus"></i><p> Cardiovascular Disease Death Rate: <span id="cvd" className="font-weight-bold"></span></p>
					</div>
				</div>
				<div className="col-md-6 col-sm-12" id="smokers-parent">
					<div id="smokers">
					</div>
					<div id="about-page">
						<h3 id="about-heading">About</h3>
						<p>The information presented on this page comes from data obtained by <a target="_blank" rel="noreferrer" href="https://ourworldindata.org/">ourworldindata.org</a> and other sources.</p>
						<p><a target="_blank" rel="noreferrer" href="https://ourworldindata.org/">Ourworldindata.org</a> collects data to aid in solving worldwide problems. Their goal is to make knowledge about universal issues accessible and comprehensible.</p>
						<p>Toggle the selectors on the top of the page to view information on Covid-19 per nation or the world as a whole.</p>
						<p>Sources of data: <a target="_blank" rel="noreferrer" href="https://github.com/owid">Ourworldindata (owid) Coronavirus GitHub repo</a> and <a target="_blank" rel="noreferrer" href="https://github.com/pomber/covid19"> pomber/covid19 GitHub repo</a>.</p>
						<p>I personally scrapped and collected Kenyan counties' data.</p>
						<p>More information on the data: <a target="_blank" rel="noreferrer" href="https://github.com/owid/covid-19-data">more info here</a> and <a target="_blank" href="https://github.com/pomber/covid19" rel="noreferrer">more info here</a>.</p>
						<p>Code used to develop this dashboard is open source: <a target="_blank" rel="noreferrer" href="https://github.com/Hammy25/Coronavirus-Dashboard">View code</a>.</p>
						<p>This work is licensed under the <a target="_blank" rel="noreferrer" href="https://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International License</a>.</p>
					</div>
				</div>
			</div>
		</div>
);