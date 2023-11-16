import { Pipe, PipeTransform } from '@angular/core';
import { Ranking } from 'src/app/types';

@Pipe({
  name: 'sortChartsByRanking',
  standalone: true
})
export class SortChartsByRankingPipe implements PipeTransform {

  transform(charts: any[], ranking: Ranking) {
    return charts?.sort((a, b) => (a.metric === ranking?.value && -1) || (b.metric === ranking?.value && 1) || 0);
  }

}
