import P5 from "p5";
import { Controller } from "./controller";



const sketch = ( p5: P5 ) => {

    let controller: Controller;

    p5.setup = () => {

        const canvas = p5.createCanvas( window.innerWidth, window.innerHeight );
        canvas.parent( "app" );

        p5.background( "black" );

        controller = new Controller( p5 );

    }

    p5.draw = () => {
        controller.update();
        controller.draw();
    }

}

new P5( sketch );