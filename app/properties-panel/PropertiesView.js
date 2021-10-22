import { is } from 'bpmn-js/lib/util/ModelUtil';

import React, { Component } from 'react';

import './PropertiesView.css';

var jQuery = require("jquery");

export default class PropertiesView extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedElements: [],
      element: null
    };
  }

  componentDidMount() {

    const {
      modeler
    } = this.props;

    modeler.on('selection.changed', (e) => {

      const {
        element
      } = this.state;

      this.setState({
        selectedElements: e.newSelection,
        element: e.newSelection[0]
      });

      if(e.newSelection.length!=1){
        var dialog=document.querySelector('#operationDialog');
        dialog.style.display = "none";
      }
    });


    modeler.on('element.changed', (e) => {

      const {
        element
      } = e;

      const {
        element: currentElement
      } = this.state;

      if (!currentElement) {
        return;
      }

      // update panel, if currently selected element changed
      if (element.id === currentElement.id) {
        this.setState({
          element
        });
      }

    });
  }

  render() {

    const {
      modeler
    } = this.props;

    const {
      selectedElements,
      element
    } = this.state;

    return (
      <div>

        {
          selectedElements.length === 1
            && <ElementProperties modeler={ modeler } element={ element } />
        }

        {
          selectedElements.length === 0
            && <span>Please select a service task.</span> 
        }

        {
          selectedElements.length > 1
            && <span>Please select a single service task.</span>
        }
      </div>
    );
  }

}


function ElementProperties(props) {

  let {
    element,
    modeler
  } = props;

  if (element.labelTarget) {
    element = element.labelTarget;
  }

  function updateName(name) {
    const modeling = modeler.get('modeling');

    modeling.updateLabel(element, name);
  }


  function showOperationDialog(){
        var dialog=document.querySelector('#operationDialog');
        dialog.style.display = "block";
  };


  return (
    <div className="element-properties" key={ element.id }>

      {
        is(element, 'bpmn:ServiceTask') &&
           <form className="form-inline">
            <label className="col-sm-2 col-form-label">Microservice Operation</label>
            <input id="propertyValue" className="form-control col-sm-3" value={ element.businessObject.get('name') || ''} onChange={ (event) => {
              updateOperation(event.target.value)
            } } />
             <button className="btn btn-primary col-sm-2" onClick={ showOperationDialog } >Select</button>
          </form>
      }
      {
        !is(element, 'bpmn:ServiceTask') && 
            <span>Please select a service task.</span>

      }


    </div>
  );
}


// helpers ///////////////////

function hasDefinition(event, definitionType) {

  const definitions = event.businessObject.eventDefinitions || [];

  return definitions.some(d => is(d, definitionType));
}