import BinaryMaze from './BinaryMaze';
import Canvas from './Canvas';

const Can = new Canvas();
/** Parent Render Class */
export default class Render {
  constructor(element, width, height) {
    this.element = element;
    this.size = 15;
    this.time = 0;
    this.maze = new BinaryMaze();
    const canvasReturn = Can.createCanvas('canvas');
    this.canvas = canvasReturn.canvas;
    this.surface = canvasReturn.surface;
    this.width = canvasReturn.width;
    this.height = canvasReturn.height;
    // generate maze based on screen size //
    this.space = this.size * 2;
    this.rows = 12; // ~~((this.height - 100) / this.space);
    this.cols = 12; // ~~((this.width - 100) / this.space);
    this.createGUI();
    this.renderLoop();
    // attach resize handler //
    window.addEventListener('resize', this.resetCanvas);
  }

  createGUI = () => {
    this.options = {
      cols: this.cols,
      rows: this.rows,
      size: this.size
    };
    // this.gui = new dat.GUI();
    // const folderRender = this.gui.addFolder('Render Options');
    // folderRender.add(this.options, 'rows', 1, 100).step(1)
    //   .onFinishChange((value) => {
    //     this.options.rows = value;
    //     this.setOptions(this.options);
    //   });
    // folderRender.add(this.options, 'cols', 1, 100).step(1)
    //   .onFinishChange((value) => {
    //     this.options.cols = value;
    //     this.setOptions(this.options);
    //   });
    // folderRender.add(this.options, 'size', 1, 50).step(1)
    //   .onFinishChange((value) => {
    //     this.options.size = value;
    //     this.setOptions(this.options);
    //   });
    // folderRender.open();
    this.setOptions(this.options);
  };

  setOptions = (options) => {
    this.mazeReturn = null;
    window.cancelAnimationFrame(this.animation);
    this.rows = options.rows || this.rows;
    this.cols = options.cols || this.cols;
    this.size = options.size || this.size;
    this.mazeReturn = this.maze.generateMaze(this.cols, this.rows);
    this.mazeWidth = this.maze.cc * this.size;
    this.mazeHeight = this.maze.cr * this.size;
    this.renderLoop();
  };

  resetCanvas = () => {
    window.cancelAnimationFrame(this.animation);
    const canvasReturn = Can.setViewport(this.canvas);
    this.canvas = canvasReturn.canvas;
    this.surface = canvasReturn.surface;
    this.width = canvasReturn.width;
    this.height = canvasReturn.height;
    this.renderLoop();
  };

  drawSquare = (point, color) => {
    const size = this.size;
    const xOffset = ~~(this.width / 2 - this.mazeWidth / 2);
    const yOffset = ~~(this.height / 2 - this.mazeHeight / 2);
    this.surface.fillStyle = color;
    this.surface.fillRect(
      xOffset + point.x * size,
      yOffset + point.y * size,
      size,
      size
    );
  };

  drawMap = () => {
    for (let d = 0; d < this.mazeReturn.length; d += 1) {
      const x = d % this.maze.cc;
      const y = ~~((d - x) / this.maze.cc);
      const hue =
        Math.sin((x * 0.001) + this.time * Math.PI / 180) * 360;
      const bc = this.mazeReturn[d] === 2
        ? '#F0f0F0'
        : this.mazeReturn[d] === 1 ? '#000' : `hsl(${hue}, 100%, 50%)`;
      this.drawSquare({ x, y }, bc);
    }
    this.time += 0.01;
  };

  renderLoop = () => {
    this.surface.clearRect(0, 0, this.width, this.height);
    this.drawMap();
    this.animation = window.requestAnimationFrame(this.renderLoop);
  };
}
