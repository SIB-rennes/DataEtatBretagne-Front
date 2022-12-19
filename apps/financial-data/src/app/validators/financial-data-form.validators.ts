import {
  AbstractControl,
  FormControl,
  FormGroupDirective,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

/**
 * Custom validators du formulaire
 * @returns
 */
export function financialDataFormValidators(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const theme = value.theme;
    const bops = value.bops;

    if (theme == null && bops == null) {
      return { bopRequired: true };
    }

    return null;
  };
}

/** Error when the parent is invalid */
export class CrossFieldErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective): boolean {
    if (control == null || form.invalid == null || form.errors == null)
      return false;

    return control.touched && form.errors['bopRequired'];
  }
}
