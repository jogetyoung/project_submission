import { Component } from '@angular/core';
import { SideNavRoute } from '../models';

@Component({
  selector: 'app-applicant',
  templateUrl: './applicant.component.html',
  styleUrl: './applicant.component.css'
})
export class ApplicantComponent { 
  
  sideNavRoutes: SideNavRoute[] = [
    {route: 'listings', label: 'Listings', matIconName: 'home'},
    {route: 'applied', label: 'My Jobs', matIconName: 'work'},
    {route: 'my-profile', label: 'My Account', matIconName: 'account_box'},
  ]
}