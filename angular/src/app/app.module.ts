import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JobsListingComponent } from './components/jobs-listing.component';
import { ApplicationFormComponent } from './components/application-form.component';
import { JobDetailsComponent } from './components/job-details.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MaterialModule } from './material/material.module';
import { HeaderComponent } from './nav-bars/header.component';
import { LoginComponent } from './login/login.component';
import { ViewService } from './service/view.service';
import { SignupComponent } from './login/signup.component';
import { JwtModule } from '@auth0/angular-jwt';
import { ApplicantSignupComponent } from './login/applicant-signup.component';
import { BusinessSignupComponent } from './login/business-signup.component';
import { SideNavComponent } from './nav-bars/side-nav.component';
import { SideNavListComponent } from './nav-bars/side-nav-list.component';
import { ApplicantComponent } from './components/applicant.component';
import { SubmitSuccessComponent } from './components/submit-success.component';
import { CreateJobComponent } from './employercomp/create-job.component';
import { BusinessComponent } from './employercomp/business.component';
import { SavedComponent } from './components/saved.component';
import { ListingService } from './service/listing.service';
import { ListingsComponent } from './employercomp/listings.component';
import { QuillModule } from 'ngx-quill';
import { BizHeaderComponent } from './nav-bars/biz-header.component';
import { ApplicantsComponent } from './employercomp/applicants.component';
import { BizProfileComponent } from './components/biz.profile.component';
import { AppProfileComponent } from './employercomp/app.profile.component';
import { MyProfileComponent } from './components/my-profile.component';
import { SuccessComponent } from './payment/success.component';
import { CancelComponent } from './payment/cancel.component';
import { EditProfileComponent } from './components/edit-profile.component';
import { PicEditComponent } from './components/pic-edit.component';
import { ResEditComponent } from './components/res-edit.component';
import { SearchBarComponent } from './employercomp/search-bar.component';
import { AppSearchComponent } from './employercomp/app-search.component';
import { ActiveUsersComponent } from './employercomp/active-users.component';
import { EditListingComponent } from './employercomp/edit-listing.component';
import { MatChipsModule } from '@angular/material/chips';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AddHistoryComponent } from './components/add-history.component';
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { EditHistComponent } from './components/edit-hist.component';
import { PromoteJobComponent } from './employercomp/promote-job.component';
import { BizPremiumComponent } from './employercomp/biz-premium.component';
import { SkillsSectionComponent } from './components/skills-section.component';
import { PremSearchComponent } from './employercomp/prem-search.component';
import { MatSelectModule } from '@angular/material/select';
import {LayoutModule} from "@angular/cdk/layout";

@NgModule({
  declarations: [
    AppComponent,
    JobsListingComponent,
    ApplicationFormComponent,
    JobDetailsComponent,
    HeaderComponent,
    LoginComponent,
    SignupComponent,
    ApplicantSignupComponent,
    BusinessSignupComponent,
    SideNavComponent,
    SideNavListComponent,
    ApplicantComponent,
    SubmitSuccessComponent,
    CreateJobComponent,
    BusinessComponent,
    SavedComponent,
    ListingsComponent,
    BizHeaderComponent,
    ApplicantsComponent,
    BizProfileComponent,
    AppProfileComponent,
    MyProfileComponent,
    SuccessComponent,
    CancelComponent,
    EditProfileComponent,
    PicEditComponent,
    ResEditComponent,
    SearchBarComponent,
    AppSearchComponent,
    ActiveUsersComponent,
    EditListingComponent,
    AddHistoryComponent,
    EditHistComponent,
    PromoteJobComponent,
    BizPremiumComponent,
    SkillsSectionComponent,
    PremSearchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    MatChipsModule,
    MatSelectModule,
    LayoutModule,
    QuillModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem("token"),
        allowedDomains: ["localhost:4200", "localhost:8080"]
      }
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    InfiniteScrollModule,
  ],
  providers: [ListingService, provideAnimationsAsync(),
    ViewService,
   ],
  bootstrap: [AppComponent]
})
export class AppModule { }
