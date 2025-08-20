import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DmnEditor } from './dmn-editor/dmn-editor';
import { DrlEditor } from './drl-editor/drl-editor';

@Component({
  selector: 'app-root',
  imports: [CommonModule, DmnEditor, DrlEditor],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('dmn-editor-app');
  protected readonly activeTab = signal<'dmn' | 'drl'>('dmn');

  setActiveTab(tab: 'dmn' | 'drl') {
    this.activeTab.set(tab);
  }
}
