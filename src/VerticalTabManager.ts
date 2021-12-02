// import TabComponent from "Tab"
import "./asset/vStyle.css"
import TabComponent from "./TabManager"
import IUserDefineComponent from "../src/basiscore/IUserDefineComponent";
export default class VerticalTabManager extends TabComponent{
	constructor(owner: IUserDefineComponent){
		console.log("VerticalTabManager")
		super(owner,"bc-vertical-tab-container");
	  }
}