import React, { ReactElement } from "react";
import VibeComponentProps from "../../../types/VibeComponentProps";
import { TabPanelsAnimationDirection } from "./TabPanelsConstants";
import { TabPanelProps } from "../TabPanel/TabPanel";
export interface TabPanelsProps extends VibeComponentProps {
    renderOnlyActiveTab?: boolean;
    activeTabId?: number;
    animationDirection?: TabPanelsAnimationDirection;
    children?: ReactElement<TabPanelProps> | ReactElement<TabPanelProps>[];
}
declare const _default: ((import("../../../types/VibeComponent").default<TabPanelsProps, unknown> & Partial<{
    animationDirections: typeof TabPanelsAnimationDirection;
}>) | (React.FC<TabPanelsProps> & Partial<{
    animationDirections: typeof TabPanelsAnimationDirection;
}>)) & {
    animationDirections: typeof TabPanelsAnimationDirection;
};
export default _default;
