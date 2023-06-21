import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportOwnerComponent } from './export-owner.component';

describe('ExportOwnerComponent', () => {
  let component: ExportOwnerComponent;
  let fixture: ComponentFixture<ExportOwnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportOwnerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
