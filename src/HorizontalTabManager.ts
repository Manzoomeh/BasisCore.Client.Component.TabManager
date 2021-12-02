// import TabComponent from "Tab"
import "./asset/hStyle.css"
import TabComponent from "./TabManager"
import IUserDefineComponent from "../src/basiscore/IUserDefineComponent";
export default class HorizontalTabManager extends TabComponent{
	constructor(owner: IUserDefineComponent){
		console.log("HorizontalTabManager")
		super(owner,"bc-tab-container");
		
	  }
}