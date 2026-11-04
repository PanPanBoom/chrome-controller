import { AppContext } from "@/contexts/appContext";
import { ShowDTO } from "@/dtos/show";
import { getPeopleFilmography } from "@/server/api";
import { useContext, useEffect, useState } from "react";
import { ShowCarousel } from "./ShowCarousel";
import { CustomTitle } from "./ui/CustomTitle";
import { View } from "react-native";

type PeopleFilmographyProps = {
    peopleId: string;
}

export const PeopleFilmography = (props: PeopleFilmographyProps) => {
    const { server } = useContext(AppContext);
    const [filmography, setFilmography] = useState<Record<string, ShowDTO[]>>({});

    useEffect(() => {
        getPeopleFilmography(server.ip, props.peopleId)
            .then(res => res.json())
            .then(data => setFilmography(data));
    }, []);

    console.log(filmography);

    return (
        <>
            {
                Object.entries(filmography).reverse().map(([year, shows]) => 
                    <View key={year} className="gap-2">
                        <CustomTitle>{year}</CustomTitle>
                        <ShowCarousel shows={shows} />
                    </View>
                )
            }
        </>
    )
}