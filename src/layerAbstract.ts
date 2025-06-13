import P5 from "p5";
import type { Controller } from "./controller";
import { ControlledObject } from "./controllerObject";

export abstract class LayerAbstract extends ControlledObject {

    protected _ready: boolean = false;
    public get ready() { return this._ready; }

    protected _show: boolean = true;
    public get show() { return this._show; }

    protected get black() {
        return this.layers.black;
    }

    

    /** The final render canvas that is allways outputted into combined */
    protected render!: P5.Graphics;

    /** The actual image will be rendered here in order to scale it up */
    protected prerender!: P5.Graphics;

    constructor(
        controller: Controller,
        public readonly outputTint: P5.Color,
        protected readonly width: number,
        protected readonly height: number
    ) {
        super( controller );

        this.prerender = this.p5.createGraphics( this.mapping.output.width, this.mapping.output.height, this.p5.WEBGL );

        this.render = this.p5.createGraphics( this.mapping.output.width, this.mapping.output.height, this.p5.WEBGL );

        this._ready = true;

    }

    protected renderInputToOutput(
        image: P5.Image|P5.Element
    ) {

        if ( !this.controller.shader ) {
            this.log( "Shader ještě není" );
            return;
        }

        this.render.push();

        this.render.imageMode( this.p5.CENTER );
        this.render.rectMode( this.p5.CENTER );
        this.render.blendMode( this.p5.BLEND );

        this.render.tint( this.outputTint );

        this.render.image( image, 0, 0, this.render.width, this.render.height );

        this.render.filter( this.p5.GRAY );

        this.render.pop();

        return;

    }

    public abstract update(): void;

    public abstract doRender(): void;

    public setShow(
        value: boolean
    ) {
        this._show = value;
    }

    public drawToCombined() {

        if ( this.show && this.ready && this.controller.shader) {

            this.layers.combined.image( 
                this.render, 
                0,
                0,
                this.layers.combined.width, 
                this.layers.combined.height 
            );

            this.debug( "Drawn to combined", this.render.width );
        }

    }

}