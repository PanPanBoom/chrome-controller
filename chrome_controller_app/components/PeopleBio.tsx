import { PeopleDTO } from "@/dtos/show";
import { CustomText } from "./ui/CustomText";
import { ShowCarousel } from "./ShowCarousel";

type PeopleBioProps = {
    peopleData: PeopleDTO;
}

export const PeopleBio = (props: PeopleBioProps) => {
    console.log(props.peopleData);
    return (
        <>
            <CustomText className="text-justify">{props.peopleData.overview}</CustomText>
            {
                props.peopleData?.shows?.length > 0 &&
                <ShowCarousel shows={props.peopleData.shows} />
            }
        </>
    )
}