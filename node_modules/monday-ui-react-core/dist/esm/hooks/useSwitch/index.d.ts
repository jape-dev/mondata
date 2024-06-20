declare enum SwitchRole {
    CHECKBOX = "checkbox",
    BUTTON = "button"
}
export interface UseSwitchProps {
    isChecked?: boolean;
    defaultChecked?: boolean;
    onChange?: (value: boolean) => void;
    isDisabled?: boolean;
}
declare function useSwitch({ isChecked, defaultChecked, onChange, isDisabled }?: UseSwitchProps): {
    isChecked: boolean;
    onChange: () => void;
};
declare namespace useSwitch {
    var switchRole: typeof SwitchRole;
}
export default useSwitch;
