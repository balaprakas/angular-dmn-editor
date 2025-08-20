declare module 'dmn-js' {
  interface DmnJSOptions {
    container?: HTMLElement | string;
  }

  interface SaveXMLOptions {
    format?: boolean;
  }

  interface SaveXMLResult {
    xml: string;
  }

  export default class DmnJS {
    constructor(options?: DmnJSOptions);
    importXML(xml: string): Promise<void>;
    saveXML(options: SaveXMLOptions): Promise<SaveXMLResult>;
    attachTo(container: HTMLElement | string): void;
    detach(): void;
    destroy(): void;
  }
}

declare module 'dmn-js/lib/Modeler' {
  interface DmnJSOptions {
    container?: HTMLElement | string;
  }

  interface SaveXMLOptions {
    format?: boolean;
  }

  interface SaveXMLResult {
    xml: string;
  }

  export default class Modeler {
    constructor(options?: DmnJSOptions);
    importXML(xml: string): Promise<void>;
    saveXML(options: SaveXMLOptions): Promise<SaveXMLResult>;
    attachTo(container: HTMLElement | string): void;
    detach(): void;
    destroy(): void;
  }
}
