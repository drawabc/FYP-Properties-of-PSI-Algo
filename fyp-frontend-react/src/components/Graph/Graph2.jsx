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
                marker: { color: "red", size: 8 }
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
                },
                camera: {
                  center: { x: 0, y: 0, z: 0 },
                  eye: { x: this.state.x, y: this.state.y, z: this.state.z },
                  up: { x: 1, y: 0, z: 0 }
                }
              }
            }}
            config={{ responsive: true }}
          />
        </div>
        <div className="form check">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="x"
              name="x"
              onChange={e => this.handleCheck("x", e)}
            ></input>
            <label className="form-check-label" htmlFor="x">
              AWGN
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="y"
              name="y"
              onChange={e => this.handleCheck("y", e)}
            ></input>
            <label className="form-check-label" htmlFor="y">
              Harmonics
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="z"
              name="z"
              onChange={e => this.handleCheck("z", e)}
            ></input>
            <label className="form-check-label" htmlFor="z">
              PSMC
            </label>
          </div>
        </div>
      </div>
    );
  }
}

export default Graph;
