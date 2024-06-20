import { FC } from "react";
import VibeComponentProps from "../../types/VibeComponentProps";
export interface MockToggleProps extends VibeComponentProps {
    areLabelsHidden?: boolean;
    checked?: boolean;
    offOverrideText?: string;
    onOverrideText?: string;
    selectedClassName?: string;
    disabled: boolean;
}
export declare const MockToggle: FC<MockToggleProps>;
