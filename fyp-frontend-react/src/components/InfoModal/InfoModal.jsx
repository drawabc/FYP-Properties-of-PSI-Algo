import React, { Component } from "react";
import Latex from "../Latex/Latex";

import {
  MDBModal,
  MDBModalHeader,
  MDBModalFooter,
  MDBModalBody,
  MDBBtn
} from "mdbreact";
class InfoModal extends Component {
  constructor(props) {
    super(props);
    this.state = { formula: "" };
  }

  componentDidMount() {
    this.setState({ formula: "" });
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
    }
  }

  render() {
    return (
      <MDBModal
        isOpen={this.props.modal}
        toggle={this.props.toggle}
        fullHeight
        position="right"
      >
        <MDBModalHeader toggle={this.props.toggle}>
          {this.props.chosen}
        </MDBModalHeader>
        <MDBModalBody>
          <Latex>{this.state.formula}</Latex>
        </MDBModalBody>
        <MDBModalFooter>
          <MDBBtn color="secondary" onClick={this.props.toggle}>
            Close
          </MDBBtn>
        </MDBModalFooter>
      </MDBModal>
    );
  }
}

export default InfoModal;
