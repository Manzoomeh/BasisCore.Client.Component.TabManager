// import TabComponent from "Tab"
import "./asset/vStyle.css"
import TabComponent from "./TabManager"
import IUserDefineComponent from "../src/basiscore/IUserDefineComponent";
declare const $bc: any;
export default class VerticalTabManager extends TabComponent{
	constructor(owner: IUserDefineComponent){
		super(owner,"bc-vertical-tab-container");
	  }
	  createHeader(
		headerText: string,
		id: number,
		firstTab: number = 0,
		container?: HTMLElement
	  ): Element {
		this.bodyWrapper.setAttribute("data-bc-bp-sidebar-container", "");   
		this.headerWrapper.setAttribute("data-bc-bp-sidebar-container", "");
		this.headerWrapper.setAttribute("data-bc-sidebar", "");
		const header = document.createElement("div");
		header.setAttribute("bc-tab-header", "");
		header.setAttribute("data-bc-sidebar-items", "");
		// this.headerWrapper.setAttribute("style",`height:220px`) 
		const closeBtn = document.createElement("button");
		const span = document.createElement("span");
		span.setAttribute("data-id", id.toString());
		closeBtn.setAttribute("data-id", id.toString());
		span.textContent = headerText;
		closeBtn.textContent = "x";
		closeBtn.setAttribute("bc-tab-close-button", "");
		header.appendChild(span);
		if (firstTab == 2) {
		  header.setAttribute("data-bc-sidebar-active", "");
		} else if (firstTab == 0) {
		  header.appendChild(closeBtn);
		  const activeHeaders = Array.from(
			this.headerWrapper.querySelectorAll("[data-bc-sidebar-active]")
		  );
		  activeHeaders.map((x) => {
			x.removeAttribute("data-bc-sidebar-active");
		  });
		  header.setAttribute("data-bc-sidebar-active", "");
		}
		if (container) {
		  span.classList.toggle("bc-tab-parent")
			span.addEventListener("click", (e) => {
				this.slide(container)
				span.classList.toggle("bc-tab-parent-open")
			})
			
			header.appendChild(container);
			return header
		  }
		this.activeHeader = header;
		closeBtn.addEventListener("click", (e) => {
		  const returnFirstHeader = this.headerWrapper.querySelectorAll("div")[0]
		  this.activeComponent.remove();
		  this.activeHeader.remove();
		  this.activeComponent = this.tabNodes[0];
		  this.activeTab(this.tabNodes[0]);
		  returnFirstHeader.setAttribute("data-bc-sidebar-active", "");
		  this.activeHeader = returnFirstHeader;
		});
		span.addEventListener("click", (e) => {
		  const headerElement = e.target as HTMLInputElement;
		  const headerId = headerElement.getAttribute("data-id");
		  if(this.runType == false && span.getAttribute("bc-tab-run") == null){
			const activeOneTab = this.bodyWrapper.querySelector(`[component-id="${headerId}"]`).querySelector("basis")
			this.initializeComponent(activeOneTab, parseInt(headerId) ,true , true);
			span.setAttribute("bc-tab-run" , "")
		  }
		  
		  this.tabNodes.map((x) => {
			const componentId = x.getAttribute("component-id");
			if (parseInt(headerId) == parseInt(componentId)) {
			  const activeHeaders = Array.from(
				this.headerWrapper.querySelectorAll("[data-bc-sidebar-active]")
			  );
			  activeHeaders.map((x) => {
				x.removeAttribute("data-bc-sidebar-active");
			  });
			  this.activeTab(x);
			  header.setAttribute("data-bc-sidebar-active", "");
			}
		  });
		});  
		
		return header;
	  }
	  async initializeComponent(
		activeComponent: Element,
		id: number,
		runFlag : boolean,
		runOnClick: boolean = false
	  ): Promise<void> {
		  const paramsInput = activeComponent.getAttribute("params")
		if(runOnClick && runFlag){
			if(paramsInput != "undefined"){
				const params =JSON.parse(paramsInput) 
				for (var key in params) {
					await $bc.setSource(key,params[key]);
				  }
			  }
		  await this.owner.processNodesAsync([activeComponent]);
		  this.headerWrapper.setAttribute("style",`height:${this.bodyWrapper.clientHeight}px`) 
		  return
		}
		let componentWrapper = document.createElement("div");
		componentWrapper.appendChild(activeComponent);
		componentWrapper.setAttribute("bc-tab-component-wrapper", "");
		componentWrapper.setAttribute("component-id", id.toString());
		this.bodyWrapper.appendChild(componentWrapper);
		this.tabNodes.push(componentWrapper);
		this.activeComponent = componentWrapper;
		this.tabNodes.map((x) => {
		  x.setAttribute("bc-tab-active-component", "false");
		});
		this.activeComponent.setAttribute("bc-tab-active-component", "true");        
		if(runFlag){
			if(paramsInput != "undefined"){
				const params =JSON.parse(paramsInput) 
				for (var key in params) {
					await $bc.setSource(key,params[key]);
				  }
			  }
		  await this.owner.processNodesAsync([activeComponent]);
		  
		}

		const getBody = this.getParentNode(this.headerWrapper , "data-bc-page-body")		
		const height = getBody.style.height
		console.log("ssss", height)
		this.headerWrapper.setAttribute("style",`height:${height}`) 
		this.bodyWrapper.setAttribute("style", `height:${height};left:0;top:0`);  
		// this.bodyWrapper.setAttribute("style",`height:${height}`) 
		// bc-tab-component-wrapper
	  }
	  getParentNode(el, tagName) {
		while (el && el.parentNode) {
		  el = el.parentNode;
		  if (el && el.getAttribute(tagName) == "") {
			return el;
		  }
		}
		
		return null;
	  }
}