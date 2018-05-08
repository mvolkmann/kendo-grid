import React, {Component} from 'react';
import {Grid, GridColumn} from '@progress/kendo-react-grid';
import Renderers from './renderers';
import '@progress/kendo-theme-default/dist/all.css';

const data = [{name: 'Mark', age: 57}, {name: 'Tami', age: 56}];

class App extends Component {
  state = {
    changes: false,
    data,
    editItem: undefined
  };

  constructor(props: PropsType) {
    super(props);
    this.renderers = new Renderers(this.enterEdit, this.exitEdit, 'inEdit');
  }

  cancelChanges = () => this.setState({changes: false, data});

  editableField = field => ({
    editable: this.state.editField === field,
    field
  });

  enterEdit = (dataItem, field) => {
    // If already editing this field, do nothing.
    if (dataItem.inEdit && field === this.state.editField) return;

    this.exitEdit();
    dataItem.inEdit = field;
    this.setState({
      data: this.state.data,
      editField: field
    });
  };

  exitEdit = () => {
    this.state.data.forEach(d => (d.inEdit = undefined));
    this.setState({
      data: this.state.data,
      editField: undefined
    });
  };

  itemChange = event => {
    const {dataItem, field, value} = event;
    dataItem[field] = value;
    this.setState({changes: true});
  };

  render() {
    return (
      <div className="App">
        <Grid
          cellRender={this.renderers.cellRender}
          data={this.state.data}
          editField="inEdit"
          itemChange={this.itemChange}
          rowRender={this.renderers.rowRender}
        >
          <GridColumn
            editable={false}
            field="name"
            title="Name"
            width="200px"
            {...this.editableField('name')}
          />
          <GridColumn
            editor="numeric"
            field="age"
            title="Age"
            width="100px"
            {...this.editableField('age')}
          />
        </Grid>
      </div>
    );
  }
}

export default App;
