import React from "react";

export default () => (
	<div className="container-fluid">
		<div className="row" id="kenya">
			<div className="col-12">
				<div id="kenya-heading">
					<h2>Kenya</h2>
					<small></small>
				</div>
			</div>
		</div>
		<div className="row">
			<div className="col-md-3 col-12">
				<div id="kenya-confirmed">
					<h4>Confirmed</h4>
					<div className="kenya-change">
						<small></small>
					</div>
					<div className="kenya-value lead">
					</div>
				</div>
			</div>
			<div className="col-md-3 col-12">
				<div id="kenya-active">
					<h4>Active</h4>
					<div className="kenya-change">
						<small></small>
					</div>
					<div className="kenya-value lead">
					</div>
				</div>
			</div>
			<div className="col-md-3 col-12">
				<div id="kenya-recovered">
					<h4>Recovered</h4>
					<div className="kenya-change">
						<small></small>
					</div>
					<div className="kenya-value lead">
					</div>
				</div>
			</div>
			<div className="col-md-3 col-12">
				<div id="kenya-deceased">
					<h4>Deceased</h4>
					<div className="kenya-change">
						<small></small>
					</div>
					<div className="kenya-value lead">
					</div>
				</div>
			</div>
		</div>
		<div className="row">
			<div className="col-md-8 col-12" id="kenya-map-container">
				<div id="kenya-map">
					<h3>Confirmed Cases per County</h3>
					<small id="kenya-last"></small>
					<div id="active-county" className="text-left">
						<h4 id="county-name"></h4>
						<span id="county-cases"></span>
						<small id="county-confirmed">confirmed</small>
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