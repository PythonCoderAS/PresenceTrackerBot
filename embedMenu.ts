import { Embed } from "@discordjs/builders";

export interface MenuComponent {
    text?: string
    embed?: Embed
}

export class EmbedMenu {
    private components: MenuComponent[];
    public page: number = 0;

    constructor(components: MenuComponent[]) {
        if (components.length < 1){
            throw Error("components.length must be >= 1.")
        }
        this.components = components;
    }

    private get index(){
        return this.page - 1;
    }

    private inBounds(page){
        return 1 <= page && page <= this.components.length;
    }

    private doInteraction(){};
}