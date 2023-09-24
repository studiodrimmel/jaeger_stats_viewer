import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JaegerChartComponent } from './jaeger-chart.component';

describe('JaegerChartComponent', () => {
  let component: JaegerChartComponent;
  let fixture: ComponentFixture<JaegerChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JaegerChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JaegerChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
