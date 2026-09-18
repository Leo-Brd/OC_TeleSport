import { Component, Input } from '@angular/core';
import { Indicator } from '../../models/olympic.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() title: string = '';
  @Input() indicators: Indicator[] = [];
}
