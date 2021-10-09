
import layout from "../src/widget1.html";
import IUserDefineComponent from "../src/basiscore/IUserDefineComponent";
import BasisPanelChildComponent from "../src/BasisPanelChildComponent";
import "./asset/style.css"
interface ITabOptions {
    title : string ,
    widgetId : number ,
    active : boolean,
    triggers : string[]    
}
export default class TabComponent extends BasisPanelChildComponent {
    public tabComponentOptions : ITabOptions[]
    public tabsSettings : object;
    protected activeComponent : Element
    protected activeHeader : Element
    protected tabNodes : Element[] =[]
    protected headerWrapper :Element
    protected firstTabInitialize = false
    constructor(owner: IUserDefineComponent){
      
      super(owner, layout, "bc-tab-container");
      
    }
    async createBody():Promise<void>{
        //comment this
        let triggersArray : string[]= []
        const firstTab = this.tabComponentOptions.find(element => element.active == true);
        const componentId = Math.floor(Math.random() * 10000) 
        this.headerWrapper = document.createElement("div")
        this.headerWrapper.setAttribute("bc-tab-header-wrapper","")
        this.headerWrapper.appendChild(this.createHeader(firstTab.title , componentId, 1))
        this.container.appendChild(this.headerWrapper)
        let basisElement = document.createElement("basis")
        basisElement.setAttribute("core","call")
        basisElement.setAttribute("file" ,`${firstTab.widgetId}.html` )
        basisElement.setAttribute("run","atclient")
        await this.initializeComponent(basisElement , componentId)
        for(var i = 0 ; i < this.tabComponentOptions.length ; i++){            
            if(this.tabComponentOptions[i].triggers.length > 0 ){          
                triggersArray.push(this.tabComponentOptions[i].triggers[0]) 
            }
        }
         this.owner.addTrigger(triggersArray);
    

    }
    createHeader(headerText : string , id: number , firstTab : number = 0) : Element{
        const header = document.createElement("div")
        const closeBtn = document.createElement("button")
        const span = document.createElement("span")
        header.setAttribute("bc-tab-header" , "")
        span.setAttribute("data-id" ,  id.toString())
        span.textContent = headerText        
        closeBtn.textContent = "x"
        closeBtn.setAttribute("bc-tab-close-button" , "")
        header.appendChild(span)
        if(firstTab == 0 ){
            header.appendChild(closeBtn)
        }
        this.activeHeader = header
        closeBtn.addEventListener("click", (e) => {
            this.activeComponent.remove()
            this.activeHeader.remove()
            this.activeTab(this.tabNodes[0])  
          });
        span.addEventListener("click", (e) => { 
            const headerElement = e.target  as HTMLInputElement
            const headerId = headerElement.getAttribute("data-id")                 
            this.tabNodes.map(x => {                
                const componentId = x.getAttribute("component-id")           
                if (parseInt(headerId) == parseInt(componentId)){
                    this.activeTab(x)  
                }
            })
        });
        return header
    }

    async initializeComponent(activeComponent : Element , id :number):Promise<void>{         
        let componentWrapper = document.createElement("div")
        componentWrapper.appendChild(activeComponent)
        componentWrapper.setAttribute("bc-tab-component-wrapper" , "")
        componentWrapper.setAttribute("component-id" , id.toString())
        this.container.appendChild(componentWrapper) 
        this.tabNodes.push(componentWrapper)
        this.activeComponent = componentWrapper
        this.tabNodes.map(x => {
            x.setAttribute("bc-tab-active-component" , "false")
        })
        this.activeComponent.setAttribute("bc-tab-active-component" , "true")
        //const nodes= Array.from(this.container.childNodes)
        //this.owner.setContent(this.container);    
        await this.owner.processNodesAsync([activeComponent]);
        
       
    }
    activeTab(activeComponent? : Element):void{    
        this.tabNodes.map(x => {
            x.setAttribute("bc-tab-active-component" , "false")
        })        
        activeComponent.setAttribute("bc-tab-active-component" , "true")
        this.activeComponent =activeComponent
    }
    async runAsync(source?): Promise<any> {  
        if(!this.firstTabInitialize ){
            await this.createBody()
            this.firstTabInitialize = true
        }
        else if(source){
            const componentId = Math.floor(Math.random() * 10000)    
            const activeTab = this.tabComponentOptions.find(element => element.triggers.find(element1 => element1 == source._id) );
            this.headerWrapper.appendChild(this.createHeader(activeTab.title ,componentId))
            const basisOptions = `{"settings": {"connection.web.fingerfoodapi": "https://dbsource.basiscore.net/data.json"}}`
            let groupElement  =document.createElement("basis")
            groupElement.setAttribute("core","group")
            groupElement.setAttribute("run","atclient")
            let tabSettings : string = `${this.tabsSettings}`
            groupElement.setAttribute("options" , JSON.stringify(tabSettings)  )
            let basisTag = document.createElement("basis")            
            basisTag.setAttribute("core","call")
            basisTag.setAttribute("file" ,`${activeTab.widgetId}.html` )
            basisTag.setAttribute("run","atclient")   
            groupElement.appendChild(basisTag)   
            await this.initializeComponent(groupElement , componentId)     
        }
                 
        return true
      }
    public async getOptions():  Promise<void> {
        
        const settingObject = await this.owner.getAttributeValueAsync(
            "options"
          );
        this.tabComponentOptions  = eval(settingObject).tabs;
        this.tabsSettings = eval(settingObject).settings
        
      
    } 
    public async initializeAsync():  Promise<void> {
        
       await this.getOptions()
       
       
    }

}
