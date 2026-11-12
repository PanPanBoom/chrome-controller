import { TextButton, TextButtonProps } from "./ui/TextButton"
import { cn } from "@/etc/utils"

type FilterProps = TextButtonProps & {
    active: boolean;
}

export const Filter = (props: FilterProps) => {
    return (
        <TextButton className={cn("aspect-auto px-6 py-2", props.active ? "bg-primary" : "")} textClassName={props.active ? "text-text" : "text-secondary"} {...props}>
            {props.children}
        </TextButton>
    )
}