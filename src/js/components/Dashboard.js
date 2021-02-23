import React from "react";
import Navigation from "./Navigation";
import BarOptions from "./BarOptions";
import BarChart from "./BarChart";
import MoreInformation from "./MoreInformation";
import Explore from "./Explore";
import KenyaSummary from "./KenyaSummary";
// import Kenya from "./Kenya";

export default class Dashboard extends React.Component{
	render(){
		return(
			<div>
				<Navigation />
				<BarOptions />
				<BarChart />
				<MoreInformation />
				<Explore />
				<KenyaSummary />
			</div> 
		);
	}
};