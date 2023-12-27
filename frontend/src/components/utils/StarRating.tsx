import { useState } from "react";
import FontFaceObserver from "fontfaceobserver";

import Icon from "./Icon";

interface StarRatingProps {
    rating: number;
    setRating?: (rating: number) => void;
    color?: boolean;
}

function StarRating({ rating, setRating, color = false }: StarRatingProps) {
    const fontAwesomeRegular = new FontFaceObserver("Font Awesome 6 Pro", {weight: 400});
    const fontAwesomeSolid = new FontFaceObserver("Font Awesome 6 Pro", {weight: 900});
    fontAwesomeRegular.load().then(() => document.documentElement.classList.add('font-awesome-regular-ready'));
    fontAwesomeSolid.load().then(() => document.documentElement.classList.add('font-awesome-solid-ready'));

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
                    onClick={setRating ? () => setRating(i) : undefined}
                    onMouseEnter={setRating ? () => setTempRating(i) : undefined}
                    onMouseLeave={setRating ? () => setTempRating(rating) : undefined}
                />
            );
        }
        return stars;
    }

    return <div className="d-flex flex-nowrap m-0 p-0">{renderStars()}</div>;
}

export default StarRating;
