import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {ActivitiesComponent} from "./activities/activities.component";
import {ContactsComponent} from "./contacts/contacts.component";
import {ContactEditComponent} from "./contact-edit/contact-edit.component";
import {MeasuresEditComponent} from "./measures-edit/measures-edit.component";
import {InfoComponent} from "./info/info.component";


const routes: Routes = [
  { path: '',   redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'activities', component: ActivitiesComponent },
  { path: 'contacts', component: ContactsComponent },
  { path: 'contact-edit/:id', component: ContactEditComponent },
  { path: 'measures', component: MeasuresEditComponent },
  { path: 'info', component: InfoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
