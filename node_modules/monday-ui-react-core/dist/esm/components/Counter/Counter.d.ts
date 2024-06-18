import React from "react";
import VibeComponentProps from "../../types/VibeComponentProps";
import { CounterColor, CounterSize, CounterType } from "./CounterConstants";
export interface CounterProps extends VibeComponentProps {
    /** id to pass to the element */
    id?: string;
    /** element id to describe the counter accordingly */
    ariaLabeledBy?: string;
    /** Use className instead
     * @deprecated
     */
    wrapperClassName?: string;
    /** Custom class names to pass to the component wrapper */
    className?: string;
    /** Custom class names to pass to the component */
    counterClassName?: string;
    /** The numeric value of the counter */
    count?: number;
    /** Counter description */
    ariaLabel?: string;
    /** The size of the counter */
    size?: CounterSize;
    kind?: CounterType;
    /** The color of the counter */
    color?: CounterColor;
    /** maximum number of digits to display (see relevant story) */
    maxDigits?: number;
    /** Text prepended to counter value */
    prefix?: string;
    /** Callback to be called when the counter is clicked. */
    onMouseDown?: (event: React.MouseEvent<HTMLSpanElement>) => void;
    /** Disables the component's animation */
    noAnimation?: boolean;
}
declare const _default: ((import("../../types/VibeComponent").default<CounterProps, unknown> & Partial<{
    sizes: typeof CounterSize;
    colors: typeof CounterColor;
    kinds: typeof CounterType;
}>) | (React.FC<CounterProps> & Partial<{
    sizes: typeof CounterSize;
    colors: typeof CounterColor;
    kinds: typeof CounterType;
}>)) & {
    sizes: typeof CounterSize;
    colors: typeof CounterColor;
    kinds: typeof CounterType;
};
export default _default;
