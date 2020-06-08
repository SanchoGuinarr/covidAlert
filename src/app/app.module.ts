import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ContactsComponent } from './contacts/contacts.component';
import { ActivitiesComponent } from './activities/activities.component';
import { ContactEditComponent } from './contact-edit/contact-edit.component';
import {HttpClientModule} from "@angular/common/http";
import {MatIconModule} from "@angular/material/icon";
import {MatChipsModule} from "@angular/material/chips";
import { MeasuresEditComponent } from './measures-edit/measures-edit.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {ReactiveFormsModule} from "@angular/forms";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatListModule} from "@angular/material/list";
import {MatSliderModule} from "@angular/material/slider";
import {MatRadioModule} from "@angular/material/radio";
import {MatInputModule} from "@angular/material/input";
import {MatTableModule} from "@angular/material/table";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatCardModule} from "@angular/material/card";
import {MatTooltipModule} from "@angular/material/tooltip";
import { InfoComponent } from './info/info.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ContactsComponent,
    ActivitiesComponent,
    ContactEditComponent,
    MeasuresEditComponent,
    InfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NoopAnimationsModule,
    HttpClientModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatListModule,
    MatFormFieldModule,
    MatSliderModule,
    MatRadioModule,
    MatInputModule,
    MatTableModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatCardModule,
    MatTooltipModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
