import { View, ViewProps } from "react-native";
import { CustomText } from "./CustomText";
import { Button } from "./Button";
import { cn } from "@/etc/utils";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { colors } from "@/constants/colors";

const getPaginationGroup = (currentPage: number, maxPage: number, groupSize: number): number[] => {
    if (maxPage <= groupSize)
        return Array.from({ length: maxPage }, (_, i) => i + 1);
    
    const half = Math.floor(groupSize / 2);
    let start = currentPage - half;
    let end = currentPage + half;

    if (groupSize % 2 === 0)
    {
        start = currentPage - Math.floor(groupSize / 2);
        end = currentPage + Math.floor(groupSize / 2) - 1;
    }

    if (start < 1)
    {
        end += (1 - start);
        start = 1;
    }

    if (end > maxPage)
    {
        start -= (end - maxPage);
        end = maxPage;
    }

    return Array.from({ length: (end - start + 1) }, (_, i) => start + i);
};

type PaginationProps = ViewProps & {
    maxPage: number;
    currentPage: number;
    onPageChange: (newPage: number) => void;
}

export const Pagination = ({maxPage, currentPage, onPageChange, className, ...props}: PaginationProps) => {
    if(maxPage === 1)
        return null;
    
    const groupSize = 5;

    const PageComponent = ({ page }: {page: number}) => 
        <Button className={cn(page === currentPage ? "bg-primary" : "bg-transparent")} onPress={() => onPageChange(page)}>
            <CustomText>{page}</CustomText>
        </Button>
    
    const pages = getPaginationGroup(currentPage, maxPage, groupSize);

    return (
        <View className={cn("flex-row items-center", className)} {...props}>
            <Button className="bg-transparent" onPress={() => onPageChange(Math.max(currentPage - 1, 1))} disabled={currentPage === 1}>
                <ChevronLeft color={colors.text}/>
            </Button>
            {
                !pages.includes(1) &&
                <>
                    <PageComponent page={1} />
                    <CustomText>...</CustomText>
                </>
            }
            {
                pages.map(page => <PageComponent key={page} page={page}/>)
            }
            {
                !pages.includes(maxPage) &&
                <>
                    <CustomText>...</CustomText>
                    <PageComponent page={maxPage} />
                </>
            }
            <Button className="bg-transparent" onPress={() => onPageChange(Math.min(currentPage + 1, maxPage))} disabled={currentPage === maxPage}>
                <ChevronRight color={colors.text}/>
            </Button>
        </View>
    )
}