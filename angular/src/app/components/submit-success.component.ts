import { AfterViewInit, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-submit-success',
  templateUrl: './submit-success.component.html',
  styleUrl: './submit-success.component.css'
})
export class SubmitSuccessComponent implements AfterViewInit {

  router = inject(Router)

  ngAfterViewInit(): void {
      setTimeout(() => {
        this.router.navigate(['/applicant/listings']);
      }, 3000);
  }

}
