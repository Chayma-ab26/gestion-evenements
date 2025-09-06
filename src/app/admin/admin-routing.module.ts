
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListCategoryComponent } from './category/list-category/list-category.component';
import { ListLocalComponent } from './local/list-local/list-local.component';
import { ListUsersComponent } from './users/list-users/list-users.component';
import { ListEventsComponent } from './events/list-events/list-events.component';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';

import { RoleGuard } from '../guard/role.guard';
const routes: Routes = [
  { path: 'dashboard', component: DashboardAdminComponent, canActivate: [RoleGuard], data: { roles: ['admin'] } },
  { path: 'category', component: ListCategoryComponent, canActivate: [RoleGuard], data: { roles: ['admin'] } },
  { path: 'local', component: ListLocalComponent, canActivate: [RoleGuard], data: { roles: ['admin'] } },
  { path: 'users', component: ListUsersComponent, canActivate: [RoleGuard], data: { roles: ['admin'] } },
  { path: 'events', component: ListEventsComponent, canActivate: [RoleGuard], data: { roles: ['admin'] } },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
