// This code was copied from
// https://www.telerik.com/kendo-react-ui/components/
// grid/editing/editing-in-cell/.

import React from 'react';

export default class Renderers {
  constructor(enterEdit, exitEdit, editFieldName) {
    this.enterEdit = enterEdit;
    this.exitEdit = exitEdit;
    this.editFieldName = editFieldName;
  }

  cellRender = (tdElement, cellProps) => {
    const {dataItem, field} = cellProps;
    const value = dataItem[this.editFieldName];
    const useRef = value && value === field;
    const additionalProps = useRef
      ? {
          ref: td => {
            const input = td && td.querySelector('input');
            if (!input || input === document.activeElement) return;

            if (input.type === 'checkbox') {
              input.focus();
            } else {
              input.select();
            }
          }
        }
      : {
          onClick: () => {
            this.enterEdit(dataItem, field);
          }
        };

    return React.cloneElement(
      tdElement,
      {...tdElement.props, ...additionalProps},
      tdElement.props.children
    );
  };

  rowRender = trElement => {
    const trProps = {
      ...trElement.props,
      onBlur: () => {
        clearTimeout(this.blurTimeout);
        if (!this.preventExit) {
          this.blurTimeout = setTimeout(() => this.exitEdit());
        }
      },
      onFocus: () => clearTimeout(this.blurTimeout),
      onMouseDown: () => {
        this.preventExit = true;
        clearTimeout(this.preventExitTimeout);
        this.preventExitTimeout = setTimeout(() => {
          this.preventExit = undefined;
        });
      }
    };

    return React.cloneElement(
      trElement,
      {...trProps},
      trElement.props.children
    );
  };
}
