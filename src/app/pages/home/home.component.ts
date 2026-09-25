import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';
import { Subject, fromEvent, debounceTime, takeUntil } from 'rxjs';
import { DataService } from '../../services/data.service';
import { Olympic, Indicator } from '../../models/olympic.model';
import { APP_CONSTANTS, getResponsiveAspectRatio } from '../../constants/app.constants';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  // Données
  olympicData: Olympic[] = [];
  headerIndicators: Indicator[] = [];
  pieChart!: Chart<'pie', number[], string>;

  // États
  loading: boolean = true;
  error: string | null = null;

  // Cleanup
  private destroy$ = new Subject<void>();

  constructor(
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();

    fromEvent(window, 'resize')
      .pipe(debounceTime(150), takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.pieChart) {
          this.pieChart.options.aspectRatio = getResponsiveAspectRatio(window.innerWidth);
          this.pieChart.resize();
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

    this.dataService
      .getOlympics()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: Olympic[]) => {
          if (data && data.length > 0) {
            this.olympicData = data;
            this.setupIndicators();
            this.buildPieChart();
            this.loading = false;
          } else {
            this.error = 'Aucune donnée disponible';
            this.loading = false;
          }
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
      {
        label: APP_CONSTANTS.NUMBER_OF_COUNTRIES,
        value: this.dataService.getTotalCountries(this.olympicData)
      },
      {
        label: APP_CONSTANTS.NUMBER_OF_JOS,
        value: this.dataService.getTotalJOs(this.olympicData)
      }
    ];
  }

  private buildPieChart(): void {
    // Attendre que le DOM soit prêt avant de créer le graphique
    setTimeout(() => {
      const chartData = this.dataService.getPieChartData(this.olympicData);
      const pieChart = new Chart('DashboardPieChart', {
        type: 'pie',
        data: {
          labels: chartData.labels,
          datasets: [
            {
              label: 'Medals',
              data: chartData.data,
              backgroundColor: APP_CONSTANTS.CHART_COLORS,
              hoverOffset: 4
            }
          ]
        },
        options: {
          aspectRatio: getResponsiveAspectRatio(window.innerWidth),
          onClick: (e) => {
            if (e.native) {
              const points = pieChart.getElementsAtEventForMode(
                e.native,
                'point',
                { intersect: true },
                true
              );
              if (points.length) {
                const firstPoint = points[0];
                const countryId = this.olympicData[firstPoint.index].id;
                this.router.navigate(['country', countryId]);
              }
            }
          }
        }
      });
      this.pieChart = pieChart;
    }, 100);
  }

  onRetry(): void {
    this.loadData();
  }
}

