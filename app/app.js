//var url = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
var url="http://localhost:8081";

/*var camundaExtensionModule = require('camunda-bpmn-moddle/lib');
var camundaModdle = require('camunda-bpmn-moddle/resources/camunda');*/

import ReactDOM from 'react-dom';
import React from 'react';

import Modeler from 'bpmn-js/lib/Modeler';
import CustomLaneActions from "./custom-actions/CustomLaneActions";

import PropertiesPanel from './properties-panel';
import Menu from './menu';
import FragmentDialog from './dialogs/FragmentDialog.js';
import OperationDialog from './dialogs/OperationDialog.js';
import MessageDialog from './dialogs/Dialog.js';
import SendFragmentButton from './properties-panel/SendFragmentButton.js';

const $modelerContainer = document.querySelector('#modeler-container');
const $propertiesContainer = document.querySelector('#properties-container');
const $menuContainer = document.querySelector('#menu-container');
const $fragmentDialogContainer = document.querySelector('#fragment-dialog-container');
const $operationDialogContainer = document.querySelector('#operation-dialog-container');
const $messageDialogContainer = document.querySelector('#message-dialog-container');
const $sendFragmentButtonContainer = document.querySelector('#send-button-container');



//***************************************
// GETTING MICROSERVICE NAME
//***************************************
fetch(url+"/microservicename")
	.then(function (response) {
		return response.text()
	})
	.then(name => {
		sessionStorage.setItem("microservicename", name);
	})
	.catch(error => {
	 	console.log(error);
	}
)    
//***************************************



//***************************************
// CREATTING THE MODELLER
//***************************************
const modeler = new Modeler({
  container: $modelerContainer,
  additionalModules: [
      CustomLaneActions
    ],
  keyboard: {
    bindTo: document.body
  }
});

//Cancel double click from the microservice and the event bus pools to avoid editing their names
var priority = 10000;
modeler.on('element.dblclick', priority, function(event) {
  	var e = event.element;
  	if(e.businessObject.$instanceOf("bpmn:Participant") && (e.businessObject.name!=null) &&
			(e.businessObject.name=="EVENT BUS" || 
			e.businessObject.name.toLowerCase()==sessionStorage.getItem("microservicename").toLowerCase())) return false;
});
//***************************************



//***************************************
// ADDING THE PROPERTY PANEL AND THE SEND BUTTON
//***************************************
const propertiesPanel = new PropertiesPanel({
  container: $propertiesContainer,
  modeler
});

ReactDOM.render(
  <SendFragmentButton url={url} modeler={modeler}/>,
  $sendFragmentButtonContainer
);
//***************************************



//***************************************
// ADDING THE TOP MENU
//***************************************
const menu = new Menu({
  container: $menuContainer,
  modeler
});
//***************************************



//***************************************
// CREATING DIALOGS
//***************************************
ReactDOM.render(
  <FragmentDialog url={url} modeler={modeler}/>,
  $fragmentDialogContainer
);

ReactDOM.render(
  <OperationDialog url={url} modeler={modeler}/>,
  $operationDialogContainer
);

ReactDOM.render(
  <MessageDialog type="modalWithOK"  id="messageDialog" content="" title="" url={url} modeler={modeler}/>,
  $messageDialogContainer
);
//***************************************
