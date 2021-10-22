import React, { Component } from 'react';
import MenuOption from './MenuOption.js';

export default class Menu extends React.Component {

  constructor(props) {
    super(props);
  }

  loadFragment(composition){
	jQuery.ajax({
			url:url+"/fragmentbpmn/"+composition,
			method:"GET",
			dataType:"text",
			success: function(fragment){
				this.props.modeler.importXML(fragment);
				sessionStorage.setItem("composition",composition);
				$("#fragments-dialog").modal('hide');
			},
			error:function(jx, status, error){
				showMessage("Error",error);
			}
		});
  }

  zoomin(modeler){
	modeler.get('canvas').zoom(this.props.modeler.get('canvas').zoom()+0.1);
  }

  zoomout(modeler){
	modeler.get('canvas').zoom(this.props.modeler.get('canvas').zoom()-0.1);
  }

  showFragmentsDialog(){
		$("#fragmentDialog").modal();
  }

  render() {

	const subOptions = [{id:"loadFragment",label:"Load Fragment",click:this.showFragmentsDialog}];

	return(
		<div  id="navbarSupportedContent">
			<ul className="navbar-nav mr-auto">
			  <MenuOption label="File" id="file" items={subOptions}/>
			  <MenuOption label="+" id="zoominoption" click={this.zoomin.bind(this, this.props.modeler)}/>
			  <MenuOption label="-" id="zoomoutoption" click={this.zoomout.bind(this,this.props.modeler)}/>
			</ul>
		</div>
	);

  }

}