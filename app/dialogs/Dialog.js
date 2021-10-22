import React, { Component } from 'react';

export default class Dialog extends React.Component {

  constructor(props) {
    super(props);
  }

  modalDialogWithOK(id, title, content){
  	return (
  		<div className="modal" tabIndex="-1" role="dialog" id={id}>
		    <div className="modal-dialog" role="document">
		      <div className="modal-content">
		        <div className="modal-header">
		          <h5 className="modal-title title">{title}</h5>
		          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
		            <span aria-hidden="true">&times;</span>
		          </button>
		        </div>
		        <div className="modal-body content" >
		            {content}
		        </div>
		       <div className="modal-footer">
		        <button type="button" className="btn btn-primary" data-dismiss="modal">OK</button>
		      </div>
		      </div>
		    </div>
	 	</div>
  	);
  }

  modalDialog(id, title, content){
  	return (
  		<div className="modal" tabIndex="-1" role="dialog" id={id}>
		    <div className="modal-dialog" role="document">
		      <div className="modal-content">
		        <div className="modal-header">
		          <h5 className="modal-title title">{title}</h5>
		          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
		            <span aria-hidden="true">&times;</span>
		          </button>
		        </div>
		        <div className="modal-body content">
		            {content}
		        </div>
		      </div>
		    </div>
	 	</div>
  	);
  }

  operationListDialog(id, title, content){
  	return(
  		<div id={id} className="microservices-dialog">
	      <div className="loader_container" id="operations-loader">
	          <div className="lds-hourglass"></div>
	      </div>
	      <h3 className="microservice-name">{title}</h3>
	      {content}
	  </div>
  	)
  }

  render(){

  	switch(this.props.type){
  		case "modal": return this.modalDialog(this.props.id, this.props.title, this.props.content);
  		case "modalWithOK": return this.modalDialogWithOK(this.props.id, this.props.title, this.props.content);
  		case "operationList": return this.operationListDialog(this.props.id, this.props.title, this.props.content);
  	}

  }
}