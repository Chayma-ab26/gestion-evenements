import { Component } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.css'
})
export class DashboardAdminComponent {

}
