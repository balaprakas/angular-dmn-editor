import { is } from 'bpmn-js/lib/util/ModelUtil';
import { TextFieldEntry, TextAreaEntry, SelectEntry, useEvent } from '@bpmn-io/properties-panel';

const LOW_PRIORITY = 500;

export default function ApiCallPropertiesProvider(propertiesPanel, translate) {
  this.getGroups = function(element) {
    return function(groups) {
      if (is(element, 'bpmn:ServiceTask')) {
        groups.push(createApiCallGroup(element, translate));
      }
      return groups;
    };
  };

  propertiesPanel.registerProvider(LOW_PRIORITY, this);
}

ApiCallPropertiesProvider.$inject = ['propertiesPanel', 'translate'];

function createApiCallGroup(element, translate) {
  return {
    id: 'apiCall',
    label: translate('API Call Properties'),
    entries: [
      {
        id: 'apiUrl',
        component: ApiUrlEntry,
        element
      },
      {
        id: 'httpMethod',
        component: HttpMethodEntry,
        element
      },
      {
        id: 'requestBody',
        component: RequestBodyEntry,
        element
      }
    ]
  };
}

function ApiUrlEntry(props) {
  const { element, injector } = props;
  const modeling = injector.get('modeling');
  const translate = injector.get('translate');

  const getValue = () => {
    return element.businessObject.apiUrl || '';
  };

  const setValue = (value) => {
    modeling.updateProperties(element, {
      apiUrl: value
    });
  };

  return TextFieldEntry({
    element,
    id: 'apiUrl',
    label: translate('API URL'),
    getValue,
    setValue
  });
}

function HttpMethodEntry(props) {
  const { element, injector } = props;
  const modeling = injector.get('modeling');
  const translate = injector.get('translate');

  const getValue = () => {
    return element.businessObject.httpMethod || 'GET';
  };

  const setValue = (value) => {
    modeling.updateProperties(element, {
      httpMethod: value
    });
  };

  const getOptions = () => [
    { label: 'GET', value: 'GET' },
    { label: 'POST', value: 'POST' },
    { label: 'PUT', value: 'PUT' },
    { label: 'DELETE', value: 'DELETE' }
  ];

  return SelectEntry({
    element,
    id: 'httpMethod',
    label: translate('HTTP Method'),
    getValue,
    setValue,
    getOptions
  });
}

function RequestBodyEntry(props) {
  const { element, injector } = props;
  const modeling = injector.get('modeling');
  const translate = injector.get('translate');

  const getValue = () => {
    return element.businessObject.requestBody || '';
  };

  const setValue = (value) => {
    modeling.updateProperties(element, {
      requestBody: value
    });
  };

  return TextAreaEntry({
    element,
    id: 'requestBody',
    label: translate('Request Body'),
    getValue,
    setValue
  });
}
