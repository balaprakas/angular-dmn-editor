import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import loader from '@monaco-editor/loader';

@Component({
  selector: 'app-drl-editor',
  imports: [CommonModule],
  templateUrl: './drl-editor.html',
  styleUrl: './drl-editor.css'
})
export class DrlEditor implements AfterViewInit, OnDestroy {
  @ViewChild('drlEditorContainer', { static: false }) drlEditorContainer!: ElementRef;
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  
  private monacoEditor: any = null;
  isDragOver = false;
  currentFileName = '';

  constructor() {}

  ngAfterViewInit() {
    this.initializeMonacoEditor();
  }

  ngOnDestroy() {
    if (this.monacoEditor) {
      this.monacoEditor.dispose();
    }
  }

  private async initializeMonacoEditor() {
    try {
      const monaco = await loader.init();
      
      this.monacoEditor = monaco.editor.create(this.drlEditorContainer.nativeElement, {
        value: '// DRL Rules Editor\n// Upload a .drl file to start editing\n\npackage com.example.rules\n\nimport com.example.model.*\n\nrule "Sample Rule"\n    when\n        // Add your conditions here\n    then\n        // Add your actions here\nend',
        language: 'java',
        theme: 'vs-dark',
        automaticLayout: true,
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        fontSize: 14,
        lineNumbers: 'on',
        roundedSelection: false,
        readOnly: false,
        cursorStyle: 'line',
        wordWrap: 'on'
      });
      
      console.log('Monaco Editor initialized successfully');
    } catch (error) {
      console.error('Error initializing Monaco Editor:', error);
    }
  }

  openFileDialog() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.loadDrlFile(file);
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
      this.loadDrlFile(file);
    }
  }

  private loadDrlFile(file: File) {
    if (!file.name.toLowerCase().endsWith('.drl')) {
      console.error('Invalid file type. Please select a DRL (.drl) file.');
      alert('Invalid file type. Please select a DRL (.drl) file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const drlContent = e.target?.result as string;
      if (this.monacoEditor && drlContent) {
        this.monacoEditor.setValue(drlContent);
        this.currentFileName = file.name;
        console.log(`DRL file "${file.name}" loaded successfully`);
      }
    };
    reader.onerror = () => {
      console.error('Error reading file');
      alert('Error reading file. Please try again.');
    };
    reader.readAsText(file);
  }

  downloadDrlFile() {
    if (this.monacoEditor) {
      const content = this.monacoEditor.getValue();
      const fileName = this.currentFileName || 'rules.drl';
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(url);
      
      console.log(`DRL file "${fileName}" downloaded successfully`);
    } else {
      console.error('Monaco Editor not available');
    }
  }
}
