import React, { Component } from "react";
import "./Details.scss";
import Latex from "../Latex/Latex";

class Details extends Component {
  constructor(props) {
    super(props);
    this.state = { data: {}, algotype: "N", formula: "", fn: 3 };
    this.handleAlgoType = this.handleAlgoType.bind(this);
    this.changeFn = this.changeFn.bind(this);
  }
  componentDidMount() {
    fetch("http://localhost:8000/api-view/render", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ algo: this.props.chosen })
    })
      .then(response => response.json())
      .then(dat => this.setState({ formula: dat.message }));
  }
  componentDidUpdate(prevProps) {
    if (prevProps.chosen !== this.props.chosen) {
      fetch("http://localhost:8000/api-view/render", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ algo: this.props.chosen })
      })
        .then(response => response.json())
        .then(dat => this.setState({ formula: dat.message }));
      let oldstate = this.state;
      oldstate.algotype = this.props.chosen[0];
      const fnx = this.props.chosen.match(/(\d+)/);
      oldstate.fn = fnx[0];
      this.setState(oldstate);
    }
  }
  handleAlgoType(event) {
    const val = event.target.value;
    let fn = 0;
    if (val === "N") fn = 3;
    else if (val === "W") fn = 5;
    else if (val === "P") fn = 4;
    else if (val === "H") fn = 5;
    else if (val === "A") fn = 5;
    let oldstate = this.state;
    oldstate.algotype = val;
    oldstate.fn = fn;
    this.setState(oldstate);
    this.props.handleFn(this.state.algotype, fn);
  }
  changeFn(event) {
    const fn = event.target.value;
    let oldstate = this.state;
    oldstate.fn = fn;
    this.setState(oldstate);
    this.props.handleFn(this.state.algotype, fn);
  }

  render() {
    return (
      <div className="jumbotron jumbotron-fluid">
        <label className="h3">Details</label>
        <form className="form form-details">
          <div className="form-group form-group-details">
            <label htmlFor="algotype">Algorithm Type</label>
            <select
              className="custom-select"
              id="algotype"
              name="algotype"
              onChange={this.handleAlgoType}
              value={this.state.algotype}
            >
              <option value="N">N-bucket</option>
              <option value="W">WDFT</option>
              <option value="P">N+1 Type A</option>
              <option value="A">Averaging N+1</option>
              <option value="H">Hibino N+3</option>
            </select>
          </div>
          <div className="form-group form-group-details">
            <label htmlFor="fn">Frame Number</label>
            <input
              type="number"
              className="form-control"
              id="fn"
              name="fn"
              value={this.state.fn}
              onChange={this.changeFn}
            ></input>
          </div>
        </form>
        <label className="h5">Formula</label>
        <div className="latex">
          <div>
            <Latex>{this.state.formula[0]}</Latex>
          </div>
          <div>
            <Latex>{this.state.formula[1]}</Latex>
          </div>
        </div>
      </div>
    );
  }
}

export default Details;
