import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { ClipboardModule, Clipboard } from '@angular/cdk/clipboard';
import { combineLatest, filter, switchMap, take } from "rxjs";

import mermaid from 'mermaid';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { JaegerDataService } from "src/app/services/jaeger-data.service";
import { MERMAID_CONFIG } from "../../dashboard.constants";
import { DashboardService } from "../../dashboard.service";


@Component({
    standalone: true,
    selector: 'app-visualization-dialog',
    templateUrl: './visualization-dialog.component.html',
    imports: [
        CommonModule,
        ButtonModule,
        DialogModule,
        ClipboardModule,
        ToastModule
    ],
    styles: [`
        .visualize-button {
            transform: translateX(-50%);
            bottom: 1rem;
        }
  `],
  providers: [MessageService]
})
export class VisualizationDialogComponent implements AfterViewInit {
    @ViewChild('mermaid') mermaidElement: ElementRef

    isOpen = false;
    graphDefinition: string;
    // pzoom: typeof panzoom | undefined;
    
    constructor(
        public readonly _dashboard: DashboardService,
        private readonly _jaeger: JaegerDataService,
        private readonly _clipboard: Clipboard,
        private readonly _message: MessageService
    ) {}

    ngAfterViewInit(): void {
        mermaid.initialize(MERMAID_CONFIG);
    }

    public openDialog() {
        this.isOpen = true;
        this.fetchMermaidGraphData();
    }

    public copyGraphDefinition() {
        this._clipboard.copy(this.graphDefinition);
        this._message.add({ severity: 'success', summary: 'Copied!', detail: 'Graph definition copied to your clipboard.' });
    }

    private fetchMermaidGraphData() {
        combineLatest([
            this._dashboard.selectedProcess$,
            this._dashboard.selectedRelatedProcess$
        ]).pipe(
            take(1),
            filter(([mainProcess, relatedProcess]) => !!mainProcess?.key && !!relatedProcess?.key),
            switchMap(([mainProcess, relatedProcess]) => this._jaeger.getMermaidDiagram(
                mainProcess?.key as string,
                relatedProcess?.key as string,
                false
            )),
        ).subscribe(graphDefinition => {
            this.graphDefinition = graphDefinition;
            this.updateMermaidGraph(graphDefinition);
        })
    }

    async updateMermaidGraph(graphDefinition: string) {
        const { svg } = await mermaid.render('graphDiv', graphDefinition);
        this.mermaidElement.nativeElement.innerHTML = svg;
    }
}
