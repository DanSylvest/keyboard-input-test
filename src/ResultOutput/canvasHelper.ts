import {CANVAS_HEIGHT, CANVAS_WIDTH, FONT_SIZE} from "./constansts";

class CanvasHelper {
    canvas: any;
    context: any; // не очень понимаю почему вебшторм предложил добавить тип null.
    lastPrinted: String = "";
    refreshHandler = this.buildCanvas.bind(this)

    constructor(cnvEl: HTMLCanvasElement) {
        this.canvas = cnvEl;
        this.context = cnvEl.getContext('2d');

        this.buildCanvas();

        window.addEventListener("resize", this.refreshHandler);
    }

    buildCanvas () {
        this.canvas.width = CANVAS_WIDTH * window.devicePixelRatio;
        this.canvas.height = CANVAS_HEIGHT * window.devicePixelRatio;

        this.context.font = `normal ${Math.round(FONT_SIZE * window.devicePixelRatio)}px serif`
        this.context.textAlign = "center";
        this.context.textBaseline = "middle";
        this.context.fillStyle = "#777777";

        this.drawSymbol(this.lastPrinted);
    }

    destructor() {
        window.removeEventListener("resize", this.refreshHandler);
        delete this.canvas;
    }

    drawSymbol(symbol: String) {
        this.lastPrinted = symbol;

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.beginPath();
        this.context.fillText(symbol, Math.round(this.canvas.width / 2), Math.round(this.canvas.height / 2))
    }
}

export default CanvasHelper;