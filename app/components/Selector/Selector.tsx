import { useState } from "react";
import Dropdown, { DropdownToggleBtn } from "../NewDropdown/Dropdown";
import DropdownMenu from "../NewDropdown/DropdownMenu/DropdownMenu";
import { DropdownItem } from "../NewDropdown/DropdownItem/DropdownItem";
import { IconChevronDown } from "@tabler/icons-react";

type SelectorOption<T extends string> = {
    value: T;
    label: string;
    description: string;
    icon: React.ReactNode;
};

type SelectorProps<T extends string> = {
    toggleButton?: (selectedOption: SelectorOption<T>) => DropdownToggleBtn;
    optionElement?: (option: SelectorOption<T>) => React.ReactElement; 
    options: SelectorOption<T>[];
    value: T;
    onChange: (v: T) => void;
};

export default function Selector<T extends string>({
    toggleButton,
    optionElement,
    options,
    value,
    onChange,
}: SelectorProps<T>) {
    const [open, setOpen] = useState(false);

    const selected = options.find((o) => o.value === value)!;

    const DefaultToggleButton = ({ selectedOption, onClick }: { selectedOption:  SelectorOption<T>, onClick?: React.MouseEventHandler<HTMLButtonElement>}) => {
        return (
            <button
                type="button"
                className="
                    flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                    bg-bgPrimary hover:bg-bgHoverPrimary
                    border border-borderPrimary hover:border-appPrimary/40
                    text-textPrimary/70 hover:text-appPrimary
                    text-xs font-medium
                    transition-all duration-200
                "
                onClick={onClick}
            >
                {selectedOption.icon}

                <span>{selectedOption.label}</span>

                <IconChevronDown
                    size={13}
                    className={`transition-transform duration-200 ${
                        open ? "rotate-180" : ""
                    }`}
                />
            </button>
        )
    }

    return (
        <Dropdown
            isOpen={open}
            setIsOpen={setOpen}
            toggleButton={toggleButton ? toggleButton(selected) : <DefaultToggleButton selectedOption={selected}/>}
        >
            <DropdownMenu> 
                {options.map((opt) => {
                    const active = opt.value === value;

                    if(optionElement) return optionElement(opt);

                    return (
                        <DropdownItem
                            key={opt.value}
                            isActive={active}
                            onClick={() => {
                                onChange(opt.value);
                                setOpen(false);
                            }}
                            className="
                                !w-full !flex !items-start gap-3
                                px-3.5 py-2.5
                                hover:bg-bgHoverPrimary
                                transition-colors duration-150
                                text-left cursor-pointer
                            "
                        >
                            <span
                                className={`mt-0.5 text-textPrimary/40`}
                            >
                                {opt.icon}
                            </span>

                            <div className="flex-1 min-w-0">
                                <p
                                    className={`text-xs font-semibold`}
                                >
                                    {opt.label}
                                </p>

                                <p className="text-[11px] text-textPrimary/40 leading-tight mt-0.5">
                                    {opt.description}
                                </p>
                            </div>
                        </DropdownItem>
                    );
                })}
            </DropdownMenu>
        </Dropdown>
    );
}