import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Olympic, Participation } from '../models/olympic.model';
import { APP_CONSTANTS } from '../constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  constructor(private http: HttpClient) { }

  /**
   * Récupère la liste complète des pays et leurs participations
   */
  getOlympics(): Observable<Olympic[]> {
    return this.http.get<Olympic[]>(APP_CONSTANTS.OLYMPIC_DATA_URL);
  }

  /**
   * Calcule le nombre total de pays
   */
  getTotalCountries(data: Olympic[]): number {
    return data.length;
  }

  /**
   * Calcule le nombre total d'éditions des Jeux Olympiques
   */
  getTotalJOs(data: Olympic[]): number {
    const allYears = data
      .flatMap(country => country.participations.map(p => p.year));
    return new Set(allYears).size;
  }

  /**
   * Récupère un pays par son ID
   */
  getCountryById(data: Olympic[], id: number): Olympic | undefined {
    return data.find(country => country.id === id);
  }

  /**
   * Calcule le nombre total de médailles pour un pays
   */
  getTotalMedals(participations: Participation[]): number {
    return participations.reduce((acc, p) => acc + p.medalsCount, 0);
  }

  /**
   * Calcule le nombre total d'athlètes pour un pays
   */
  getTotalAthletes(participations: Participation[]): number {
    return participations.reduce((acc, p) => acc + p.athleteCount, 0);
  }

  /**
   * Récupère les données pour un graphique pie (pays et totaux de médailles)
   */
  getPieChartData(data: Olympic[]): { labels: string[]; data: number[] } {
    const labels = data.map(c => c.country);
    const medalTotals = data.map(c => this.getTotalMedals(c.participations));
    return { labels, data: medalTotals };
  }

  /**
   * Récupère les données pour un graphique ligne (années et médailles par pays)
   */
  getLineChartData(country: Olympic): { labels: number[]; data: number[] } {
    const labels = country.participations.map(p => p.year);
    const data = country.participations.map(p => p.medalsCount);
    return { labels, data };
  }
}
