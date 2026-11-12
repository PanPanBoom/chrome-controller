import { FilterDTO } from "@/components/FilterGroup";

export type App = {
    name: string;
    img: string;
    url: string;
    filters: FilterDTO[];
    redirect?: string;
}