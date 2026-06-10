import {
  Component,
  Input,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';

declare const AlbumCoverContainer: any;

@Component({
  selector: 'album-cover-container',
  template: `<div #mount></div>`,
})
export class AlbumCoverContainerComponent implements AfterViewInit, OnDestroy {
  @Input() imageUrl!: string;
  @Input() width: number = 300;
  @Input() height: number = 420;
  @Input() padding: number = 10;
  @Input() borderRadius: number = 0;
  @Input() gradientIntensity: number = 10;

  @ViewChild('mount') mountRef!: ElementRef<HTMLDivElement>;

  private _instance: any = null;

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
  }
}
