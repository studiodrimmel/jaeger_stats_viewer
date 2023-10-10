import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JaegerDataService } from 'src/app/services/jaeger-data.service';
import {  TableModule } from 'primeng/table';
import { FileStats } from 'src/app/types';
import { PageHeaderComponent } from 'src/app/components/layout/page-header/page-header.component';

@Component({
  selector: 'app-file-stats',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    PageHeaderComponent
  ],
  templateUrl: './file-stats.component.html'
})
export class FileStatsComponent implements OnInit {
  data: FileStats;

  constructor(public _jaeger: JaegerDataService) {}

  ngOnInit(): void {
    this._jaeger.getFileStats().subscribe(res => {
      this.data = res;
    });
  }
}
