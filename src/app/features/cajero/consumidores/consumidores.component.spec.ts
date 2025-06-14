import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumidoresComponent } from './consumidores.component';

describe('ConsumidoresComponent', () => {
  let component: ConsumidoresComponent;
  let fixture: ComponentFixture<ConsumidoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsumidoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsumidoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
