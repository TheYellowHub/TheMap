import { useState } from "react";
import Icon from "./Icon";

interface StarRatingProps {
    rating: number;
    setRating?: (rating: number) => void;
    color?: boolean;
}

function StarRating({ rating, setRating, color = false }: StarRatingProps) {
    function renderStars() {
        const stars = [];
        const [tempRating, setTempRating] = useState<number>(rating);

        for (let i = 1; i <= 5; i++) {
            const icon = { name: "fa-star", solid: false };
            if (i <= tempRating) {
                icon.solid = true;
            } else if (i - tempRating <= 0.5) {
                icon.name = "fa-star-half-alt";
                icon.solid = true;
            }
            stars.push(
                <Icon
                    icon={icon.name}
                    solid={icon.solid}
                    padding={false}
                    key={`star-${i}`}
                    className={color ? "star-yellow" : ""}
                    onClick={() => setRating && setRating(i)}
                    onMouseEnter={() => setTempRating(i)}
                    onMouseLeave={() => setTempRating(rating)}
                />
            );
        }
        return stars;
    }

    return <div className="d-flex flex-nowrap m-0 p-0 pe-1">{renderStars()}</div>;
}

export default StarRating;
