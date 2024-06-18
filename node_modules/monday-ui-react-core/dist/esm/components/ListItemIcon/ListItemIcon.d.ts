import React from "react";
import { ListItemIconMargin } from "./ListItemIconConstants";
import { ListItemComponentType } from "../ListItem/ListItemConstants";
import { SubIcon, VibeComponent, VibeComponentProps } from "../../types";
export interface ListItemIconProps extends VibeComponentProps {
    /**
     * the ListItem component [li, div, a]
     */
    component?: ListItemComponentType;
    icon?: SubIcon;
    /**
     * the position of the icon inside the list item (this sets the margins of the icon)
     */
    margin?: ListItemIconMargin;
}
declare const _default: ((VibeComponent<ListItemIconProps & React.RefAttributes<HTMLElement>, HTMLElement> & Partial<{
    margin: typeof ListItemIconMargin;
    components: typeof ListItemComponentType;
}>) | (React.FC<ListItemIconProps & React.RefAttributes<HTMLElement>> & Partial<{
    margin: typeof ListItemIconMargin;
    components: typeof ListItemComponentType;
}>)) & {
    margin: typeof ListItemIconMargin;
    components: typeof ListItemComponentType;
};
export default _default;
