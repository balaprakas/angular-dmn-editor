import ApiCallPaletteProvider from './ApiCallPaletteProvider';
import apiCallDescriptor from './api-call.json';

export default {
  __init__: [
    'apiCallPaletteProvider'
  ],
  apiCallPaletteProvider: ['type', ApiCallPaletteProvider]
};

export { apiCallDescriptor };
