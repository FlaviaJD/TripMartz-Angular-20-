import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumericOnly]'
})
export class NumericOnlyDirective {

  constructor() { }

  @HostListener('input', ['$event']) onInputChange(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const numbersOnly = value.replace(/[^0-9]/g, '');
    if (numbersOnly !== value) {
      input.value = numbersOnly;
      input.dispatchEvent(new Event('input'));
    }
  }
}
