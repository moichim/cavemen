import P5 from "p5";
import type { Controller } from "./controller";
import { ControlledObject } from "./controllerObject";

export abstract class LayerAbstract extends ControlledObject {

    protected _ready: boolean = false;
    public get ready() { return this._ready; }

    protected _show: boolean = true;
    public get show() { return this._show; }

    private _graphics!: P5.Graphics;
    public get graphics(): P5.Graphics {
        if ( !this._graphics ) { throw new Error( "Layer graphics accessed before initialisation" ) }
        return this._graphics;
    }

    protected black: P5.Graphics;

    constructor(
        controller: Controller,
        public readonly outputTint: string,
        protected readonly width: number,
        protected readonly height: number
    ) {
        super( controller );

        this._graphics = this.p5.createGraphics( width, height );
        this.black = this.p5.createGraphics( width, height );
        this.black.fill(0);
        this.black.rect(0,0,width,height);

        this._ready = true;

    }

    protected drawInternal(
        image: P5.Image|P5.Element
    ) {

        if ( !this._graphics ) {
            this.log( "Grafika ještě není!" );
            return;
        }

        this.graphics.fill(0);

        this.graphics.rect(0,0, this.graphics.width, this.graphics.height);

        
        this.graphics.image( image, 0, 0, image.width, image.height );

        // this.graphics.filter( this.p5.GRAY );

    }

    public abstract processStream(): void;

    public abstract getCurrentImage(): P5.Image|P5.Graphics;

    public setShow(
        value: boolean
    ) {
        this._show = value;
    }

    public drawToCombined() {

        if ( this.show && this.ready) {

            this.layers.combined.blendMode( this.p5.ADD );

            // this.layers.combined.tint( this.outputTint );

            this.layers.combined.image( this.getCurrentImage(), 0, 0, this.width, this.height );
        }

    }

}