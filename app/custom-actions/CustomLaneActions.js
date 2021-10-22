import ContextPadProvider from "bpmn-js/lib/features/context-pad/ContextPadProvider"

export class CustomContextPadProvider extends ContextPadProvider {

    constructor(config, injector, eventBus, contextPad, modeling, elementFactory, connect, create, popupMenu, canvas, rules, translate) {
        super(config, injector, eventBus, contextPad, modeling, elementFactory, connect, create, popupMenu, canvas, rules, translate);
    }

    getContextPadEntries(element) {
        var result = super.getContextPadEntries(element);

        var e=element;
        if(e.businessObject.$instanceOf("bpmn:Participant") && (e.businessObject.name!=null) &&
                (e.businessObject.name=="EVENT BUS" || 
                e.businessObject.name.toLowerCase()==sessionStorage.getItem("microservicename").toLowerCase())){
            return [];

        }

        return result;
    }

}

//CustomContextPadProvider.$inject = ['config.contextPad', 'injector', 'eventBus', 'contextPad', 'modeling', 'elementFactory', 'connect', 'create', 'popupMenu', 'canvas', 'rules', 'translate'];

export default {
  __init__: ['contextPadProvider'],
  contextPadProvider: ['type', CustomContextPadProvider]
};