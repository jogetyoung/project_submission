import {Component, inject} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-cancel',
  templateUrl: './cancel.component.html',
  styleUrl: './cancel.component.css'
})
export class CancelComponent {

  private router = inject(Router);

  goBack() {
    // Navigate back to the premium subscription page
    this.router.navigate(['/business/premium']);
  }

  tryAgain() {
    // Return to previous page in history
    window.history.back();

  }

}
