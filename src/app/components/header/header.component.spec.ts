import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { Indicator } from '../../models/olympic.model';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display title', () => {
    component.title = 'Test Title';
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('.center div');
    expect(element.textContent).toBe('Test Title');
  });

  it('should display indicators', () => {
    const testIndicators: Indicator[] = [
      { label: 'Label 1', value: 10 },
      { label: 'Label 2', value: 20 }
    ];
    component.indicators = testIndicators;
    fixture.detectChanges();
    const indicatorElements = fixture.nativeElement.querySelectorAll('.split > div');
    expect(indicatorElements.length).toBe(2);
  });
});
