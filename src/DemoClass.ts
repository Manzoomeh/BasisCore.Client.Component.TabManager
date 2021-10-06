export default class DemoClass{
    readonly message:string;

    constructor(message:string){
        this.message = message;   
    }

    public logMessage():void{
        console.log(`message is '${this.message}'`);
    }

    public alertMessage():void{
        alert(`message is '${this.message}'`);
    }

    public setContent(container:Element):void{
        container.textContent=`message is '${this.message}'`;
    }
}