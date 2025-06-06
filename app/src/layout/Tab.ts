import {Wnd} from "./Wnd";
import {genUUID} from "../util/genID";
import {Model} from "./Model";
import {Editor} from "../editor";
import {hasClosestByTag} from "../protyle/util/hasClosest";
import {Constants} from "../constants";
import {escapeGreat, escapeHtml} from "../util/escape";
import {unicode2Emoji} from "../emoji";
import {fetchPost} from "../util/fetch";
import {hideTooltip, showTooltip} from "../dialog/tooltip";
import {isTouchDevice} from "../util/functions";
/// #if !BROWSER
import {openNewWindow} from "../window/openNewWindow";
import {ipcRenderer} from "electron";
/// #endif
import {layoutToJSON, saveLayout} from "./util";

export class Tab {
    public parent: Wnd;
    public id: string;
    public headElement: HTMLElement;
    public panelElement: HTMLElement;
    public callback: (tab: Tab) => void;
    public model: Model;
    public title: string;
    public icon: string;
    public docIcon: string;

    constructor(options: ITab) {
        this.id = genUUID();
        this.callback = options.callback;
        if (options.title || options.icon) {
            this.title = options.title;
            this.icon = options.icon;
            this.docIcon = options.docIcon;
            this.headElement = document.createElement("li");
            this.headElement.setAttribute("data-type", "tab-header");
            this.headElement.setAttribute("draggable", "true");
            this.headElement.setAttribute("data-id", this.id);
            this.headElement.classList.add("item", "item--focus");
            let iconHTML = "";
            if (options.icon) {
                iconHTML = `<svg class="item__graphic"><use xlink:href="#${options.icon}"></use></svg>`;
            } else if (options.docIcon) {
                iconHTML = `<span class="item__icon">${unicode2Emoji(options.docIcon)}</span>`;
            }
            this.headElement.innerHTML = `${iconHTML}<span class="item__text">${escapeHtml(options.title)}</span>
<span class="item__close"><svg><use xlink:href="#iconClose"></use></svg></span>`;
            this.headElement.addEventListener("mouseenter", (event) => {
                event.stopPropagation();
                event.preventDefault();
                const dragElement = Array.from(this.headElement.parentElement.childNodes).find((item: HTMLElement) => {
                    if (item.style?.opacity === "0.38") {
                        return true;
                    }
                });
                if (dragElement) {
                    hideTooltip();
                    return;
                }

                let id = "";
                if (this.model instanceof Editor && this.model.editor?.protyle?.block?.rootID) {
                    id = (this.model as Editor).editor.protyle.block.rootID;
                } else if (!this.model) {
                    const initData = JSON.parse(this.headElement.getAttribute("data-initdata") || "{}");
                    if (initData && initData.instance === "Editor") {
                        id = initData.blockId;
                    }
                }
                if (id) {
                    fetchPost("/api/filetree/getFullHPathByID", {
                        id
                    }, (response) => {
                        if (!this.headElement.getAttribute("aria-label")) {
                            showTooltip(escapeGreat(response.data), this.headElement);
                        }
                        this.headElement.setAttribute("aria-label", escapeGreat(response.data));
                    });
                } else {
                    this.headElement.setAttribute("aria-label", escapeGreat(this.title));
                }
            });
            this.headElement.addEventListener("dragstart", (event: DragEvent & { target: HTMLElement }) => {
                if (isTouchDevice()) {
                    event.stopPropagation();
                    event.preventDefault();
                    return;
                }
                window.getSelection().removeAllRanges();
                hideTooltip();
                const tabElement = hasClosestByTag(event.target, "LI");
                if (tabElement) {
                    event.dataTransfer.setData("text/html", tabElement.outerHTML);
                    const modeJSON = {id: this.id};
                    layoutToJSON(this, modeJSON);
                    event.dataTransfer.setData(Constants.SIYUAN_DROP_TAB, JSON.stringify(modeJSON));
                    event.dataTransfer.dropEffect = "move";
                    tabElement.style.opacity = "0.38";
                    window.siyuan.dragElement = this.headElement;
                }
                ipcRenderer.send(Constants.SIYUAN_SEND_WINDOWS, {cmd: "resetTabsStyle", data: "removeRegionStyle"});
            });
            this.headElement.addEventListener("dragend", (event: DragEvent & { target: HTMLElement }) => {
                const tabElement = hasClosestByTag(event.target, "LI");
                if (tabElement) {
                    tabElement.style.opacity = "1";
                }
                /// #if !BROWSER
                // 拖拽到屏幕外
                setTimeout(() => {
                    if (document.body.contains(this.panelElement) &&
                        (event.clientX < 0 || event.clientY < 0 || event.clientX > window.innerWidth || event.clientY > window.innerHeight)) {
                        openNewWindow(this);
                    }
                }, Constants.TIMEOUT_LOAD); // 等待主进程发送关闭消息
                ipcRenderer.send(Constants.SIYUAN_SEND_WINDOWS, {cmd: "resetTabsStyle", data: "rmDragStyle"});
                /// #else
                document.querySelectorAll(".layout-tab-bars--drag").forEach(item => {
                    item.classList.remove("layout-tab-bars--drag");
                });
                document.querySelectorAll(".layout-tab-bar li[data-clone='true']").forEach(tabItem => {
                    tabItem.remove();
                });
                /// #endif
                window.siyuan.dragElement = undefined;
                if (event.dataTransfer.dropEffect === "none") {
                    // 按 esc 取消的时候应该还原在 dragover 时交换的 tab
                    this.parent.children.forEach((item, index) => {
                        const currentElement = this.headElement.parentElement.children[index];
                        if (!item.headElement.isSameNode(currentElement)) {
                            if (index === 0) {
                                this.headElement.parentElement.firstElementChild.before(item.headElement);
                            } else {
                                this.headElement.parentElement.children[index - 1].after(item.headElement);
                            }
                        }
                    });
                }
                ipcRenderer.send(Constants.SIYUAN_SEND_WINDOWS, {cmd: "resetTabsStyle", data: "addRegionStyle"});
            });
        }

        this.panelElement = document.createElement("div");
        this.panelElement.classList.add("fn__flex-1");
        this.panelElement.innerHTML = options.panel || "";
        this.panelElement.setAttribute("data-id", this.id);
    }

