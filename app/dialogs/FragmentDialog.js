import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import Dialog from './Dialog.js';

export default class FragmentDialog extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      fragments: [],
      error:null,
      type:"modal",
      title:"Available fragments",
      id:"fragmentDialog"
    };
  }

  componentWillMount() {
    fetch(this.props.url+"/fragments")
      .then(function (response) {
        return response.json()
      })
      .then(frags => {
        this.setState({ fragments: frags })
      })
      .catch(error => {
          this.setState({error:error});
        }
      )    
  }

  loadFragment(composition){
  	fetch(this.props.url+"/fragmentbpmn/"+composition)
  	  .then(response => {
        return response.text()
      })
      .then(fragment => {
        this.props.modeler.importXML(fragment);
		sessionStorage.setItem("composition",composition);
		$("#"+this.state.id).modal("hide");
      });
        
  }

  render(){
  		var content;
  		if(this.state.error==null) {
	  		const fragments = this.state.fragments.map(fragment => 
	  			<a key={fragment.COMPOSITION} href="#" className="list-group-item list-group-item-action" onClick={this.loadFragment.bind(this,fragment.COMPOSITION)}>{fragment.COMPOSITION}</a>
	  		);
	  		content=<div className="list-group">{fragments}</div>;
  		}else{
  			content=this.state.error;
  		}
  		return (
  			<Dialog type={this.state.type} title={this.state.title} id={this.state.id} content={content} />
  		);
  }

}