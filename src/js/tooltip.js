// Tooltip 
import * as d3 from "d3";

const toolTip = d3.select("body").append("div").attr("id", "tooltip")
				.style("background-color", "rgb(139, 166, 106)")
				.style("visibility", "hidden");

export default toolTip;