import IComponentManager from "../src/basiscore/IComponentManager";
import ISource from "../src/basiscore/ISource";
import IUserDefineComponent from "../src/basiscore/IUserDefineComponent";
// import IBasisPanelOptions from "./src/basispanel/IBasisPanelOptions";

export default abstract class BasisPanelChildComponent
  implements IComponentManager
{
  protected readonly owner: IUserDefineComponent;
  public readonly container: Element;
  // protected readonly options: IBasisPanelOptions;

  constructor(owner: IUserDefineComponent, layout: string, dataAttr: string) {
    this.owner = owner;
    this.container = document.createElement("div");
    this.container.setAttribute(dataAttr, "");
    this.owner.setContent(this.container);
    if (layout?.length > 0) {
      const range = new Range();
      range.setStart(this.container, 0);
      range.setEnd(this.container, 0);
      range.insertNode(range.createContextualFragment(layout));
    }
    // this.options = this.owner.getSetting<IBasisPanelOptions>(
    //   "basispanel.option",
    //   null
    // );
  }
  public abstract initializeAsync(): void | Promise<void>;
  public abstract runAsync(source?: ISource): any | Promise<any>;
}
