import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Custom validators du formulaire chorus
 * @returns
 */
export function chorusFormValidators(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const theme = value.theme;
    const bop = value.bop;

    if (theme == null && bop == null) {
      return { bopRequired: true };
    }

    return null;
  };
}
