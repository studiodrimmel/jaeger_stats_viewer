import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rankingPercentage',
  standalone: true
})
export class RankingPercentagePipe implements PipeTransform {

  transform(digit: number): number | string {
    console.log(digit)
    // if (digit === -1000) return digit;

    console.log(digit);
    
    return digit.toLocaleString('nl', { style: 'percent', minimumFractionDigits: 1 })
  }

}
