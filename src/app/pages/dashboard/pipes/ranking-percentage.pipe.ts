import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rankingPercentage',
  standalone: true
})
export class RankingPercentagePipe implements PipeTransform {

  transform(digit: number): number | string {
    return digit.toLocaleString('nl', { style: 'percent', minimumFractionDigits: 1 })
  }

}
