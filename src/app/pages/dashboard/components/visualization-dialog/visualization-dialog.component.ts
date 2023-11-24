import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { ClipboardModule, Clipboard } from '@angular/cdk/clipboard';
import { combineLatest, filter, switchMap, take, tap } from "rxjs";
import { FormsModule } from '@angular/forms'

//@ts-ignore
import panzoom from 'svg-pan-zoom';
import mermaid from 'mermaid';

import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { SelectButtonModule } from 'primeng/selectbutton';

import { JaegerDataService } from "src/app/services/jaeger-data.service";
import { MERMAID_CONFIG } from "../../dashboard.constants";
import { DashboardService } from "../../dashboard.service";
import { MermaidGraphScope } from "../../enums";


@Component({
    standalone: true,
    selector: 'app-visualization-dialog',
    templateUrl: './visualization-dialog.component.html',
    imports: [
        CommonModule,
        ButtonModule,
        DialogModule,
        ClipboardModule,
        ToastModule,
        SelectButtonModule,
        FormsModule,
        DropdownModule
    ],
    styles: [`
        .visualize-button {
            transform: translateX(-50%);
            bottom: 1rem;
        }
        .mermaid {
            height: 45rem;
        }
        ::ng-deep #graphDiv {
            height: 100%;
            max-width: 100%;
        }
  `],
  providers: [MessageService]
})
export class VisualizationDialogComponent implements AfterViewInit {
    @ViewChild('mermaid', { static: false }) mermaidElement: ElementRef

    isOpen = false;
    graphDefinition: string;
    pzoom: typeof panzoom | undefined;

    isCompact = false;
    compactOptions: any[] = [{label: 'Full view', value: false}, {label: 'Compact', value: true}];
    
    scope = MermaidGraphScope.FULL
    scopeOptions: any[] = [
        {label: 'Full', value: MermaidGraphScope.FULL}, 
        {label: 'Centered', value: MermaidGraphScope.CENTERED},
        {label: 'Inbound', value: MermaidGraphScope.INBOUND},
        {label: 'Outbound', value: MermaidGraphScope.OUTBOUND},
    ];

    constructor(
        public readonly _dashboard: DashboardService,
        private readonly _jaeger: JaegerDataService,
        private readonly _clipboard: Clipboard,
        private readonly _message: MessageService
    ) {}

    ngAfterViewInit(): void {
        mermaid.initialize(MERMAID_CONFIG);
    }

    onClosingDialog() {
        this.mermaidElement.nativeElement.innerHTML = '';
    }

    public openDialog() {
        this.isOpen = true;
        this.fetchMermaidGraphData();
    }

    public copyGraphDefinition() {
        this._clipboard.copy(this.graphDefinition);
        this._message.add({ severity: 'success', summary: 'Copied!', detail: 'Graph definition copied to your clipboard.' });
    }

    fetchMermaidGraphData() {
        combineLatest([
            this._dashboard.selectedProcess$,
            this._dashboard.selectedRelatedProcess$
        ]).pipe(
            take(1),
            switchMap(([mainProcess, relatedProcess]) => this._jaeger.getMermaidDiagram(
                mainProcess?.key as string,
                relatedProcess?.key ?? null,
                this.scope,
                this.isCompact
            )),
        ).subscribe(graphDefinition => {
            this.graphDefinition = graphDefinition;
            this.updateMermaidGraph(graphDefinition);
        })
    }

    private async updateMermaidGraph(graphDefinition: string) {
        this.mermaidElement.nativeElement.innerHTML = '';
        const { svg, bindFunctions } = await mermaid.render('graphDiv', graphDefinition, this.mermaidElement.nativeElement);
        this.mermaidElement.nativeElement.innerHTML = svg;
        this.initZoom();

        if (bindFunctions) {
            bindFunctions(this.mermaidElement.nativeElement);
        }
    }

    private initZoom() {
        this.pzoom?.destroy();

        void Promise.resolve().then(() => {
            const graphDiv = document.getElementById('graphDiv');
            if (!graphDiv) {
              return;
            }
            this.pzoom = panzoom(graphDiv, {
              controlIconsEnabled: true,
              contain: true,
              center: true,
              zoomScaleSensitivity: 0.4
            });
          });
    }
}
