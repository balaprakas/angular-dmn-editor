import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import Modeler from 'dmn-js/lib/Modeler';

@Component({
  selector: 'app-dmn-editor',
  imports: [CommonModule],
  templateUrl: './dmn-editor.html',
  styleUrl: './dmn-editor.css'
})
export class DmnEditor implements AfterViewInit, OnDestroy {
  @ViewChild('dmnEditorContainer', { static: false }) dmnEditorContainer!: ElementRef;
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  private dmnModeler: Modeler | null = null;
  isDragOver = false;

  constructor(private http: HttpClient) {}

  ngAfterViewInit() {
    this.initializeDmnEditor();
  }

  ngOnDestroy() {
    if (this.dmnModeler) {
      this.dmnModeler.destroy();
    }
  }

  private initializeDmnEditor() {
    try {
      this.dmnModeler = new Modeler({
        container: this.dmnEditorContainer.nativeElement
      });
      
      console.log('DMN Modeler initialized successfully');
      
    } catch (error) {
      console.error('Error initializing DMN Modeler:', error);
    }
  }

  loadExampleDMN() {
    const sampleDmnXml = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" xmlns:dmndi="https://www.omg.org/spec/DMN/20191111/DMNDI/" xmlns:dc="http://www.omg.org/spec/DMN/20180521/DC/" id="LoanApproval" name="Loan Approval" namespace="http://camunda.org/schema/1.0/dmn">
  <decision id="LoanApprovalDecision" name="Loan Approval">
    <decisionTable id="DecisionTable_1" hitPolicy="FIRST">
      <input id="Input_1" label="Credit Score">
        <inputExpression id="InputExpression_1" typeRef="integer">
          <text>creditScore</text>
        </inputExpression>
      </input>
      <input id="Input_2" label="Income">
        <inputExpression id="InputExpression_2" typeRef="double">
          <text>income</text>
        </inputExpression>
      </input>
      <output id="Output_1" label="Approval" typeRef="string"/>
      <rule id="DecisionRule_1">
        <inputEntry id="UnaryTests_1">
          <text>&gt;= 700</text>
        </inputEntry>
        <inputEntry id="UnaryTests_2">
          <text>&gt;= 50000</text>
        </inputEntry>
        <outputEntry id="LiteralExpression_1">
          <text>"Approved"</text>
        </outputEntry>
      </rule>
      <rule id="DecisionRule_2">
        <inputEntry id="UnaryTests_3">
          <text>&lt; 700</text>
        </inputEntry>
        <inputEntry id="UnaryTests_4">
          <text>&gt;= 30000</text>
        </inputEntry>
        <outputEntry id="LiteralExpression_2">
          <text>"Manual Review"</text>
        </outputEntry>
      </rule>
      <rule id="DecisionRule_3">
        <inputEntry id="UnaryTests_5">
          <text>&lt; 700</text>
        </inputEntry>
        <inputEntry id="UnaryTests_6">
          <text>&lt; 30000</text>
        </inputEntry>
        <outputEntry id="LiteralExpression_3">
          <text>"Rejected"</text>
        </outputEntry>
      </rule>
    </decisionTable>
  </decision>
</definitions>`;

    if (this.dmnModeler) {
      this.dmnModeler.importXML(sampleDmnXml)
        .then(() => {
          console.log('Sample DMN loaded successfully');
        })
        .catch((err: any) => {
          console.error('Error loading sample DMN:', err);
        });
    }
  }

  async exportDMN() {
    if (this.dmnModeler) {
      try {
        const result = await this.dmnModeler.saveXML({ format: true });
        console.log('Current DMN XML:', result.xml);
      } catch (err) {
        console.error('Error exporting DMN:', err);
      }
    } else {
      console.error('DMN Modeler not available');
    }
  }

  async getContent(): Promise<string> {
    if (this.dmnModeler) {
      try {
        const result = await this.dmnModeler.saveXML({ format: true });
        return result.xml || '';
      } catch (err) {
        throw err;
      }
    } else {
      return '';
    }
  }

  async setContent(dmnXml: string): Promise<void> {
    if (this.dmnModeler) {
      try {
        await this.dmnModeler.importXML(dmnXml);
      } catch (err) {
        throw err;
      }
    } else {
      throw new Error('DMN Modeler not available');
    }
  }

  openFileDialog() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.loadDmnFile(file);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      this.loadDmnFile(file);
    }
  }

  private loadDmnFile(file: File) {
    if (!file.name.toLowerCase().endsWith('.dmn') && !file.name.toLowerCase().endsWith('.xml')) {
      console.error('Invalid file type. Please select a DMN (.dmn) or XML (.xml) file.');
      alert('Invalid file type. Please select a DMN (.dmn) or XML (.xml) file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dmnXml = e.target?.result as string;
      if (this.dmnModeler && dmnXml) {
        this.dmnModeler.importXML(dmnXml)
          .then(() => {
            console.log(`DMN file "${file.name}" loaded successfully`);
          })
          .catch((err: any) => {
            console.error('Error loading DMN file:', err);
            alert('Error loading DMN file. Please check if the file is a valid DMN document.');
          });
      }
    };
    reader.onerror = () => {
      console.error('Error reading file');
      alert('Error reading file. Please try again.');
    };
    reader.readAsText(file);
  }
}
