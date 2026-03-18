import { PressableProps } from "react-native"
import { Button } from "./ui/Button"
import { TextButton, TextButtonProps } from "./ui/TextButton"
import { useState } from "react"
import { cn } from "@/etc/utils"

type ShowCarouselFilterProps = TextButtonProps & {
    active: boolean;
}

export const ShowCarouselFilter = (props: ShowCarouselFilterProps) => {
    return (
        <TextButton className={cn("aspect-auto px-6 py-2", props.active ? "bg-primary" : "")} textClassName={props.active ? "text-text" : "text-secondary"} {...props}>
            {props.children}
        </TextButton>
    )
}