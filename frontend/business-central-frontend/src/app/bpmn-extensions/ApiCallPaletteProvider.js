export default function ApiCallPaletteProvider(palette, create, elementFactory, translate) {
  console.log('ApiCallPaletteProvider initialized');
  
  this.getPaletteEntries = function() {
    console.log('getPaletteEntries called');
    const entries = {
      'create.api-call-task': {
        group: 'activity',
        className: 'bpmn-icon-service-task',
        title: translate('Create API Call Task'),
        action: {
          dragstart: createApiCallTask,
          click: createApiCallTask
        }
      }
    };
    console.log('Returning palette entries:', entries);
    return entries;
  };

  function createApiCallTask(event) {
    console.log('Creating API Call Task');
    const shape = elementFactory.createShape({
      type: 'bpmn:ServiceTask',
      businessObject: {
        $type: 'bpmn:ServiceTask',
        name: 'API Call Task',
        apiUrl: '',
        httpMethod: 'GET',
        requestBody: ''
      }
    });

    create.start(event, shape);
  }

  palette.registerProvider(this);
}

ApiCallPaletteProvider.$inject = [
  'palette',
  'create',
  'elementFactory',
  'translate'
];
