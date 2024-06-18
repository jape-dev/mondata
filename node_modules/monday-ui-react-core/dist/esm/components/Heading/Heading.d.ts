import React, { ReactNode } from "react";
import VibeComponent from "../../types/VibeComponent";
import { HeadingType, HeadingWeight } from "./HeadingConstants";
import { TypographyProps } from "../Typography/Typography";
import { TypographyAlign, TypographyColor } from "../Typography/TypographyConstants";
export interface HeadingProps extends TypographyProps {
    type?: HeadingType;
    weight?: HeadingWeight;
    align?: TypographyAlign;
    color?: TypographyColor;
    children: ReactNode;
}
declare const _default: ((VibeComponent<HeadingProps & React.RefAttributes<HTMLElement>, HTMLElement> & Partial<{
    types: typeof HeadingType;
    weights: typeof HeadingWeight;
    align: typeof TypographyAlign;
    colors: typeof TypographyColor;
}>) | (React.FC<HeadingProps & React.RefAttributes<HTMLElement>> & Partial<{
    types: typeof HeadingType;
    weights: typeof HeadingWeight;
    align: typeof TypographyAlign;
    colors: typeof TypographyColor;
}>)) & {
    types: typeof HeadingType;
    weights: typeof HeadingWeight;
    align: typeof TypographyAlign;
    colors: typeof TypographyColor;
};
export default _default;
