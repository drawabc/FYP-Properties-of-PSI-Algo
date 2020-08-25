import React, { Component } from "react";
import Plotly from "plotly.js-gl3d-dist";
import "./Graph.scss";

import createPlotlyComponent from "react-plotly.js/factory";
const Plot = createPlotlyComponent(Plotly);

class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = { x: 2, y: 2, z: 2 };
  }

  handleCheck(axes, event) {
    const a = event.target.checked;
    let oldstate = this.state;
    if (a) {
      oldstate[axes] = 0;
    } else {
      oldstate[axes] = 2;
    }
    this.setState(oldstate);
  }
  render() {
    console.log(this.state);
    const val = this.props.data;
    const x = Object.keys(val).map(key => val[key][1]);
    const y = Object.keys(val).map(key => val[key][2]);
    const z = Object.keys(val).map(key => val[key][3]);
    const label = Object.keys(val).map(key => key);
    const color = Object.keys(val).map(key => {
      const fnx = key.match(/(\d+)/);
      if (key[0] == "N") {
        var vax = (1 - fnx[0] / 20) * 60 + 20;
        return "hsl(0, 100%, " + vax + "%)";
      }
      if (key[0] == "W") {
        var vax = (1 - fnx[0] / 20) * 60 + 15;
        return "hsl(120, 100%, " + vax + "%)";
      }
      if (key[0] == "P") {
        var vax = (1 - fnx[0] / 20) * 60 + 20;
        return "hsl(30, 100%, " + vax + "%)";
      }
      if (key[0] == "A") {
        var vax = (1 - fnx[0] / 20) * 60 + 20;
        return "hsl(240, 100%, " + vax + "%)";
      }
      if (key[0] == "H") {
        var vax = (1 - fnx[0] / 20) * 60 + 20;
        return "hsl(300, 100%, " + vax + "%)";
      }
    });
    return (
      <div>
        <div className="plotDiv">
          <Plot
            className="plot"
            data={[
              {
                x: x,
                y: y,
                z: z,
                text: label,
                type: "scatter3d",
                mode: "markers",
                marker: { color: color, size: 5 }
              }
            ]}
            layout={{
              title: "Phase Shifting Interferometry Error Analysis",
              scene: {
                xaxis: {
                  title: "AWGN(rad)",
                  zeroline: true,
                  nticks: 7,
                  exponentformat: "e",
                  range: [0, Math.max(...x) * 1.1]
                },
                yaxis: {
                  title: "Harmonics(rad)",
                  nticks: 7,
                  zeroline: true,
                  exponentformat: "e",
                  range: [0, Math.max(...y) * 1.1]
                },
                zaxis: {
                  title: "Miscalibration(rad)",
                  nticks: 7,
                  zeroline: true,
                  exponentformat: "e",
                  range: [0, Math.max(...z) * 1.1]
                }
              }
            }}
            config={{ responsive: true }}
          />
        </div>
      </div>
    );
  }
}

export default Graph;
