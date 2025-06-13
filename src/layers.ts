import P5 from "p5";
import type { Controller } from "./controller";
import { ControlledObject } from "./controllerObject";
import { LayerRecording } from "./layerRecording";
import { LayerStream } from "./layerStream";

export class Layers extends ControlledObject {

    protected _ready: boolean = false;
    public get ready() { return this._ready; }

    static color: string = "green";

    private _recording!: LayerRecording;
    public get recording() {
        if (!this._recording) throw new Error("trying to access the recording before its initialisation");
        return this._recording;
    }

    public readonly black: P5.Graphics;


    private _stream!: LayerStream;
    public get stream() {
        if (!this._stream) throw new Error("trying to access the stream before its initialisation");
        return this._stream;
    }

    private _combined!: P5.Graphics;
    public get combined() {
        if (!this._combined) {
            throw new Error("Accessing combined canvas before its initialisation");
        }
        return this._combined;
    }

    constructor(
        controller: Controller
    ) {
        super(controller);
        this.black = this.p5.createGraphics(
            this.mapping.output.width, 
            this.mapping.output.height
        );
        this.black.background(0);
        // this.black.id( "black" );
    }


    init(
        inputWidth: number,
        outputWidth: number
    ) {

        if (this._ready) {
            return;
        }

        this._combined = this.p5.createGraphics(
            this.mapping.output.width, 
            this.mapping.output.height,
            this.p5.WEBGL
        );

        this._recording = new LayerRecording(this.controller, this.p5.color( 255, 255, 0 ), inputWidth, outputWidth);
        this._stream = new LayerStream(this.controller, this.p5.color( 0, 255, 255 ), inputWidth, outputWidth);

        this._ready = true;

        this.log("Initialised", this);

    }


    update() {
        if (this.ready === true) {
            this.stream.update();
            this.recording.update();
        }
    }

    combine() {
        if (this.ready === true) {

            this.combined.blendMode(this.p5.BLEND);
            this.combined.imageMode( this.p5.CENTER );
            this.combined.rectMode( this.p5.CENTER );

            // Render the overlay over the previous frame
            this.combined.blendMode( this.p5.MULTIPLY );
            this.combined.fill( 0, 50 );
            this.combined.rect( 0, 0, this.combined.width, this.combined.height );

            // Blur the previous state
            this.combined.filter( this.p5.BLUR, 3 );

            // Start drawing layers

            
            this.stream.doRender();
            this.recording.doRender();

            const renderMode = this.p5.SCREEN;
            
            this.combined.blendMode( renderMode );
            this.stream.drawToCombined();
            this.combined.blendMode( renderMode );
            this.recording.drawToCombined();

            // this.combined.pop();

        }
    }

    draw() {
        if (this.ready === true) {

            this.p5.image(
                this.combined, 
                -this.mapping.output.width / 2,
                -this.mapping.output.height / 2, 
                this.mapping.output.width, 
                this.mapping.output.height
            );

        }
    }




}