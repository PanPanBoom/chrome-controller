import { PeopleDTO } from "@/dtos/show";
import { CustomText } from "./ui/CustomText";
import { ShowCarousel } from "./ShowCarousel";
import { CustomTitle } from "./ui/CustomTitle";

type PeopleBioProps = {
    peopleData: PeopleDTO;
}

export const PeopleBio = (props: PeopleBioProps) => {
    return (
        <>
            <CustomText className="text-justify">{props.peopleData.biography}</CustomText>
            {
                props.peopleData?.shows?.length > 0 &&
                <>
                    <CustomTitle>Connu pour</CustomTitle>
                    <ShowCarousel shows={props.peopleData.shows} />
                </>
            }
        </>
    )
}