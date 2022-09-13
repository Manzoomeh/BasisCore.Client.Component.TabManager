import layout from "../src/widget1.html";
import IUserDefineComponent from "../src/basiscore/IUserDefineComponent";
import BasisPanelChildComponent from "../src/BasisPanelChildComponent";
interface ITabOptions {
  title: string;
  widgetURL: string;
  active: boolean;
  triggers: string[];
  tabs: ITabOptions[];
  params : object;
  enable? : string
}

export  default abstract class TabComponent extends BasisPanelChildComponent {
  public tabComponentOptions: ITabOptions[];
  public runType: boolean = true;
  protected activeComponent: Element;
  protected activeHeader: Element;
  protected tabNodes: Element[] = [];
  protected headerWrapper: Element;
  protected bodyWrapper: Element;
  protected firstTabInitialize = false;
  constructor(owner: IUserDefineComponent, container) {
    super(owner, layout, container);
  

  }
  async createBody(): Promise<void> {
    this.container.innerHTML =""
    let triggersArray: string[] = [];
    const firstTabs: ITabOptions[] = [];

    this.tabComponentOptions.find(function (element) {
      if (element.active == true) {
        firstTabs.push(element);
      }
    });
    this.headerWrapper = document.createElement("div");
    this.headerWrapper.setAttribute("bc-tab-header-wrapper", "");    
    this.bodyWrapper = document.createElement("div");
    this.bodyWrapper.setAttribute("bc-tab-body-wrapper", "");
    this.headerWrapper.setAttribute("gs-w", "2");
    this.bodyWrapper.setAttribute("gs-w", "10");
    this.bodyWrapper.setAttribute("gs-x", "0");
    this.bodyWrapper.setAttribute("gs-y", "0");
    this.bodyWrapper.setAttribute("gs-h", "6");
      
    this.container.appendChild(this.headerWrapper);
    this.container.appendChild(this.bodyWrapper);
    for (var i = 0; i < firstTabs.length; i++) {
      const componentId = Math.floor(Math.random() * 10000);
      const arr: ITabOptions[] = firstTabs[i].tabs ? firstTabs[i].tabs : [];

      if (i == 0 && arr.length == 0) {
        this.headerWrapper.appendChild(
          this.createHeader(firstTabs[i].title, componentId, 2 ,(firstTabs[i].enable != undefined ? firstTabs[i].enable  : "true") )
        );
      } else if (arr.length == 0) {
        this.headerWrapper.appendChild(
          this.createHeader(firstTabs[i].title, componentId, 1,(firstTabs[i].enable != undefined ? firstTabs[i].enable  : "true"))
        );
      }
      let basisElement = document.createElement("basis");
      basisElement.setAttribute("core", "call");
      basisElement.setAttribute("method", "get");
      basisElement.setAttribute("url", firstTabs[i].widgetURL);
      basisElement.setAttribute("run", "atclient");
      basisElement.setAttribute("params" , JSON.stringify(firstTabs[i].params) )
      const parentHeader = document.createElement("div");
      var parentFlag: number = 0;
      for (var j = 0; j < arr.length; j++) {
        parentFlag = 1;
        const componentId = Math.floor(Math.random() * 10000);
        parentHeader.setAttribute("bc-tab-header-parent", "");
        parentHeader.classList.add("hideTab")
        const childWrapper = document.createElement("div");
        childWrapper.setAttribute("bc-tab-header-child", "");
        childWrapper.appendChild(
          this.createHeader(arr[j].title, componentId, 1 ,(arr[j].enable != undefined ? arr[j].enable  : "true"))
        );
        parentHeader.appendChild(childWrapper);
        let basisElement = document.createElement("basis");
        basisElement.setAttribute("core", "call");
        basisElement.setAttribute("method", "get");
        basisElement.setAttribute("url", arr[j].widgetURL);
        basisElement.setAttribute("run", "atclient");
        basisElement.setAttribute("params" , JSON.stringify(arr[j].params) )
        if(i == 0){
          this.initializeComponent(basisElement, componentId,true);
        }
        else {
          this.initializeComponent(basisElement, componentId,this.runType);
        }
        
        if (j == arr.length - 1) {
          this.headerWrapper.appendChild(
            this.createHeader(firstTabs[i].title, componentId, 3 ,(firstTabs[i].enable != undefined ? firstTabs[i].enable  : "true"),parentHeader)
          );
        }
      }
      if(i == 0){
        this.initializeComponent(basisElement, componentId,true);
      }
      else {
        this.initializeComponent(basisElement, componentId,this.runType);
      }
      
    }
    for (var i = 0; i < this.tabComponentOptions.length; i++) {
      if (
        this.tabComponentOptions[i].triggers &&
        this.tabComponentOptions[i].triggers.length > 0
      ) {
        triggersArray.push(this.tabComponentOptions[i].triggers[0]);
      }
    }
    this.owner.addTrigger(triggersArray);
    this.activeTab(this.tabNodes[0]);
  }
  abstract createHeader(
    headerText: string,
    id: number,
    firstTab? : number,
    enable? : string ,
    container?: HTMLElement
  )

  async initializeComponent(
    activeComponent: Element,
    id: number,
    runFlag : boolean,
    runOnClick: boolean = false
  ): Promise<void> {
    if(runOnClick && runFlag){
      await this.owner.processNodesAsync([activeComponent]);
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
      await this.owner.processNodesAsync([activeComponent]);
    }
  }
  activeTab(activeComponent?: Element): void {
    this.tabNodes.map((x) => {
      x.setAttribute("bc-tab-active-component", "false");
    });
    activeComponent.setAttribute("bc-tab-active-component", "true");
    this.activeComponent = activeComponent;
  }
  async runAsync(source?): Promise<any> {
    await this.getOptions();
    await this.createBody();
    this.firstTabInitialize = true;
    // if (!this.firstTabInitialize) {
    //   await this.createBody();
    //   // this.firstTabInitialize = true;
    // } else if (source) {
    //   const componentId = Math.floor(Math.random() * 10000);
    //   const activeTab = this.tabComponentOptions.find((element) =>{
    //     element.triggers.find((element1) => element1 == source._id)
    //   }
    //   );
    //   this.headerWrapper.appendChild(
    //     this.createHeader(activeTab.title, componentId)
    //   );
    //   let groupElement = document.createElement("basis");
    //   groupElement.setAttribute("core", "group");
    //   groupElement.setAttribute("run", "atclient");
    //   let basisTag = document.createElement("basis");
    //   basisTag.setAttribute("core", "call");
    //   basisTag.setAttribute("method", "get");
    //   basisTag.setAttribute("url", activeTab.widgetURL);
    //   basisTag.setAttribute("run", "atclient");
    //   basisTag.setAttribute("params" , JSON.stringify(activeTab.params) )
    //   groupElement.appendChild(basisTag);
    //   await this.initializeComponent(groupElement , componentId,this.runType)
    // }
    return true;
  }
  public async getOptions(): Promise<void> {
    this.tabComponentOptions = []
    const settingObject = await this.owner.getAttributeValueAsync("options");
    this.tabComponentOptions = eval(settingObject).tabs;
    this.runType = eval(settingObject).autoRun != undefined ? eval(settingObject).autoRun : true;
  }
  public async initializeAsync(): Promise<void> {
    // await this.getOptions();

  }
  public slide(el) : void {    
    el.classList.toggle('hideTab');
  }
}
