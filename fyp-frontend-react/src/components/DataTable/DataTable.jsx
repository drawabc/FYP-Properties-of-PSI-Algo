import React, { Component } from "react";
import { MDBDataTable, MDBContainer } from "mdbreact";
import Details from "../Details/Details";
import MUIDataTable from "mui-datatables";
class DataTable extends Component {
  constructor(props) {
    super(props);
    this.state = { modal: false, chosen: "N3", formula: "" };
    this.handleFn = this.handleFn.bind(this);
  }

  handleFn(algotype, fn) {
    let oldstate = this.state;
    if (algotype === "N") {
      oldstate.chosen = "N" + fn.toString();
    } else if (algotype === "W") {
      oldstate.chosen = "WDFT" + fn.toString();
    } else if (algotype === "P") {
      oldstate.chosen = "PO" + fn.toString();
    } else if (algotype === "A") {
      oldstate.chosen = "AVG" + fn.toString();
    } else if (algotype === "H") {
      oldstate.chosen = "H" + fn.toString();
    }
    this.setState(oldstate);
  }

  handleClick = key => {
    this.setState({ modal: true, chosen: key });
    window.location.href = "#Details";
  };
  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };
  columns = [
    {
      label: "Algo",
      name: "algo",
      options: {
        filter: true,
        sort: true
      }
    },
    {
      label: "Frame Number",
      name: "fn",
      options: {
        filter: true,
        sort: true
      }
    },
    {
      label: "AWGN(rad)",
      name: "awgn",
      options: {
        filter: false,
        sort: true,
        searchable: false
      }
    },
    {
      label: "Harmonic(rad)",
      name: "harmonic",
      options: {
        filter: false,
        sort: true,
        searchable: false
      }
    },
    {
      label: "PSMC(rad)",
      name: "psmc",
      options: {
        filter: false,
        sort: true,
        searchable: false
      }
    },
    {
      label: "Total",
      name: "total",
      options: {
        filter: false,
        sort: true,
        searchable: false
      }
    }
  ];
  render() {
    const realData = Object.keys(this.props.data).map(key => {
      const x = {
        algo: key,
        fn: this.props.data[key][0],
        awgn: Number(this.props.data[key][1]).toFixed(3),
        harmonic: Number(this.props.data[key][2]).toFixed(3),
        psmc: Number(this.props.data[key][3]).toFixed(3),
        total: Number(this.props.data[key][4]).toFixed(3)
      };
      return x;
    });
    return (
      <MDBContainer>
        <div className="row">
          <div className="col-12">
            <MUIDataTable
              columns={this.columns}
              data={realData}
              options={{
                responsive: "scroll",
                selectableRows: false,
                onRowClick: rowData => this.handleClick(rowData[0])
              }}
            ></MUIDataTable>
          </div>
        </div>

        {/*
        <InfoModal
          toggle={this.toggle}
          modal={this.state.modal}
          formula={this.state.formula}
          chosen={this.state.chosen}
        ></InfoModal>
        */}
        <div className="row">&nbsp;</div>
        <div className="row">
          <div className="col-12">
            <section id="Details">
              <Details
                handleFn={this.handleFn}
                chosen={this.state.chosen}
              ></Details>
            </section>
          </div>
        </div>
      </MDBContainer>
    );
  }
}

export default DataTable;
