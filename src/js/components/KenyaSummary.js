import React from "react";
import {numbersWithCommas, addSign, formatForDisplay_2} from "../visualizations/formating";

export default class KenyaSummary extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			today: {},
			yesterday: {}
		}
	}

	componentDidMount(){
		fetch("/data/timeseries.json").then(response => {
			return(response.json());
		}).then( data => {
			this.setState( () => ({
				today: data.Kenya[data.Kenya.length - 1],
				yesterday: data.Kenya[data.Kenya.length - 2]
			})
			);
		});
	}

	render(){
		return(
			<div className="container-fluid">
				<div className="row" id="kenya">
					<div className="col-12">
						<div id="kenya-heading">
							<h2>Kenya</h2>
							<small>{
								"Last update: " + formatForDisplay_2(this.state.today.date)
							}</small>
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col-md-3 col-12">
						<div id="kenya-confirmed">
							<h4>Confirmed</h4>
							<div className="kenya-change">
								<small>{
									numbersWithCommas(addSign(this.state.today.confirmed - this.state.yesterday.confirmed))
								}
								</small>
							</div>
							<div className="kenya-value lead">
							{numbersWithCommas(this.state.today.confirmed)}
							</div>
						</div>
					</div>
					<div className="col-md-3 col-12">
						<div id="kenya-active">
							<h4>Active</h4>
							<div className="kenya-change">
								<small>{
									numbersWithCommas(addSign((this.state.today.confirmed - this.state.today.recovered - this.state.today.deaths) - (this.state.yesterday.confirmed - this.state.yesterday.recovered - this.state.yesterday.deaths)))
								}</small>
							</div>
							<div className="kenya-value lead">
							{numbersWithCommas(this.state.today.confirmed - this.state.today.recovered - this.state.today.deaths)}
							</div>
						</div>
					</div>
					<div className="col-md-3 col-12">
						<div id="kenya-recovered">
							<h4>Recovered</h4>
							<div className="kenya-change">
								<small>{
									numbersWithCommas(addSign(this.state.today.recovered - this.state.yesterday.recovered))
								}
								</small>
							</div>
							<div className="kenya-value lead">
							{numbersWithCommas(this.state.today.recovered)}
							</div>
						</div>
					</div>
					<div className="col-md-3 col-12">
						<div id="kenya-deceased">
							<h4>Deceased</h4>
							<div className="kenya-change">
								<small>{
									numbersWithCommas(addSign(this.state.today.deaths - this.state.yesterday.deaths))
								}</small>
							</div>
							<div className="kenya-value lead">
							{numbersWithCommas(this.state.today.deaths)}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}