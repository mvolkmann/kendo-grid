import React, {Component} from 'react';
import {Grid, GridColumn} from '@progress/kendo-react-grid';
import Renderers from './renderers';
import '@progress/kendo-theme-default/dist/all.css';

const PAGE_SIZE = 3;
const PAGEABLE = {
  buttonCount: 3,
  info: true,
  pageSizes: false,
  previousNext: true,
  type: 'input'
};

const data = [
  {name: 'Amanda', age: 32},
  {name: 'Jeremy', age: 31},
  {name: 'Mark', age: 57},
  {name: 'Meghan', age: 29},
  {name: 'RC', age: 36},
  {name: 'Tami', age: 56}
];

class App extends Component {
  state = {
    changes: false,
    data,
    editItem: undefined,
    pageData: data.slice(0, PAGE_SIZE),
    skip: 0
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

  onPageChange = event => {
    console.log('App.js onPageChange: entered');
    const {skip, take} = event;
    const {data} = this.state;
    const pageData = data.slice(skip, skip + take);
    this.setState({pageData, skip});
  };

  render() {
    const {data, pageData, skip} = this.state;
    return (
      <div className="App">
        <Grid
          cellRender={this.renderers.cellRender}
          data={pageData}
          editField="inEdit"
          itemChange={this.itemChange}
          onPageChange={this.onPageChange}
          pageable={PAGEABLE}
          pageSize={PAGE_SIZE}
          rowRender={this.renderers.rowRender}
          skip={skip}
          total={data.length}
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
