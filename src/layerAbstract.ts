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

    protected render!: P5.Graphics;

    /** The actual image will be rendered here in order to scale it up */
    protected prerender!: P5.Graphics;

    protected black: P5.Graphics;

    constructor(
        controller: Controller,
        public readonly outputTint: string,
        protected readonly width: number,
        protected readonly height: number
    ) {
        super( controller );

        this._graphics = this.p5.createGraphics( width, height );

        this.prerender = this.p5.createGraphics( this.mapping.output.width, this.mapping.output.height, this.p5.WEBGL );

        this.render = this.p5.createGraphics( this.mapping.output.width, this.mapping.output.height, this.p5.WEBGL );

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

        if ( !this.controller.shader ) {
            this.log( "Shader ještě není" );
            return;
        }

        this.prerender.imageMode( this.p5.CENTER );


        this.prerender.image( image, 0, 0, this.prerender.width, this.prerender.height );

        this.prerender.filter( this.p5.GRAY );

        this.render.blendMode( this.p5.BLEND );
        // this.render.tint( 255, 255 );

        this.render.imageMode( this.p5.CENTER );
        this.render.rectMode( this.p5.CENTER );

        this.render.filter( this.p5.BLUR, 2 );


        this.render.push();

        this.render.blendMode( this.p5.MULTIPLY );

        this.render.fill( 0, 10 );
        this.render.rect( 0, 0, this.render.width, this.render.height );

        this.render.blendMode( this.p5.LIGHTEST );

        this.render.tint( this.outputTint );

        this.render.image( this.prerender, 0, 0, this.render.width, this.render.height );

        this.render.pop();




        return;


        const shader = this.controller.shader;

        this.render.shader( shader );

        shader.setUniform( "currentFrame", this.render );
        shader.setUniform( "newFrame", this.prerender );

        shader.setUniform("threshold", 0.5);
        shader.setUniform( "smokeColor", [ 1.0, 1.0, 1.0 ] );
        shader.setUniform( "alpha", 0.5 );
        shader.setUniform("blurAmount", 10 / this.render.width); // nebo jiná vhodná hodnota

        

        // this.render.stroke( 255, 0, 255 );
        // this.render.fill( 255, 0, 0, 0 );

        this.render.rectMode( this.p5.CENTER );

        this.render.rect( 
            0, //-this.render.width/2, 
            0, //this.render.height/2, 
            this.render.width, 
            this.render.height 
        );

        this.render.resetShader();

        /*

        this.render.fill( 255, 0, 255);
        
        this.render.rect( 
            0, //-this.render.width/2, 
            0, //this.render.height/2, 
            this.render.width, 
            this.render.height 
        );

        */
        
        

        this.debug( "Drawn into the renderCanvas", this.render.width );

        this.debug( "Drawn into the prerender", this.prerender.width );



        // this.graphics.fill(0);

        // this.graphics.rect(0,0, this.graphics.width, this.graphics.height);

        
        // this.graphics.image( image, 0, 0, image.width, image.height );

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

        if ( this.show && this.ready && this.controller.shader) {

            // this.layers.combined.imageMode( this.p5.CORNER );

            // this.layers.combined.blendMode( this.p5.ADD );

            // this.layers.combined.tint( this.outputTint );

            this.layers.combined.imageMode( this.p5.CORNER );

            this.layers.combined.image( 
                this.render, 
                0,//this.layers.combined.width / -2, 
                0,//this.layers.combined.height / -2, 
                this.layers.combined.width, 
                this.layers.combined.height 
            );

            this.debug( "Drawn to combined", this.render.width );
        }

    }

}