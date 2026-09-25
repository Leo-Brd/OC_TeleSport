import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Chart from 'chart.js/auto';
import { Subject, fromEvent, debounceTime, switchMap, takeUntil } from 'rxjs';
import { DataService } from '../../services/data.service';
import { Olympic, Indicator } from '../../models/olympic.model';
import { APP_CONSTANTS, getResponsiveAspectRatio } from '../../constants/app.constants';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit, OnDestroy {
  lineChart!: Chart<'line', number[], number>;
  titlePage: string = '';
  totalEntries: number = 0;
  totalMedals: number = 0;
  totalAthletes: number = 0;
  headerIndicators: Indicator[] = [];

  loading: boolean = true;
  error: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.loadData();

    fromEvent(window, 'resize')
      .pipe(debounceTime(150), takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.lineChart) {
          this.lineChart.options.aspectRatio = getResponsiveAspectRatio(window.innerWidth);
          this.lineChart.resize();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadData(): void {
    this.loading = true;
    this.error = null;

    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          const id = Number(params.get('id'));
          return this.dataService.getOlympics().pipe(
            switchMap((data: Olympic[]) => [{ data, id }])
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: ({ data, id }) => {
          const selectedCountry = this.dataService.getCountryById(data, id);

          if (!selectedCountry) {
            this.router.navigate(['not-found']);
            return;
          }

          this.titlePage = selectedCountry.country;
          this.totalEntries = selectedCountry.participations.length;
          this.totalMedals = this.dataService.getTotalMedals(selectedCountry.participations);
          this.totalAthletes = this.dataService.getTotalAthletes(selectedCountry.participations);
          this.setupIndicators();
          this.buildChart(selectedCountry);
          this.loading = false;
        },
        error: (err: HttpErrorResponse) => {
          this.error = 'Erreur lors du chargement des données';
          this.loading = false;
          console.error('Erreur:', err);
        }
      });
  }

  private setupIndicators(): void {
    this.headerIndicators = [
      { label: APP_CONSTANTS.NUMBER_OF_ENTRIES, value: this.totalEntries },
      { label: APP_CONSTANTS.TOTAL_MEDALS, value: this.totalMedals },
      { label: APP_CONSTANTS.TOTAL_ATHLETES, value: this.totalAthletes }
    ];
  }

  private buildChart(country: Olympic): void {
    setTimeout(() => {
      const chartData = this.dataService.getLineChartData(country);
      const lineChart = new Chart('countryChart', {
        type: 'line',
        data: {
          labels: chartData.labels,
          datasets: [
            {
              label: 'medals',
              data: chartData.data,
              backgroundColor: '#0b868f'
            }
          ]
        },
        options: {
          aspectRatio: getResponsiveAspectRatio(window.innerWidth)
        }
      });
      this.lineChart = lineChart;
    }, 100);
  }

  onRetry(): void {
    this.loadData();
  }
}
