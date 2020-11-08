import React from "react";

export default class BarOptions extends React.Component{
	constructor(props){
		super(props);
	}

	render(){
		return(
			<div className="row">
				<div className="col-md-8 offset-md-2 col-sm-12">
					<div className="row">
						<div className="col-md-6 col-sm-12">
							<select id="var-select" className="form-control" label="variable-select">
								<option selected value="new_cases">New Cases</option>
								<option value="new_deaths">New Deaths</option>
								<option value="new_tests">New Tests</option>
								<option value="total_cases">Total Cases</option>
								<option value="total_deaths">Total Deaths</option>
								<option value="total_tests">Total Tests</option>
							</select>
						</div>
						<div className="col-md-6 col-sm-12">
							<select id="country-select" className="form-control" label="country-select">
							</select>
						</div>
					</div>
				</div>
			</div>
		);
	}
}