import React from "react";
import KenyaSummary from "./KenyaSummary";

export default () => (
	<div className="container-fluid">
		<KenyaSummary />
		<div className="row">
			<div className="col-md-8 col-12" id="kenya-map-container">
				<div id="kenya-map">
					<h3>Confirmed Cases per County</h3>
					<small id="kenya-last"></small>
					<div id="active-county" className="text-left">
						<h4 id="county-name"></h4>
						<span id="county-cases"></span>
						<small id="county-confirmed"> confirmed</small>
					</div>
				</div>
			</div>
			<div className="col-md-4 col-12" id="kenya-details-container">
				<div id="kenya-details">
					<h3></h3>
					<div id="kenya-details-table">
						<div className="county-row">
							<div className="county-name text-muted">COUNTY NAME</div>
							<div className="county-today text-muted">CASES TODAY</div>
							<div className="county-total text-muted">CASES TOTAL</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
);