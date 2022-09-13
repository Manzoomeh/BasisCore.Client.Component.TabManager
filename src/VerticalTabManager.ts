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
		enable : string = "true",
		container? : HTMLElement		
	  ): Element {
		this.bodyWrapper.setAttribute("data-bc-bp-sidebar-container", "");   
		this.headerWrapper.setAttribute("data-bc-bp-sidebar-container", "");
		this.headerWrapper.setAttribute("data-bc-sidebar", "");
		this.headerWrapper.setAttribute("data-sys-sidebar", "");
		const header = document.createElement("div");
		header.setAttribute("bc-tab-header", "");
		header.setAttribute("data-bc-sidebar-items", "");
		if( enable === "false"  ){
			header.setAttribute("data-bc-sidebar-items-disabled", "");
		}
		// this.headerWrapper.setAttribute("style",`height:220px`) 
		const closeBtn = document.createElement("button");
		const div = document.createElement("div");
		const arrowIcon = document.createElement("span")
		div.setAttribute("data-id", id.toString());
		div.setAttribute("data-sys-text", "");
		closeBtn.setAttribute("data-id", id.toString());
		arrowIcon.innerHTML = `<svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M6.70998 0.70998C6.31998 0.31998 5.68998 0.31998 5.29998 0.70998L0.70998 5.29998C0.31998 5.68998 0.31998 6.31998 0.70998 6.70998L5.29998 11.3C5.68998 11.69 6.31998 11.69 6.70998 11.3C7.09998 10.91 7.09998 10.28 6.70998 9.88998L2.82998 5.99998L6.70998 2.11998C7.09998 1.72998 7.08998 1.08998 6.70998 0.70998Z" fill="#999"/>
		</svg>
		`
		arrowIcon.setAttribute("bc-tab-arrow-icon" , "")
		div.textContent = headerText;
		
		closeBtn.textContent = "x";
		closeBtn.setAttribute("bc-tab-close-button", "");
		header.appendChild(div);
		if (firstTab == 2) {
		  header.setAttribute("data-bc-tabManager-active", "");
		  header.setAttribute("data-bc-sidebar-active", "");
		  header.setAttribute("data-sys-inherit", "");
		} else if (firstTab == 0) {
		  header.appendChild(closeBtn);
		  const activeHeaders = Array.from(
			this.headerWrapper.querySelectorAll("[data-bc-tabManager-active]")
		  );
		  activeHeaders.map((x) => {
			x.removeAttribute("data-bc-tabManager-active");
			x.removeAttribute("data-bc-sidebar-active");
		  });
		  header.setAttribute("data-bc-tabManager-active", "");
		  header.setAttribute("data-bc-sidebar-active", "");
		  header.setAttribute("data-sys-inherit", "");
		}
		if (container) {
			// div.classList.toggle("bc-tab-parent")
			div.appendChild(arrowIcon)
			// div.classList.add("bc-has-icon")
			div.addEventListener("click", (e) => {
				this.slide(container)
				// div.classList.toggle("bc-tab-parent-open")
				arrowIcon.classList.toggle("rotate_down")	
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
		  returnFirstHeader.setAttribute("data-bc-tabManager-active", "");
		  returnFirstHeader.setAttribute("data-bc-sidebar-active", "");
		  returnFirstHeader.setAttribute("data-sys-inherit", "");
		  this.activeHeader = returnFirstHeader;
		});
		if(enable == "true"){
			div.addEventListener("click", (e) => {
			  const headerElement = e.target as HTMLInputElement;
			  const headerId = headerElement.getAttribute("data-id");
			  if(this.runType == false && div.getAttribute("bc-tab-run") == null){
				const activeOneTab = this.bodyWrapper.querySelector(`[component-id="${headerId}"]`).querySelector("basis")
				this.initializeComponent(activeOneTab, parseInt(headerId) ,true , true);
				div.setAttribute("bc-tab-run" , "")
			  }
			  
			  this.tabNodes.map((x) => {
				const componentId = x.getAttribute("component-id");
				if (parseInt(headerId) == parseInt(componentId)) {
				  const activeHeaders = Array.from(
					this.headerWrapper.querySelectorAll("[data-bc-tabManager-active]")
				  );
				  activeHeaders.map((x) => {
					x.removeAttribute("data-bc-tabManager-active");
					x.removeAttribute("data-bc-sidebar-active");
				  });
				  this.activeTab(x);
				  header.setAttribute("data-bc-tabManager-active", "");
				  header.setAttribute("data-bc-sidebar-active", "");
				  header.setAttribute("data-sys-inherit", "");
				}
			  });
			});  
		}
		
		
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
		componentWrapper.setAttribute("bc-tab-component-wrapper", "");
		componentWrapper.setAttribute("data-sys-widget", "");
		componentWrapper.setAttribute("component-id", id.toString());
		
		const bodyContainer = document.createElement("div");
		bodyContainer.setAttribute("bc-tab-content-wrapper", "");
		
		bodyContainer.appendChild(activeComponent);
		componentWrapper.appendChild(bodyContainer);
		
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

		// const getBody = this.getParentNode(this.headerWrapper , "data-bc-page-body")		
		// const height = getBody.style.height
		// this.headerWrapper.setAttribute("style",`height:${height}`) 
		// this.bodyWrapper.setAttribute("style", `height:${height};left:0;top:0`);  
		// this.bodyWrapper.setAttribute("style",`height:${height}`) 
		// bc-tab-component-wrapper
	  }

	//   getParentNode(el, tagName) {
	// 	while (el && el.parentNode) {
	// 	  el = el.parentNode;
	// 	  if (el && el.getAttribute(tagName) == "") {
	// 		return el;
	// 	  }
	// 	}
		
	// 	return null;
	//   }
}