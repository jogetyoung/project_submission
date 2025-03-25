import { Component, ElementRef, Inject, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProfileService } from '../service/profile.service';
import { Observable, map, of, startWith, switchMap } from 'rxjs';
import { Skill } from '../models';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-skills-section',
  templateUrl: './skills-section.component.html',
  styleUrl: './skills-section.component.css'
})
export class SkillsSectionComponent implements OnInit {

  skillsForm!: FormGroup
  skillsList!: Skill[]

  filteredOptions$!: Observable<Skill[]>;

  private profileSvc = inject(ProfileService)
  snackBar = inject(MatSnackBar)

  @ViewChild('countryInput') countryInput!: ElementRef
  selectedSkills: Skill[] = []

  separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(private dialogRef: MatDialogRef<SkillsSectionComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.skillsForm = this.formBuilder.group({
      id: [''], skill_name: ['']
    })
  }

  ngOnInit(): void {
    for (const skill of this.data) {
      this.selectedSkills.push(skill);
    }
    this.getListFromBack()
  }

  getListFromBack() {
    this.profileSvc.getSkillList().then(res => {
      this.skillsList = res

      this.filteredOptions$ = this.skillsForm.get('skill_name')!.valueChanges.pipe(startWith(''),
        map((fruit: string | null) => (fruit ? this._filter(fruit) : this.skillsList.slice())))
    })
  }

  private _filter(value: string): Skill[] {
    return this.skillsList.filter(skill => skill.skill_name.toLowerCase().includes(value));
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const selectedSkill: Skill = event.option.value;

    if (!this.selectedSkills.includes(selectedSkill)) {
      this.selectedSkills.push(selectedSkill);
    }

    this.countryInput.nativeElement.value = '';
    this.skillsForm.get('skill_name')?.setValue(null);
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      // Find the Skill object corresponding to the input value
      const selectedSkill = this.skillsList.find(skill => skill.skill_name === value);
      if (selectedSkill && !this.selectedSkills.includes(selectedSkill)) {
        this.selectedSkills.push(selectedSkill);
      }
    }

    event.chipInput!.clear();
    this.skillsForm.get('skill_name')?.setValue(null);
  }

  remove(fruit: Skill): void {
    const index = this.selectedSkills.indexOf(fruit);
    if (index >= 0) { this.selectedSkills.splice(index, 1); }
  }

  onSubmit() {
    let user = UserService.getUser()

    this.profileSvc.updateSkills(user['id'], this.selectedSkills).then(resp => {
      if (resp['isAdded']) {
        this.snackBar.open("Successfully updated profile!", "Dismiss", {
          duration: 5000
        })
      } else {
        this.snackBar.open("Something went wrong. Please try again in a few seconds.", "Dismiss", {
          duration: 5000
        })
      }
      this.dialogRef.close()
    })


  }

}