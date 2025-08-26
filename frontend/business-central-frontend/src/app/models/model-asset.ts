export interface ModelAsset {
  id?: string;
  name: string;
  type: 'BPMN' | 'DMN' | 'DRL';
  content: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExecutionRequest {
  assetId: string;
  inputData: { [key: string]: any };
}

export interface ExecutionResult {
  assetId: string;
  assetType: string;
  inputData: { [key: string]: any };
  outputData: { [key: string]: any };
  success: boolean;
  errorMessage?: string;
  executedAt: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}
