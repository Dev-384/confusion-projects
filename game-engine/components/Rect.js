import { Component, Point4, engine } from "../utils.js";

export class Rect extends Component {
	display = new Point4(0, 0, 100, 100);
	displayOffset = new Point4(0, 0, 100, 100);
	colour = "purple";
	outline = { colour: "black", size: 0 };
	radius = 0;
	fixedPosition = false;
	cameraTracking = false;

	getType(){ return "Rect"; }

	render(context=new CanvasRenderingContext2D, defaultOffset={x:0,y:0}){

		let offset = { x: 0, y: 0 };

		offset.x += defaultOffset.x;
		offset.y += defaultOffset.y;

		offset.x -= this.display.w * this.transform.x;
		offset.y -= this.display.h * this.transform.y;

		if(this.cameraTracking) {
			engine.camera.moveTo(this.display.x, this.display.y);
			this.fixedPosition = false;
		}

		if(!this.fixedPosition) {
			offset.x -= engine.camera.position.x;
			offset.y -= engine.camera.position.y;
			offset.x += engine.canvas.width / 2;
			offset.y += engine.canvas.height / 2;
		}

		this.displayOffset.x = this.display.x + offset.x;
		this.displayOffset.y = this.display.y + offset.y;
		this.displayOffset.w = this.display.w;
		this.displayOffset.h = this.display.h;

		if(engine.isPixelArt){
			this.displayOffset.x = Math.floor(this.displayOffset.x);
			this.displayOffset.y = Math.floor(this.displayOffset.y);
			this.displayOffset.x = Math.floor(this.displayOffset.x);
			this.displayOffset.w = Math.floor(this.displayOffset.w);
			this.displayOffset.h = Math.floor(this.displayOffset.h);
		}

		if(this.displayOffset.x > engine.canvas.width) return;
		if(this.displayOffset.y > engine.canvas.height) return;
		if(this.displayOffset.x + this.display.w < 0) return;
		if(this.displayOffset.y + this.display.h < 0) return;

		context.beginPath();
		context.fillStyle = this.colour;
		context.strokeStyle = this.outline.colour;
		context.lineWidth = this.outline.size;
		context.roundRect(
			this.displayOffset.x,
			this.displayOffset.y,
			this.displayOffset.w,
			this.displayOffset.h,
			this.radius
		);
		context.fill();
		if(this.outline.size > 0) context.stroke();
		context.closePath();
	}
}