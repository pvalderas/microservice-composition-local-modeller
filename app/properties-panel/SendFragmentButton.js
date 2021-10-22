import React, { Component } from 'react';
import LocalFragmentManager from '../local-management/LocalFragmentManager';

export default class SendFragmentButton extends Component {

	constructor(props) {
		super(props);

		this.sendFragment = this.sendFragment.bind(this);
		this.localFragmentManager=new LocalFragmentManager(this.props.modeler,this.props.url);
	}

	showModifications(modifications){
		var changes="";
		modifications.forEach(action => {
			switch(action.command){
				case "elements.delete": 	action.context.elements.forEach(element => {
												changes+="<li>Delete "+element.id+"</li>";
											});
											break;
				case "shape.delete": 		changes+="<li>Delete "+action.context.shape.id+"</li>";
									 		break;
				case "connection.delete": 	changes+="<li>Delete "+action.context.connection.id+"</li>";
									 		break;
				case "shape.create":
				case "shape.append": 		changes+="<li>Create "+action.context.shape.id+"</li>";
									  		break;
				case "connection.create": 	changes+="<li>Create "+action.context.connection.id+"</li>";
									  		break;
			}
		});

		const message= 	"<div>"+
							"<p style='text-align: justify'>Changes in the BPMN Fragment affect coordination requirements of the composition. An acceptance of other participants is required.</p>"+
							"<p >You have:</p>"+
							"<ul className='list-group'>"+changes+"</ul>"+
							"<p >These modifications are marked as dirty until acceptance is received.</p>"+
						"</div>";

		showMessage("Changes need syncronization",message);
           
	}

	
	sendFragment(){

		if(this.localFragmentManager.checkBPMN()){
			if(this.localFragmentManager.checkRequirementsModifications()){
				this.localFragmentManager.saveLocalFragment();
			}
			else {
				var modifications= this.localFragmentManager.saveAsDirty();
				this.showModifications(modifications);
			}
				
		}
	}

	render() {
  		return(
  			<button onClick={this.sendFragment} className="btn btn-primary">SEND</button>
  		);
	}

 }