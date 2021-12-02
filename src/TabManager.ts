
import layout from "../src/widget1.html";
import IUserDefineComponent from "../src/basiscore/IUserDefineComponent";
import BasisPanelChildComponent from "../src/BasisPanelChildComponent";

interface ITabOptions {
    title : string ,
    widgetURL : string ,
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
    protected bodyWrapper : Element
    protected firstTabInitialize = false
    constructor(owner: IUserDefineComponent , container){
      super(owner, layout,  container);
    }
    async createBody():Promise<void>{
        //comment this
        let triggersArray : string[]= []
        const firstTabs :ITabOptions[] = []
         this.tabComponentOptions.find(function(element, index) {
             if(element.active == true){
                firstTabs.push(element)
             }
         });
        this.headerWrapper = document.createElement("div")
        this.headerWrapper.setAttribute("bc-tab-header-wrapper","")
        this.bodyWrapper = document.createElement("div")
        this.bodyWrapper.setAttribute("bc-tab-body-wrapper","")
        this.container.appendChild(this.headerWrapper)
        this.container.appendChild(this.bodyWrapper) 
        for(var i = 0 ; i <firstTabs.length ; i++){
            const componentId = Math.floor(Math.random() * 10000)            
            this.headerWrapper.appendChild(this.createHeader(firstTabs[i].title , componentId, 1))
            let basisElement = document.createElement("basis")
            basisElement.setAttribute("core","call")
            basisElement.setAttribute("url" , firstTabs[i].widgetURL)
            basisElement.setAttribute("run","atclient")
            await this.initializeComponent( basisElement , componentId)
        }
        for(var i = 0 ; i < this.tabComponentOptions.length ; i++){            
            if(this.tabComponentOptions[i].triggers.length > 0 ){          
                triggersArray.push(this.tabComponentOptions[i].triggers[0]) 
            }
        }
         this.owner.addTrigger(triggersArray);
         this.activeTab(this.tabNodes[0])  
    

    }
    createHeader(headerText : string , id: number , firstTab : number = 0) : Element{
        const header = document.createElement("div")
        const closeBtn = document.createElement("button")
        const span = document.createElement("span")
        header.setAttribute("bc-tab-header" , "")
        span.setAttribute("data-id" ,  id.toString())
        closeBtn.setAttribute("data-id" ,  id.toString())
        span.textContent = headerText        
        closeBtn.textContent = "x"
        closeBtn.setAttribute("bc-tab-close-button" , "")
        header.appendChild(span)
        if(firstTab == 0 ){
            header.appendChild(closeBtn)
        }
        this.activeHeader = header
        closeBtn.addEventListener("click", (e) => {
            const closeElement =  e.target  as HTMLInputElement
            const headerElement = closeElement.getAttribute("data-id")         
            const header = closeElement.parentElement
           
            this.tabNodes.map(x => {
                let dataId = x.getAttribute("component-id")
                if(parseInt(dataId) == parseInt(headerElement)){
                    this.activeComponent = x
                    this.activeHeader = header
                }
            })
            
            this.activeComponent.remove()
            this.activeHeader.remove()
            // this.activeTab(this.tabNodes[0])  
            
            
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

    async initializeComponent( activeComponent : Element , id :number):Promise<void>{  
        let componentWrapper = document.createElement("div")
        componentWrapper.appendChild(activeComponent)
        componentWrapper.setAttribute("bc-tab-component-wrapper" , "")
        componentWrapper.setAttribute("component-id" , id.toString())
        this.bodyWrapper.appendChild(componentWrapper)
        
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
            let groupElement  =document.createElement("basis")
            groupElement.setAttribute("core","group")
            groupElement.setAttribute("run","atclient")
            let basisTag = document.createElement("basis")            
            basisTag.setAttribute("core","call")
            basisTag.setAttribute("url" ,activeTab.widgetURL )
            basisTag.setAttribute("run","atclient")  
            console.log("command" , basisTag)         
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
        this.tabsSettings = eval(settingObject).tabSettings
      
    } 
    public async initializeAsync():  Promise<void> {
        
       await this.getOptions()
       
       
    }

}
