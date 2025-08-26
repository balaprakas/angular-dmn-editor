import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ModelAsset, ExecutionRequest, ExecutionResult, ValidationResult } from '../models/model-asset';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8080/business-central/api';

  constructor(private http: HttpClient) {}

  getAllAssets(): Observable<ModelAsset[]> {
    return this.http.get<ModelAsset[]>(`${this.baseUrl}/assets`);
  }

  getAssetsByType(type: string): Observable<ModelAsset[]> {
    return this.http.get<ModelAsset[]>(`${this.baseUrl}/assets/type/${type}`);
  }

  getAssetById(id: string): Observable<ModelAsset> {
    return this.http.get<ModelAsset>(`${this.baseUrl}/assets/${id}`);
  }

  createAsset(asset: ModelAsset): Observable<ModelAsset> {
    return this.http.post<ModelAsset>(`${this.baseUrl}/assets`, asset);
  }

  updateAsset(id: string, asset: ModelAsset): Observable<ModelAsset> {
    return this.http.put<ModelAsset>(`${this.baseUrl}/assets/${id}`, asset);
  }

  deleteAsset(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/assets/${id}`);
  }

  validateAsset(id: string): Observable<ValidationResult> {
    return this.http.post<ValidationResult>(`${this.baseUrl}/assets/${id}/validate`, {});
  }

  executeAsset(request: ExecutionRequest): Observable<ExecutionResult> {
    return this.http.post<ExecutionResult>(`${this.baseUrl}/execution/execute`, request);
  }

  executeBpmn(id: string, inputData: any): Observable<ExecutionResult> {
    return this.http.post<ExecutionResult>(`${this.baseUrl}/execution/bpmn/${id}`, { inputData });
  }

  executeDmn(id: string, inputData: any): Observable<ExecutionResult> {
    return this.http.post<ExecutionResult>(`${this.baseUrl}/execution/dmn/${id}`, { inputData });
  }

  executeDrl(id: string, inputData: any): Observable<ExecutionResult> {
    return this.http.post<ExecutionResult>(`${this.baseUrl}/execution/drl/${id}`, { inputData });
  }
}
