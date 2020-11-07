import React from "react";

export default () => (
	<div className="container-fluid">
		<div className="row" id="explore">
			<div className="col-12">
				<div id="kenya-heading">
					<h2>Explore</h2>
				</div>
			</div>
		</div>
		<div className="row">
			<div className="col-12" id="time-series-parent">
				<div id="time-series">
					<div className="row">
						<div className="col-4">
							<input className="form-control" type="date" name="time-series-date" id="time-series-date-select" label="time-series-date"/>
						</div>
						<div className="col-4">
							<select className="form-control" name="time-series-continent" id="time-series-continent-select" label="time-series-continent">
								<option defaultValue="world" selected="selected">World</option>
							</select>
						</div>
						<div className="col-4">
							<select className="form-control" name="time-series-country" id="time-series-country-select" label="time-series-country">
								<option defaultValue="all" selected="selected">All</option>
							</select>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
);