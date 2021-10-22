import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import Dialog from './Dialog.js';
import './OperationDialog.css';

export default class OperationDialog extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      operations: [],
      error:null,
      type:"operationList",
      title:"Microservice Operations",
      id:"operationDialog"
    };
  }

  componentWillMount() {
    fetch(this.props.url+"/operations")
      .then(function (response) {
        return response.json()
      })
      .then(ops => {
        this.setState({ operations: ops })
      })
      .catch(error => {
          this.setState({error:error});
        }
      )    
  }


  addOperation(name, url, method){
    const modeler=this.props.modeler;

    var element=document.querySelector('#propertyValue');
    element.value=name;

    var selectedElement = modeler.get('selection').get()[0];

    const modeling = modeler.get('modeling');
    modeling.updateLabel(selectedElement, name);

    if(url!=undefined && method!=undefined){
        var camundaNs = 'http://camunda.org/schema/1.0/bpmn';

        const moddle= modeler.get('moddle');
        var extensionElements = moddle.create('bpmn:ExtensionElements');

        var field1=moddle.createAny('camunda:field',camundaNs, {name:"url", stringValue:url});
        var field2=moddle.createAny('camunda:field',camundaNs, {name:"method", stringValue:method});

        extensionElements.get('values').push(field1);
        extensionElements.get('values').push(field2);
       
        modeling.updateProperties(selectedElement, {'extensionElements':extensionElements});
    }
    
    $("#"+this.state.id).css("display","none");
  }

  render(){
  		var content;
  		if(this.state.error==null) {
	  		const operations = this.state.operations.map(operation => 
	  			<li key={operation.ID} className="list-group-item"><a href="#" onClick={this.addOperation.bind(this,operation.ID,operation.URL,operation.METHOD)}>{operation.ID}</a></li>
	  		);
	  		content=<ul className="list-group">{operations}</ul>;
  		}else{
  			content=this.state.error;
  		}
  		return (
  			<Dialog type={this.state.type} title={this.state.title} id={this.state.id} content={content} />
  		);
  }

}