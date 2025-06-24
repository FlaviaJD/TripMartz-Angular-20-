import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberToWords'
})
export class NumberToWordsPipe implements PipeTransform {

  transform(value: number): string {
    // Separate the integer and decimal parts
    const integerPart = Math.floor(value);
    const decimalPart = value - integerPart;

    // Convert the integer part to words
    let integerWords = this.convertToWords(integerPart);

    // Convert the decimal part to words
    let decimalWords = '';
    if (decimalPart > 0) {
      decimalWords = 'point ' + this.convertDecimalToWords(decimalPart);
    }

    // Concatenate integer and decimal words
    let result = integerWords;
    if (decimalWords !== '') {
      result += ' ' + decimalWords;
    }

    return result.trim();
  }

  private convertToWords(num: number): string {
    const words: string[] = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
      "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens: string[] = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    const scale: string[] = ["", "Thousand", "Million", "Billion", "Trillion"];

    if (num === 0) {
      return 'Zero';
    }

    let result: string = '';

    for (let i = 0; num > 0; i++) {
      if (num % 1000 !== 0) {
        result = this.helper(num % 1000, words, tens) + ' ' + scale[i] + ' ' + result;
      }
      num = Math.floor(num / 1000);
    }

    return result.trim();
  }

  private helper(num: number, words: string[], tens: string[]): string {
    if (num === 0) {
      return '';
    } else if (num < 20) {
      return words[num];
    } else if (num < 100) {
      return tens[Math.floor(num / 10)] + ' ' + words[num % 10];
    } else {
      return words[Math.floor(num / 100)] + ' Hundred ' + this.helper(num % 100, words, tens);
    }
  }
  private convertDecimalToWords(decimalPart: number): string {
    const decimalWords: string[] = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    // Round the decimal part to two decimal places
    const roundedDecimal = parseFloat(decimalPart.toFixed(2));

    // Convert the rounded decimal part to a string to process each digit individually
    const decimalAsString = roundedDecimal.toFixed(2).split('.')[1];

    let result = '';
    for (let i = 0; i < decimalAsString.length; i++) {
        const digit = parseInt(decimalAsString[i]);
        result += decimalWords[digit] + ' ';
    }

    return result.trim();
}

}
