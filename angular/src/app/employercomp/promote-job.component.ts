import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Job, JobStat } from '../models';
import { BizJobService } from '../service/biz.job.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-promote-job',
  templateUrl: './promote-job.component.html',
  styleUrl: './promote-job.component.css'
})
export class PromoteJobComponent {

  empForm!: FormGroup
  bizJobSvc = inject(BizJobService)
  snackBar = inject(MatSnackBar)

  constructor(private dialogRef: MatDialogRef<PromoteJobComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: JobStat) {
    this.empForm = this.formBuilder.group({
      id: [''],
      title: ['', Validators.required]
    })
  }

  ngOnInit(): void {
  }

  confirm(){
    this.bizJobSvc.updatePromoted(this.data).then(res => {
      if (res['isUpdated']) {
        this.snackBar.open("Successfully promoted!", "Dismiss", {
          duration: 5000
        })
        this.dialogRef.close()
      } else {
        this.snackBar.open("Something went wrong. Please try again in a few seconds.", "Dismiss", {
          duration: 5000
        })
      }
    })
  }

  close() {
    this.dialogRef.close() 
  }
  
}
