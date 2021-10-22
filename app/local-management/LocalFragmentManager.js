export default class LocalFragmentManager{

	constructor(modeler, url) {
		this.modeler=modeler;
		this.url=url;
		this.coordChanges=[];

		this.saveLocalFragment=this.saveLocalFragment.bind(this);
		this.synchronizeFragmentWithBigPicture=this.synchronizeFragmentWithBigPicture.bind(this);
	}

	applyCoordinationChanges(){
		const commandStack = this.modeler.get('commandStack');

		while(this.coordChanges.length>0) {
			var action = this.state.coordChanges.shift();
			if(action.command!="connection.delete" && action.command!="shape.delete"){
			  	commandStack.execute(action.command, action.context);
			} 
		}
	}

	checkRequirementsModifications(){
		const commandStack = this.modeler.get('commandStack');

		var coordReqModified=false;
		commandStack._stack.forEach(action => {
			if(action.command=="elements.delete"){
				action.context.elements.every(element => {
					var coordinationReq=["bpmn:IntermediateCatchEvent","bpmn:IntermediateThrowEvent"];
					if(coordinationReq.includes(element.businessObject.$type)){
						coordReqModified=true;
						return false; // Exit from every loop
					}
					return true; // Continue the every loop
				})
			}
		});

		if(coordReqModified){
			commandStack._stack.forEach(action => {
					commandStack.undo(action);
			});
		}

		return !coordReqModified;
	}

	drawInColor(element, color){
		this.modeler.get('modeling').setColor(element, {
	      	stroke: color
	    });
	}

	saveAsDirty(){
		const commandStack = this.modeler.get('commandStack');
		const elementRegistry = this.modeler.get('elementRegistry');

		//Extraction of all the action of the commandStack. 
		//All of them have been previosly undo
		while(commandStack._stack.length>0) {
			this.coordChanges.push(commandStack._stack.shift());
		}


		this.coordChanges.forEach(action => {
			switch(action.command){
				case "elements.delete": action.context.elements.forEach(element => {
											//elementRegistry.get(element.businessObject.id);
											this.drawInColor(element,"#FF0000");
										});
										break;
				case "shape.delete": 	this.drawInColor(action.context.shape, "#FF0000");
									 	break;
				case "connection.delete": 	this.drawInColor(action.context.connection, "#FF0000");
									 		//elementRegistry.get(action.context.connection.id));
									 		break;
				case "shape.create":
				case "shape.append":
									  if(elementRegistry.get(action.context.shape.id)==null){
					  					  commandStack.execute(action.command,action.context);
										  this.drawInColor(action.context.shape, "#00FF00");
									  }
									  break;
				case "shape.replace":
				  					  commandStack.execute(action.command,action.context);
									  this.drawInColor(action.context.newShape, "#00FF00");
									  break;
				case "connection.create":commandStack.execute(action.command,action.context);
									  this.drawInColor(action.context.connection, "#00FF00");
									  break;
				/*case "elements.move":
				case "connection.reconnectEnd":
				case "connection.layout":
				case "connection.reconnectEnd":commandStack.execute(action.command,action.context);*/
				default: commandStack.execute(action.command,action.context);
			}

			
		});
		commandStack._stack=[];
		console.log("Saved as Dirty");
		return this.coordChanges;
	}

	

	synchronizeFragmentWithBigPicture(datos){
			fetch(this.url+"/fragmentmanagerurl")
		    .then(function (response) {
		        return response.text()
		    })
		    .then(fragmentManagerURL => {
		        	fetch(fragmentManagerURL,{
				 		method:'POST',
				 		/*headers:{
							"Content-Type":"application/json",
						},*/
				 		body: datos
					})
				    .then(function (response) {
				        return response.text()
				    })
				    .then(result => {
				        	if(result=="1"){
								showMessage("Message","Composition updated locally and synchronized with the Fragment Manager");
							}else{
								showMessage("Attention",result);
							}
				    })
				    .catch(error => {
				        	$("#sending-loader").css("display","none");
							console.log(error);
							showMessage("Error","Some error occurs when synchronizing with the Fragment Manager");
				    })
			})
		    .catch(error => {
		        	$("#sending-loader").css("display","none");
					console.log(error);
					showMessage("Error","Some error occurs when updating the local BPMN Fragment");
		    })

	}


	saveLocalFragment(){
			$("#sending-loader").css("display","inline");
			
		   	const definitions=this.modeler.get('canvas').getRootElement().businessObject.$parent;
		   	var id= definitions.id;

		   	var url=this.url;

		   	const synchronizeFragmentWithBigPicture=this.synchronizeFragmentWithBigPicture;

			this.modeler.saveXML({ format: true }, function(err, xml) {
				if (err) {
					showMessage("Error","Could not save BPMN 2.0 diagram");
					return console.error('Could not save BPMN 2.0 diagram', err);
				}
			 	var datos=JSON.stringify({
					"id":id,
					"composition":sessionStorage.getItem("composition"),
					"xml":xml.replace(/"/g, "'")
				});
			
				fetch(url+"/fragments", {
				 		method:'POST',
				 		/*headers:{
							"Content-Type":"application/json",
						},*/
				 		body: datos
				})
			    .then(function (response) {
			        return response.text()
			    })
			    .then(result => {
			        	if(result=="1"){
							console.log("Composition updated locally");
							synchronizeFragmentWithBigPicture(datos);
						}else{
							showMessage("Attention",result);
						}
			    }) 
			    .catch(error => {
			        	$("#sending-loader").css("display","none");
						console.log(error);
						showMessage("Error","Some error occurs when updating the local BPMN Fragment");
			    })
		    });
	}

	checkBPMN(){
		const definitions=this.modeler.get('canvas').getRootElement().businessObject.$parent;

		var poolMicroservice=false;
		var poolEvent=false;
		jQuery.each(definitions.rootElements, function(index, element){
				if (element.$type=="bpmn:Collaboration"){
					jQuery.each(element.participants, function(index, participant){
						if(participant.name.toLowerCase().trim()=="event bus"){
							poolEvent=true;
						}
						if(participant.name.toLowerCase()==sessionStorage.getItem("microservicename").toLowerCase()){
							poolMicroservice=true;
						}
					});
				}
		});

		if(!poolMicroservice){
			showMessage("Error","One pool should be associated to the microservice "+sessionStorage.getItem("microservicename"));
			return false;
		}

		if(!poolEvent){
			console.log("There is no EVENT BUS pool");
			showMessage("Error","There is no EVENT BUS pool");
			return false;
		}

		return true;
	}

}