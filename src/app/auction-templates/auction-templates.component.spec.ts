import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionTemplatesComponent } from './auction-templates.component';

describe('AuctionTemplatesComponent', () => {
  let component: AuctionTemplatesComponent;
  let fixture: ComponentFixture<AuctionTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuctionTemplatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
