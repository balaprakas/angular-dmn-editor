import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmnEditor } from './dmn-editor';

describe('DmnEditor', () => {
  let component: DmnEditor;
  let fixture: ComponentFixture<DmnEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DmnEditor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DmnEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
