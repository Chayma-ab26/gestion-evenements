import { HeaderComponent } from './../header/header.component';
import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
   standalone: true,
    imports: [FooterComponent,HeaderComponent],
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

}
