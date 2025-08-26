import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { ApiService } from '../../services/api.service';
import { ModelAsset } from '../../models/model-asset';

import BpmnModeler from 'bpmn-js/lib/Modeler';
// @ts-ignore
import DmnModeler from 'dmn-js/lib/Modeler';
import * as monaco from 'monaco-editor';

@Component({
  selector: 'app-editor',
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
    MatTabsModule
  ],
  template: `
    <div class="editor-container">
      <mat-card class="editor-header">
        <mat-card-header>
          <mat-card-title>
            {{isEditMode ? 'Edit' : 'Create'}} {{assetType.toUpperCase()}} {{getAssetTypeLabel()}}
          </mat-card-title>
          <mat-card-subtitle>
            {{isEditMode ? asset.name : 'New ' + getAssetTypeLabel()}}
          </mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="asset-info">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Name</mat-label>
              <input matInput [(ngModel)]="asset.name" placeholder="Enter asset name">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Description</mat-label>
              <textarea matInput [(ngModel)]="asset.description" placeholder="Enter description" rows="2"></textarea>
            </mat-form-field>
          </div>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="primary" (click)="save()" [disabled]="!asset.name">
            <mat-icon>save</mat-icon>
            Save
          </button>
          <button mat-raised-button (click)="validate()" [disabled]="!asset.content">
            <mat-icon>check_circle</mat-icon>
            Validate
          </button>
          <button mat-button (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
            Back
          </button>
        </mat-card-actions>
      </mat-card>

      <mat-card class="editor-content">
        <mat-card-content>
          <mat-tab-group>
            <mat-tab label="Visual Editor">
              <div class="visual-editor" #visualEditor>
                <div *ngIf="assetType === 'bpmn'" class="bpmn-editor">
                  <div #bpmnCanvas class="editor-canvas"></div>
                </div>
                <div *ngIf="assetType === 'dmn'" class="dmn-editor">
                  <div #dmnCanvas class="editor-canvas"></div>
                </div>
                <div *ngIf="assetType === 'drl'" class="drl-editor">
                  <div #monacoEditor class="editor-canvas"></div>
                </div>
              </div>
            </mat-tab>
            <mat-tab label="Source Code">
              <div class="source-editor">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>{{assetType.toUpperCase()}} Content</mat-label>
                  <textarea 
                    matInput 
                    [(ngModel)]="asset.content" 
                    placeholder="Enter {{assetType.toUpperCase()}} content"
                    rows="20"
                    class="source-textarea">
                  </textarea>
                </mat-form-field>
              </div>
            </mat-tab>
          </mat-tab-group>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .editor-container {
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }
    .editor-header {
      margin-bottom: 20px;
    }
    .asset-info {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .full-width {
      width: 100%;
    }
    .editor-content {
      min-height: 600px;
    }
    .visual-editor {
      padding: 16px 0;
    }
    .editor-canvas {
      width: 100%;
      height: 500px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    .source-editor {
      padding: 16px 0;
    }
    .source-textarea {
      font-family: 'Courier New', monospace;
      font-size: 14px;
    }
    .bpmn-editor, .dmn-editor, .drl-editor {
      width: 100%;
      height: 500px;
    }
  `]
})
export class EditorComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('bpmnCanvas', { static: false }) bpmnCanvas!: ElementRef;
  @ViewChild('dmnCanvas', { static: false }) dmnCanvas!: ElementRef;
  @ViewChild('monacoEditor', { static: false }) monacoEditorRef!: ElementRef;

  assetType: string = '';
  assetId: string | null = null;
  isEditMode: boolean = false;
  
  private bpmnModeler: BpmnModeler | null = null;
  private dmnModeler: DmnModeler | null = null;
  private monacoEditor: monaco.editor.IStandaloneCodeEditor | null = null;
  asset: ModelAsset = {
    name: '',
    type: 'BPMN',
    content: '',
    description: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.assetType = params['type'];
      this.assetId = params['id'] || null;
      this.isEditMode = !!this.assetId;
      this.asset.type = this.assetType.toUpperCase() as 'BPMN' | 'DMN' | 'DRL';

      if (this.isEditMode && this.assetId) {
        this.loadAsset();
      } else {
        this.initializeNewAsset();
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializeEditors();
    }, 100);
  }

  ngOnDestroy() {
    if (this.bpmnModeler) {
      this.bpmnModeler.destroy();
    }
    if (this.dmnModeler) {
      this.dmnModeler.destroy();
    }
    if (this.monacoEditor) {
      this.monacoEditor.dispose();
    }
  }

  loadAsset() {
    if (this.assetId) {
      this.apiService.getAssetById(this.assetId).subscribe({
        next: (asset) => {
          this.asset = asset;
        },
        error: (error) => {
          this.snackBar.open('Failed to load asset', 'Close', { duration: 3000 });
        }
      });
    }
  }

  initializeNewAsset() {
    this.asset = {
      name: '',
      type: this.assetType.toUpperCase() as 'BPMN' | 'DMN' | 'DRL',
      content: this.getDefaultContent(),
      description: ''
    };
  }

  getDefaultContent(): string {
    switch (this.assetType) {
      case 'bpmn':
        return `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" 
                  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" 
                  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" 
                  xmlns:di="http://www.omg.org/spec/DD/20100524/DI" 
                  id="Definitions_1" 
                  targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_1" isExecutable="true">
    <bpmn:startEvent id="StartEvent_1"/>
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds x="179" y="99" width="36" height="36"/>
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;
      case 'dmn':
        return `<?xml version="1.0" encoding="UTF-8"?>
<dmn:definitions xmlns:dmn="http://www.omg.org/spec/DMN/20180521/MODEL/" 
                 xmlns:dmndi="http://www.omg.org/spec/DMN/20180521/DMNDI/" 
                 xmlns:dc="http://www.omg.org/spec/DMN/20180521/DC/" 
                 id="Definitions_1" 
                 name="DRD" 
                 namespace="http://camunda.org/schema/1.0/dmn">
  <dmn:decision id="Decision_1" name="Decision 1">
    <dmn:decisionTable id="DecisionTable_1">
      <dmn:input id="Input_1">
        <dmn:inputExpression id="InputExpression_1" typeRef="string">
          <dmn:text>input</dmn:text>
        </dmn:inputExpression>
      </dmn:input>
      <dmn:output id="Output_1" typeRef="string"/>
    </dmn:decisionTable>
  </dmn:decision>
</dmn:definitions>`;
      case 'drl':
        return `package com.businesscentral.rules

rule "Sample Rule"
when
then
end`;
      default:
        return '';
    }
  }

  getAssetTypeLabel(): string {
    switch (this.assetType) {
      case 'bpmn': return 'Workflow';
      case 'dmn': return 'Decision';
      case 'drl': return 'Rules';
      default: return 'Asset';
    }
  }

  async save() {
    if (!this.asset.name) {
      this.snackBar.open('Please enter a name for the asset', 'Close', { duration: 3000 });
      return;
    }

    await this.syncVisualEditorContent();

    const saveOperation = this.isEditMode && this.assetId
      ? this.apiService.updateAsset(this.assetId, this.asset)
      : this.apiService.createAsset(this.asset);

    saveOperation.subscribe({
      next: (savedAsset) => {
        this.asset = savedAsset;
        this.snackBar.open('Asset saved successfully', 'Close', { duration: 3000 });
        if (!this.isEditMode) {
          this.router.navigate(['/editor', this.assetType, savedAsset.id]);
        }
      },
      error: (error) => {
        this.snackBar.open('Failed to save asset', 'Close', { duration: 3000 });
      }
    });
  }

  validate() {
    if (!this.assetId) {
      this.snackBar.open('Please save the asset first', 'Close', { duration: 3000 });
      return;
    }

    this.apiService.validateAsset(this.assetId).subscribe({
      next: (result) => {
        if (result.valid) {
          this.snackBar.open('Validation successful', 'Close', { duration: 3000 });
        } else {
          const message = `Validation failed: ${result.errors.join(', ')}`;
          this.snackBar.open(message, 'Close', { duration: 5000 });
        }
      },
      error: (error) => {
        this.snackBar.open('Validation failed', 'Close', { duration: 3000 });
      }
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  private initializeEditors() {
    switch (this.assetType) {
      case 'bpmn':
        this.initializeBpmnEditor();
        break;
      case 'dmn':
        this.initializeDmnEditor();
        break;
      case 'drl':
        this.initializeMonacoEditor();
        break;
    }
  }

  private initializeBpmnEditor() {
    if (this.bpmnCanvas && this.bpmnCanvas.nativeElement) {
      this.bpmnModeler = new BpmnModeler({
        container: this.bpmnCanvas.nativeElement
      });

      this.loadBpmnDiagram();

      this.bpmnModeler.on('commandStack.changed', () => {
        this.syncBpmnToSource();
      });
    }
  }

  private async loadBpmnDiagram() {
    if (!this.bpmnModeler) return;

    try {
      const xml = this.asset.content || this.getDefaultContent();
      await this.bpmnModeler.importXML(xml);
    } catch (err) {
      console.error('Error loading BPMN diagram:', err);
      this.snackBar.open('Failed to load BPMN diagram', 'Close', { duration: 3000 });
    }
  }

  private async syncBpmnToSource() {
    if (!this.bpmnModeler) return;

    try {
      const { xml } = await this.bpmnModeler.saveXML({ format: true });
      this.asset.content = xml || '';
    } catch (err) {
      console.error('Error syncing BPMN to source:', err);
    }
  }

  private initializeDmnEditor() {
    if (this.dmnCanvas && this.dmnCanvas.nativeElement) {
      this.dmnModeler = new DmnModeler({
        container: this.dmnCanvas.nativeElement
      });

      this.loadDmnDiagram();

      this.dmnModeler.on('commandStack.changed', () => {
        this.syncDmnToSource();
      });
    }
  }

  private async loadDmnDiagram() {
    if (!this.dmnModeler) return;

    try {
      const xml = this.asset.content || this.getDefaultContent();
      await this.dmnModeler.importXML(xml);
    } catch (err) {
      console.error('Error loading DMN diagram:', err);
      this.snackBar.open('Failed to load DMN diagram', 'Close', { duration: 3000 });
    }
  }

  private async syncDmnToSource() {
    if (!this.dmnModeler) return;

    try {
      const { xml } = await this.dmnModeler.saveXML({ format: true });
      this.asset.content = xml || '';
    } catch (err) {
      console.error('Error syncing DMN to source:', err);
    }
  }

  private initializeMonacoEditor() {
    if (this.monacoEditorRef && this.monacoEditorRef.nativeElement) {
      this.monacoEditor = monaco.editor.create(this.monacoEditorRef.nativeElement, {
        value: this.asset.content || this.getDefaultContent(),
        language: 'java',
        theme: 'vs-dark',
        automaticLayout: true
      });

      this.monacoEditor.onDidChangeModelContent(() => {
        this.asset.content = this.monacoEditor?.getValue() || '';
      });
    }
  }

  private async syncVisualEditorContent() {
    switch (this.assetType) {
      case 'bpmn':
        await this.syncBpmnToSource();
        break;
      case 'dmn':
        await this.syncDmnToSource();
        break;
      case 'drl':
        break;
    }
  }
}
