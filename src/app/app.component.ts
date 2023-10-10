import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html"
})
export class AppComponent {
  menuItems: MenuItem[] = [
    { 
      label: 'Process Info',
      icon: 'pi pi-home', 
      routerLink: '/', 
    },
      { 
      label: 'File Stats',
      icon: 'pi pi-table', 
      routerLink: '/file-stats', 
    }
  ]
}
