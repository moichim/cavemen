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

    protected maxBufferSize: number = 1 * 30;

    protected isKeyDown: boolean = false;

    protected pointer: number = 0;

    /** Current stream */
    public graphics!: P5.Graphics;

    constructor(
        controller: Controller,
        outputTint: P5.Color,
        width: number,
        height: number
    ) {
        super(controller, outputTint, width, height);

        this.graphics = this.p5.createGraphics( width, height );

        this.p5.keyPressed = () => {

            if (this.p5.key === "a" && !this.isKeyDown) {
                this.isKeyDown = true;
                this.recordingStart();
            }

            if (this.p5.key === "b" && !this.isKeyDown) {
                this.isKeyDown = true;
                this.playingStart();
            }

        }

        this.p5.keyReleased = () => {
            this.isKeyDown = false;
        }

    }


    public update(): void {

        this.debug( "buffer size", this.buffer.length );

        if (this.mode === RecordingMode.RECORDING) {

            this.graphics.image( this.capture.video, 0, 0, this.graphics.width, this.graphics.height );

            // Nyní se z graphics uloží obraz do bufferu
            const img = this.graphics.get(0, 0, this.graphics.width, this.graphics.height);
            this.buffer.push(img);

            if (this.buffer.length >= this.maxBufferSize) {
                this.recordingStop();
            }

        }

    }

    public doRender() {

        this.renderInputToOutput(this.getCurrentInput());

    }


    protected getCurrentInput(): P5.Image | P5.Element {

        switch (this.mode) {
            case RecordingMode.IDLE:
                return this.black;
            case RecordingMode.RECORDING:
                return this.capture.video;
            case RecordingMode.PLAYING:
                const result = this.buffer[this.pointer];
                if (this.pointer < this.buffer.length - 1) {
                    this.pointer++;
                } else {
                    this.recordingStop();
                }
                return result;
        }

    }


    public recordingStart() {

        if (this.mode !== RecordingMode.RECORDING) {

            this.mode = RecordingMode.RECORDING;
            this.buffer.length = 0;

            this.layers.stream.setShow(false);

            this.log("recording started");

        } else {
            this.log("Recording already started...");
        }

    }


    public recordingStop() {
        this.mode = RecordingMode.IDLE;
        this.layers.stream.setShow(true);
        this.log("Recording ended");
    }


    public playingStart() {

        if (this.buffer.length > 0 && this.mode === RecordingMode.IDLE) {
            this.mode = RecordingMode.PLAYING;
            this.pointer = 0;
            this.log("Playback started");
        }

    }


    public playingEnd() {
        this.mode = RecordingMode.IDLE;
        this.log("Playback ended");
    }


}