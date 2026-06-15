import {
  Component,
  Input,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

declare const AlbumCoverContainer: any;

@Component({
  selector: 'album-cover-container',
  template: `<div #mount></div>`,
})
export class AlbumCoverContainerComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() imageUrl!: string;
  @Input() width: number = 300;
  @Input() height: number = 420;
  @Input() padding: number = 10;
  @Input() borderRadius: number = 0;
  @Input() gradientIntensity: number = 10;

  @ViewChild('mount') mountRef!: ElementRef<HTMLDivElement>;

  private _instance: any = null;
  private _initialized = false;

  ngAfterViewInit(): void {
    this._initialized = true;
    this._render();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this._initialized) {
      this._render();
    }
  }

  ngOnDestroy(): void {
    this._destroy();
  }

  private _render(): void {
    this._destroy();
    this._instance = new AlbumCoverContainer(this.imageUrl, {
      width: this.width,
      height: this.height,
      padding: this.padding,
      borderRadius: this.borderRadius,
      gradientIntensity: this.gradientIntensity,
    });
    this.mountRef.nativeElement.appendChild(this._instance.render());
  }

  private _destroy(): void {
    if (this._instance) {
      this._instance.destroy();
      this._instance = null;
    }
  }
}
