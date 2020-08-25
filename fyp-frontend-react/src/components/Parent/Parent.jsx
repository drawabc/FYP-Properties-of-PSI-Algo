import React, { Component } from "react";
import FormInput from "../FormInput/FormInput";
import DataTable from "../DataTable/DataTable";
import { MDBContainer } from "mdbreact";
import Graph from "../Graph/Graph";
import "./Parent.scss";
import { extendDeepNoArrays } from "plotly.js-gl3d-dist";

class Parent extends Component {
  constructor(props) {
    super(props);
    this.state = { result: {} };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    fetch("http://localhost:8000/index", {
      method: "GET"
    })
      .then(response => response.json())
      .then(data => this.setState({ result: data.result }));
  }
  handleSubmit = (data, event) => {
    event.preventDefault();
    fetch("http://localhost:8000/index", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => this.setState({ result: data.result }));
    //console.log(this.state);
  };
  render() {
    const data = this.state.result;
    return (
      <MDBContainer>
        <u>
          <h1 className="h1">Phase Shifting Interferometry Error Analysis</h1>
        </u>
        <div className="row">
          <div className="col-3">
            <nav id="navbar2" className="navbar sticky-top navbar-light">
              <nav className="nav nav-pills flex-column">
                <a className="navbar-brand" href="#">
                  Menu
                </a>
                <a className="nav-link" href="#FormInput">
                  Input Error
                </a>
                <a className="nav-link" href="#Graph">
                  3D Graph
                </a>
                <a className="nav-link" href="#DataTable">
                  Table
                </a>
                <a className="nav-link" href="#Details">
                  Details
                </a>
              </nav>
            </nav>
          </div>
          <div className="col-9">
            <section id="FormInput">
              <FormInput handleSubmit={this.handleSubmit} />
            </section>
            <section id="Graph">
              <Graph data={data}></Graph>
            </section>

            <section id="DataTable">
              <DataTable data={data}></DataTable>
            </section>
          </div>
        </div>
        <div className="row">&nbsp;</div>
      </MDBContainer>
    );
  }
}

export default Parent;
