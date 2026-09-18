import { provideHttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { CountryComponent } from "./pages/country/country.component";
import { HeaderComponent } from './components/header/header.component';
import { DataService } from './services/data.service';

@NgModule({
  declarations: [AppComponent, HomeComponent, NotFoundComponent, CountryComponent, HeaderComponent],
  imports: [BrowserModule, CommonModule, AppRoutingModule],
  providers: [provideHttpClient(), DataService],
  bootstrap: [AppComponent],
})
export class AppModule {}
