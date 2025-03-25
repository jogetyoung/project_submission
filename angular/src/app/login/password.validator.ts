import { AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export const passwordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value

  if (!value) {
    return null
  }

  const hasUpperCase = /[A-Z]+/.test(value)

  const hasLowerCase = /[a-z]+/.test(value)

  const hasNumeric = /[0-9]+/.test(value)

  if (hasUpperCase && hasLowerCase && hasNumeric) {
    return null
  }

  return {
    noUppercase: !hasUpperCase,
    noLowercase: !hasLowerCase,
    noNumeric: !hasNumeric
  }

}
