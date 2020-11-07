import React from "react";
import Smokers from "./Smokers";

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
				<Smokers />
			</div>
		</div>
);