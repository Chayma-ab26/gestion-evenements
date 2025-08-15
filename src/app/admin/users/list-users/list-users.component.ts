import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../header/header.component';
import { FooterComponent } from '../../../footer/footer.component';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-users',
  standalone: true,
  imports: [FooterComponent, HeaderComponent, CommonModule, HttpClientModule, FormsModule],
  templateUrl: './list-users.component.html',
  styleUrl: './list-users.component.css'
})
export class ListUsersComponent implements OnInit {

  listusers: any[] = [];
  filteredUsers: any[] = [];
  selectedRole: string = 'all';
  roles: string[] = ['all', 'ADMIN', 'PARTICIPANT', 'ORGANISATEUR'];

  constructor(private service: UserService, private router: Router) { }

  ngOnInit(): void {
    this.allmyusersfromback()
  }

  allmyusersfromback() {
    this.service.getAll().subscribe(
      (res: any) => {
        console.log("**liste de users** : ",res)
        this.listusers = res;
        this.filterUsers();
      }, (error: any) => { console.log("error") }
    )
  }

  filterUsers() {
    if (this.selectedRole === 'all') {
      this.filteredUsers = this.listusers;
    } else {
      this.filteredUsers = this.listusers.filter(user => user.role === this.selectedRole);
    }
  }

  onRoleChange() {
    this.filterUsers();
  }

  viewUser(id: String) {
    Swal.fire({
      title: 'Do you want to view details?',
      text: "This will fetch the details for this user.",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085D6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, show me!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.getById(id).subscribe(
          (res: any) => {
            console.log('Fetched data:', res);
            Swal.fire({
              title: 'User Details',
              html: `
                <div style="text-align: left;">
                  <strong>ID:</strong> ${res.id}<br>
                  <strong>Username:</strong> ${res.username}<br>
                  <strong>Email:</strong> ${res.email}<br>
                  <strong>First Name:</strong> ${res.firstname}<br>
                  <strong>Last Name:</strong> ${res.lastname}<br>
                  <strong>Role:</strong> <span class="badge badge-${this.getRoleBadgeClass(res.role)}">${res.role}</span><br>
                  <strong>Phone:</strong> ${res.phone || 'N/A'}<br>
                  <strong>Photo:</strong> ${res.photo || 'N/A'}
                </div>
              `,
              icon: 'info'
            });
          },
          (error: any) => {
            console.error("Error fetching data", error);
            Swal.fire('Error', 'Could not fetch user data.', 'error');
          }
        );
      }
    });
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'ADMIN': return 'danger';
      case 'ORGANISATEUR': return 'warning';
      case 'PARTICIPANT': return 'success';
      default: return 'secondary';
    }
  }

  getRoleDisplayName(role: string): string {
    switch (role) {
      case 'ADMIN': return 'Administrator';
      case 'ORGANISATEUR': return 'Organizer';
      case 'PARTICIPANT': return 'Participant';
      default: return role;
    }
  }
}
