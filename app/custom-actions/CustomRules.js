import RuleProvider from "diagram-js/lib/features/rules/RuleProvider";
import inherits from "inherits";

function CustomRules(eventBus) {
  	RuleProvider.call(this, eventBus);

	// don't allow deleting the microservice and the event bus pools
	this.addRule("elements.delete", function (context) {
	return context.elements.filter(function (e) {
	  return !(e.businessObject.$instanceOf("bpmn:Participant") && (e.businessObject.name!=null) &&
	  				(e.businessObject.name=="EVENT BUS" || 
	  				e.businessObject.name.toLowerCase()==sessionStorage.getItem("microservicename").toLowerCase())
	  		  );
		});
	});

	

}

inherits(CustomRules, RuleProvider);

CustomRules.$inject = ["eventBus"];

export default {
  __init__: ["customRules"],
  customRules: ["type", CustomRules]
};


