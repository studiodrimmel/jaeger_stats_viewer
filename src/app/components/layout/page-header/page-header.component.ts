import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [
      CommonModule,
      BreadcrumbModule
  ],
  templateUrl: './page-header.component.html'
})
export class PageHeaderComponent {
  @Input() pageName: string;

  home: MenuItem | undefined;
}
