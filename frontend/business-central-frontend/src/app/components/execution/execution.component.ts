import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { ApiService } from '../../services/api.service';
import { ModelAsset, ExecutionResult } from '../../models/model-asset';

@Component({
  selector: 'app-execution',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatExpansionModule
  ],
  template: `
    <div class="execution-container">
      <mat-card class="asset-info-card">
        <mat-card-header>
          <mat-card-title>Execute {{asset?.type}} Asset</mat-card-title>
          <mat-card-subtitle>{{asset?.name}}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <p>{{asset?.description}}</p>
          <div class="asset-details">
            <span class="asset-type-badge" [ngClass]="'type-' + (asset?.type || '').toLowerCase()">
              {{asset?.type}}
            </span>
            <span class="asset-date">Last modified: {{asset?.updatedAt | date:'short'}}</span>
          </div>
        </mat-card-content>
        <mat-card-actions>
          <button mat-button (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
            Back to Dashboard
          </button>
          <button mat-button (click)="editAsset()" *ngIf="asset">
            <mat-icon>edit</mat-icon>
            Edit Asset
          </button>
        </mat-card-actions>
      </mat-card>

      <mat-card class="input-card">
        <mat-card-header>
          <mat-card-title>Input Data</mat-card-title>
          <mat-card-subtitle>Provide input data for execution (JSON format)</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Input JSON</mat-label>
            <textarea 
              matInput 
              [(ngModel)]="inputDataJson" 
              placeholder='{"key": "value", "number": 123}'
              rows="8"
              class="json-textarea">
            </textarea>
          </mat-form-field>
          <div class="sample-inputs" *ngIf="getSampleInput()">
            <h4>Sample Input:</h4>
            <pre class="sample-json">{{getSampleInput()}}</pre>
            <button mat-button (click)="useSampleInput()">Use Sample</button>
          </div>
        </mat-card-content>
        <mat-card-actions>
          <button 
            mat-raised-button 
            color="primary" 
            (click)="execute()" 
            [disabled]="isExecuting || !asset"
            class="execute-button">
            <mat-icon *ngIf="!isExecuting">play_arrow</mat-icon>
            <mat-spinner *ngIf="isExecuting" diameter="20"></mat-spinner>
            {{isExecuting ? 'Executing...' : 'Execute'}}
          </button>
          <button mat-button (click)="clearInput()">
            <mat-icon>clear</mat-icon>
            Clear
          </button>
        </mat-card-actions>
      </mat-card>

      <mat-card class="results-card" *ngIf="executionResults.length > 0">
        <mat-card-header>
          <mat-card-title>Execution Results</mat-card-title>
          <mat-card-subtitle>{{executionResults.length}} execution(s)</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <mat-accordion>
            <mat-expansion-panel *ngFor="let result of executionResults; let i = index" [expanded]="i === 0">
              <mat-expansion-panel-header>
                <mat-panel-title>
                  <mat-icon [color]="result.success ? 'primary' : 'warn'">
                    {{result.success ? 'check_circle' : 'error'}}
                  </mat-icon>
                  Execution {{i + 1}} - {{result.executedAt | date:'short'}}
                </mat-panel-title>
                <mat-panel-description>
                  {{result.success ? 'Success' : 'Failed'}}
                </mat-panel-description>
              </mat-expansion-panel-header>
              
              <div class="result-content">
                <div class="result-section" *ngIf="result.success">
                  <h4>Output Data:</h4>
                  <pre class="result-json">{{formatJson(result.outputData)}}</pre>
                </div>
                
                <div class="result-section" *ngIf="!result.success && result.errorMessage">
                  <h4>Error:</h4>
                  <div class="error-message">{{result.errorMessage}}</div>
                </div>
                
                <mat-expansion-panel class="nested-panel">
                  <mat-expansion-panel-header>
                    <mat-panel-title>Input Data</mat-panel-title>
                  </mat-expansion-panel-header>
                  <pre class="result-json">{{formatJson(result.inputData)}}</pre>
                </mat-expansion-panel>
              </div>
            </mat-expansion-panel>
          </mat-accordion>
        </mat-card-content>
        <mat-card-actions>
          <button mat-button (click)="clearResults()">
            <mat-icon>clear_all</mat-icon>
            Clear Results
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .execution-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .asset-info-card, .input-card, .results-card {
      margin-bottom: 20px;
    }
    .asset-details {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-top: 8px;
    }
    .asset-type-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
    }
    .type-bpmn {
      background-color: #e3f2fd;
      color: #1976d2;
    }
    .type-dmn {
      background-color: #f3e5f5;
      color: #7b1fa2;
    }
    .type-drl {
      background-color: #ffebee;
      color: #d32f2f;
    }
    .asset-date {
      color: #666;
      font-size: 14px;
    }
    .full-width {
      width: 100%;
    }
    .json-textarea {
      font-family: 'Courier New', monospace;
      font-size: 14px;
    }
    .sample-inputs {
      margin-top: 16px;
      padding: 16px;
      background-color: #f5f5f5;
      border-radius: 4px;
    }
    .sample-json, .result-json {
      background-color: #f8f8f8;
      padding: 12px;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      overflow-x: auto;
      white-space: pre-wrap;
    }
    .execute-button {
      min-width: 120px;
    }
    .result-content {
      padding: 16px 0;
    }
    .result-section {
      margin-bottom: 16px;
    }
    .error-message {
      color: #d32f2f;
      background-color: #ffebee;
      padding: 12px;
      border-radius: 4px;
      border-left: 4px solid #d32f2f;
    }
    .nested-panel {
      margin-top: 8px;
    }
  `]
})
export class ExecutionComponent implements OnInit {
  assetId: string = '';
  asset: ModelAsset | null = null;
  inputDataJson: string = '{}';
  isExecuting: boolean = false;
  executionResults: ExecutionResult[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.assetId = params['id'];
      this.loadAsset();
    });
  }

  loadAsset() {
    this.apiService.getAssetById(this.assetId).subscribe({
      next: (asset) => {
        this.asset = asset;
        this.inputDataJson = this.getSampleInput() || '{}';
      },
      error: (error) => {
        this.snackBar.open('Failed to load asset', 'Close', { duration: 3000 });
      }
    });
  }

  getSampleInput(): string | null {
    if (!this.asset) return null;
    
    switch (this.asset.type) {
      case 'BPMN':
        return JSON.stringify({
          "processVariable": "value",
          "userId": "user123",
          "amount": 1000
        }, null, 2);
      case 'DMN':
        return JSON.stringify({
          "age": 25,
          "income": 50000,
          "creditScore": 750
        }, null, 2);
      case 'DRL':
        return JSON.stringify({
          "customer": {
            "name": "John Doe",
            "age": 30,
            "premium": true
          },
          "order": {
            "amount": 500,
            "items": 3
          }
        }, null, 2);
      default:
        return null;
    }
  }

  useSampleInput() {
    const sample = this.getSampleInput();
    if (sample) {
      this.inputDataJson = sample;
    }
  }

  execute() {
    if (!this.asset) return;

    let inputData: any;
    try {
      inputData = JSON.parse(this.inputDataJson);
    } catch (error) {
      this.snackBar.open('Invalid JSON format', 'Close', { duration: 3000 });
      return;
    }

    this.isExecuting = true;
    
    const executeMethod = this.getExecuteMethod();
    executeMethod(this.assetId, inputData).subscribe({
      next: (result) => {
        this.executionResults.unshift(result);
        this.isExecuting = false;
        if (result.success) {
          this.snackBar.open('Execution completed successfully', 'Close', { duration: 3000 });
        } else {
          this.snackBar.open('Execution failed', 'Close', { duration: 3000 });
        }
      },
      error: (error) => {
        this.isExecuting = false;
        this.snackBar.open('Execution failed', 'Close', { duration: 3000 });
      }
    });
  }

  private getExecuteMethod() {
    switch (this.asset?.type) {
      case 'BPMN':
        return this.apiService.executeBpmn.bind(this.apiService);
      case 'DMN':
        return this.apiService.executeDmn.bind(this.apiService);
      case 'DRL':
        return this.apiService.executeDrl.bind(this.apiService);
      default:
        return this.apiService.executeDrl.bind(this.apiService);
    }
  }

  formatJson(obj: any): string {
    return JSON.stringify(obj, null, 2);
  }

  clearInput() {
    this.inputDataJson = '{}';
  }

  clearResults() {
    this.executionResults = [];
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  editAsset() {
    if (this.asset) {
      this.router.navigate(['/editor', this.asset.type.toLowerCase(), this.asset.id]);
    }
  }
}
