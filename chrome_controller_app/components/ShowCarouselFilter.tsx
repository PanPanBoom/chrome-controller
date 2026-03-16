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
        <TextButton className={cn("aspect-auto rounded-xl px-4 py-1", props.active ? "bg-primary" : "")} textClassName="text-text" {...props}>
            {props.children}
        </TextButton>
    )
}