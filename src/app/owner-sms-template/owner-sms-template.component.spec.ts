import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerSmsTemplateComponent } from './owner-sms-template.component';

describe('OwnerSmsTemplateComponent', () => {
  let component: OwnerSmsTemplateComponent;
  let fixture: ComponentFixture<OwnerSmsTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OwnerSmsTemplateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerSmsTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
