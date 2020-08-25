import React, { Component } from "react";
import "./FormInput.scss";

class FormInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      awgn: 0,
      ih: [[0, 0]],
      psmc: [[0, 0]],
      threshold: 0,
      toggle: false
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(cat, index, event) {
    var target = event.target;
    var oldstate = this.state;
    if (cat === "awgn") {
      oldstate.awgn = Number(target.value);
    } else if (cat == "threshold") {
      oldstate.threshold = Number(target.value);
    } else if (cat == "toggle") {
      oldstate.toggle = !oldstate.toggle;
    } else {
      if (target.name === "order") {
        oldstate[cat][index][0] = Number(target.value);
      } else {
        oldstate[cat][index][1] = Number(target.value);
      }
    }
    this.setState(oldstate);
  }

  handleAddFields = cat => {
    const x = [0, 0];
    var oldstate = this.state;
    oldstate[cat].push(x);
    this.setState(oldstate);
  };

  handleRemoveFields = (cat, index) => {
    var oldstate = this.state;
    oldstate[cat].splice(index, 1);
    this.setState(oldstate);
  };
  render() {
    return (
      <form className="form">
        <div className="h1">Input Error</div>
        <div className="row">
          <div className="form-group col-9">
            <label className="h3" htmlFor="awgn">
              AWGN (%)
            </label>
            <input
              type="number"
              name="awgn"
              defaultValue={0}
              id="awgn"
              step="any"
              className="form-control"
              onChange={event => this.handleChange("awgn", 0, event)}
            ></input>
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            <div>
              <label className="h3">Harmonic (%)</label>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => this.handleAddFields("ih")}
              >
                Add Order
              </button>
            </div>
            {this.state.ih.map((obj, index) => (
              <div key={"ih" + index} className="row idxorder">
                <div className="col-5 txtbox">
                  <label>Order</label>
                  <input
                    key={"ih order" + index}
                    name="order"
                    id="order"
                    defaultValue={0}
                    onChange={event => this.handleChange("ih", index, event)}
                    type="number"
                    className="form-control"
                  ></input>
                </div>
                <div className="col-5 txtbox">
                  <label>Error</label>
                  <input
                    className="form-control"
                    key={"ih error" + index}
                    name="error"
                    id="error"
                    step="any"
                    defaultValue={0}
                    onChange={event => this.handleChange("ih", index, event)}
                    type="number"
                  ></input>
                </div>
                <div className="col-2 txtbox">
                  <div>&nbsp;</div>
                  <button
                    className="btn btn-danger"
                    type="button"
                    onClick={() => this.handleRemoveFields("ih", index)}
                  >
                    -
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="col-6">
            <div>
              <label className="h3">PSMC (%)</label>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => this.handleAddFields("psmc")}
              >
                Add Order
              </button>
            </div>
            {this.state.psmc.map((obj, index) => (
              <div key={"psmc" + index} className="row idxorder">
                <div className="col-5 txtbox">
                  <label>Order</label>
                  <input
                    key={"psmc order" + index}
                    name="order"
                    id="order"
                    defaultValue={0}
                    onChange={event => this.handleChange("psmc", index, event)}
                    type="number"
                    className="form-control"
                  ></input>
                </div>
                <div className="col-5 txtbox">
                  <label>Error</label>
                  <input
                    className="form-control"
                    key={"psmc error" + index}
                    name="error"
                    id="error"
                    defaultValue={0}
                    step="any"
                    onChange={event => this.handleChange("psmc", index, event)}
                    type="number"
                  ></input>
                </div>
                <div className="col-2 txtbox">
                  <div>&nbsp;</div>
                  <button
                    className="btn btn-danger"
                    type="button"
                    onClick={() => this.handleRemoveFields("psmc", index)}
                  >
                    -
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="row">
          <div
            className="form-group col-9"
            style={{
              paddingTop: 10,
              display: "flex",
              flexGrow: 1,
              flexBasis: 0
            }}
          >
            <input
              type="checkbox"
              name="toggle"
              id="toggle"
              defaultValue={0}
              onChange={event => this.handleChange("toggle", 0, event)}
            ></input>
            <label className="h4" htmlFor="threshold" style={{ flexShrink: 0 }}>
              &nbsp; Threshold (rad) &nbsp;
            </label>
            <input
              type="number"
              name="threshold"
              defaultValue={0}
              id="threshold"
              step="any"
              className="form-control"
              onChange={event => this.handleChange("threshold", 0, event)}
              disabled={!this.state.toggle}
            ></input>
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={event => this.props.handleSubmit(this.state, event)}
        >
          Submit
        </button>
      </form>
    );
  }
}

export default FormInput;
