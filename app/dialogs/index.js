import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import FragmentDialog from './FragmentDialog.js';

export default class DialogIndex {

  constructor(options) {

    const {
      url,
      modeler,
      container
    } = options;

    ReactDOM.render(
      <FragmentDialog url={url} modeler={modeler}/>,
      container
    );

  }

}