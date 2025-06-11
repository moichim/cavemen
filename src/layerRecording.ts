import P5 from "p5";
import { LayerAbstract } from "./layerAbstract";
import type { Controller } from "./controller";

enum RecordingMode {
    IDLE,
    RECORDING,
    PLAYING
}

export class LayerRecording extends LayerAbstract {

    static color: string = "violet";

    protected mode: RecordingMode = RecordingMode.IDLE;

    protected buffer: P5.Image[] = [];

    protected maxBufferSize: number = 10 * 60;

    protected isKeyDown: boolean = false;

    protected pointer: number = 0;

    constructor(
        controller: Controller,
        outputTint: string,
        width: number,
        height: number
    ) {
        super(controller, outputTint, width, height);

        this.p5.keyPressed = () => {

            if ( this.p5.key === "ArrowDown" && !this.isKeyDown ) {
                this.isKeyDown = true;
                this.recordingStart();
            }

            if ( this.p5.key === "ArrowUp" && !this.isKeyDown ) {
                this.isKeyDown = true;
                this.playingStart();
            }

        }

        this.p5.keyReleased = () => {
            this.isKeyDown = false;
        }

    }


    public processStream(): void {

        if ( this.mode === RecordingMode.RECORDING ) {
            this.drawInternal(this.capture.video);

            // Nyní se z graphics uloží obraz do bufferu
            const img = this.graphics.get( 0, 0, this.graphics.width, this.graphics.height );
            this.buffer.push( img );

            if ( this.buffer.length >= this.maxBufferSize ) {
                this.recordingStop();
            }

        }

    }

    public getCurrentImage() {

        if ( this.mode === RecordingMode.IDLE ) {
            return this.black;
        } else if ( this.mode === RecordingMode.RECORDING ) {
            return this.graphics;
        } else if ( this.mode === RecordingMode.PLAYING ) {

            const result = this.buffer[ this.pointer ];
            
            this.pointer++;

            if ( this.pointer >= this.buffer.length ) {
                this.playingEnd();
            }

            return result;

        }

        return this.black;
    }


    public recordingStart() {

        if ( this.mode !== RecordingMode.RECORDING ) {

            this.mode = RecordingMode.RECORDING;
            this.buffer.length = 0;

            this.layers.stream.setShow(false);

            this.log( "recording started" );


        } else {
            this.log( "Recording already started..." );
        }

    }

    public recordingStop() {
        this.mode = RecordingMode.IDLE;
        this.layers.stream.setShow(true);
        this.log( "Recording ended" );
    }

    public playingStart() {

        if ( this.buffer.length > 0 && this.mode === RecordingMode.IDLE ) {
            this.mode = RecordingMode.PLAYING;
            this.pointer = 0;
            this.log( "Playback started" );
            // this.layers.stream.setShow(false);
        }

    }

    public playingEnd() {
        this.mode = RecordingMode.IDLE;
        this.log( "Playback ended" );
        // this.layers.stream.setShow(true);
    }





}