    public updateTitle(title: string) {
        this.title = title;
        this.headElement.querySelector(".item__text").innerHTML = escapeHtml(title);
    }

    public addModel(model: Model) {
        this.model = model;
        model.parent = this;
    }

    public pin() {
        if (!this.headElement.previousElementSibling || (this.headElement.previousElementSibling && this.headElement.previousElementSibling.classList.contains("item--pin"))) {
            // 如果是第一个，或者前一个是 pinned，则不处理
        } else {
            let tempTab: Tab;
            let pinIndex = 0;
            let lastHeadElement: Element;
            this.parent.children.find((item, index) => {
                if (item.headElement.classList.contains("item--pin")) {
                    pinIndex = index + 1;
                    lastHeadElement = item.headElement;
                }
                if (item.id === this.id) {
                    tempTab = this.parent.children.splice(index, 1)[0];
                    return true;
                }
            });
            if (lastHeadElement) {
                lastHeadElement.after(tempTab.headElement);
            } else {
                this.parent.children[0].headElement.before(tempTab.headElement);
            }
            this.parent.children.splice(pinIndex, 0, tempTab);
        }
        this.headElement.classList.add("item--pin");
        if (this.docIcon || this.icon) {
            this.headElement.querySelector(".item__text").classList.add("fn__none");
        }
        saveLayout();
    }

    public setDocIcon(icon: string) {
        this.docIcon = icon;
        if (this.docIcon) {
            const iconElement = this.headElement.querySelector(".item__icon");
            if (iconElement) {
                iconElement.innerHTML = unicode2Emoji(icon);
            } else {
                this.headElement.querySelector(".item__text").insertAdjacentHTML("beforebegin", `<span class="item__icon">${unicode2Emoji(icon)}</span>`);
            }
            if (this.headElement.classList.contains("item--pin")) {
                this.headElement.querySelector(".item__text").classList.add("fn__none");
            }
        } else {
            // 添加图标后刷新界面，没有 icon
            this.headElement.querySelector(".item__icon")?.remove();
            this.headElement.querySelector(".item__text").classList.remove("fn__none");
        }
    }

    public unpin() {
        if (!this.headElement.nextElementSibling || (this.headElement.nextElementSibling && !this.headElement.nextElementSibling.classList.contains("item--pin"))) {
            // 如果是最后一个，或者后一个是 unpinned，则不处理
        } else {
            let tempTab: Tab;
            let pinIndex = 0;
            let lastHeadElement: Element;
            for (let index = 0; index < this.parent.children.length; index++) {
                if (this.parent.children[index].id === this.id) {
                    tempTab = this.parent.children.splice(index, 1)[0];
                    index--;
                }
                if (index > -1 && this.parent.children[index].headElement.classList.contains("item--pin")) {
                    pinIndex = index + 1;
                    lastHeadElement = this.parent.children[index].headElement;
                }
            }
            lastHeadElement.after(tempTab.headElement);
            this.parent.children.splice(pinIndex, 0, tempTab);
        }
        this.headElement.classList.remove("item--pin");
        if (this.docIcon || this.icon) {
            this.headElement.querySelector(".item__text").classList.remove("fn__none");
        }
        saveLayout();
    }

    public close() {
        this.parent.removeTab(this.id);
    }
}
