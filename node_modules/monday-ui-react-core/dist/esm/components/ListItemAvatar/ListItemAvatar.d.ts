import React from "react";
import { VibeComponent, VibeComponentProps } from "../../types";
import { ListItemComponentType } from "../ListItem/ListItemConstants";
export interface ListItemAvatarProps extends VibeComponentProps {
    /**
     * the ListItem component [li, div, a]
     */
    component?: ListItemComponentType;
    src?: string;
    avatarClassName?: string;
}
declare const _default: ((VibeComponent<ListItemAvatarProps & React.RefAttributes<HTMLElement>, HTMLElement> & Partial<{
    components: typeof ListItemComponentType;
}>) | (React.FC<ListItemAvatarProps & React.RefAttributes<HTMLElement>> & Partial<{
    components: typeof ListItemComponentType;
}>)) & {
    components: typeof ListItemComponentType;
};
export default _default;
