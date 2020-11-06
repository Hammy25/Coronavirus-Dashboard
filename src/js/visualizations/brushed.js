// Handle brushes - setting boundaries on the context graph.

import * as d3 from "d3";
import {barChart, timeline} from "./drawing";

export default () => {
      const selection = d3.event.selection || timeline.x.range();
      const newValues = selection.map(timeline.x.invert)
      barChart.wrangleData(newValues);
};