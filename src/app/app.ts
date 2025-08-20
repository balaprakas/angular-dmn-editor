import { Component, signal } from '@angular/core';
import { DmnEditor } from './dmn-editor/dmn-editor';

@Component({
  selector: 'app-root',
  imports: [DmnEditor],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('dmn-editor-app');
}
