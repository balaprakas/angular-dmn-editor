import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import DmnJS from 'dmn-js';

@Component({
  selector: 'app-dmn-editor',
  imports: [],
  templateUrl: './dmn-editor.html',
  styleUrl: './dmn-editor.css'
})
export class DmnEditor implements AfterViewInit, OnDestroy {
  @ViewChild('dmnEditorContainer', { static: false }) dmnEditorContainer!: ElementRef;
  private dmnViewer: DmnJS | null = null;

  constructor(private http: HttpClient) {}

  ngAfterViewInit() {
    this.initializeDmnEditor();
  }

  ngOnDestroy() {
    if (this.dmnViewer) {
      this.dmnViewer.destroy();
    }
  }

  private initializeDmnEditor() {
    try {
      this.dmnViewer = new DmnJS({
        container: this.dmnEditorContainer.nativeElement
      });
      
      console.log('DMN Editor initialized successfully');
      
      setTimeout(() => {
        this.loadExampleDMN();
      }, 500);
    } catch (error) {
      console.error('Error initializing DMN Editor:', error);
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

    if (this.dmnViewer) {
      this.dmnViewer.importXML(sampleDmnXml)
        .then(() => {
          console.log('Sample DMN loaded successfully');
        })
        .catch((err) => {
          console.error('Error loading sample DMN:', err);
        });
    }
  }

  async exportDMN() {
    if (this.dmnViewer) {
      try {
        const result = await this.dmnViewer.saveXML({ format: true });
        console.log('Current DMN XML:', result.xml);
      } catch (err) {
        console.error('Error exporting DMN:', err);
      }
    } else {
      console.error('DMN Editor not available');
    }
  }

  async getContent(): Promise<string> {
    if (this.dmnViewer) {
      try {
        const result = await this.dmnViewer.saveXML({ format: true });
        return result.xml || '';
      } catch (err) {
        throw err;
      }
    } else {
      return '';
    }
  }

  async setContent(dmnXml: string): Promise<void> {
    if (this.dmnViewer) {
      try {
        await this.dmnViewer.importXML(dmnXml);
      } catch (err) {
        throw err;
      }
    } else {
      throw new Error('DMN Editor not available');
    }
  }
}
