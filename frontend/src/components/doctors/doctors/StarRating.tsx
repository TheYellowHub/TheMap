import Icon from "../../utils/Icon";

interface StarRatingProps {
    rating: number;
    color?: boolean;
}

function StarRating({ rating, color = false }: StarRatingProps) {
    function renderStars() {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            const icon = { name: "fa-star", solid: false };
            if (i <= rating) {
                icon.solid = true;
            } else if (i - rating <= 0.5) {
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
                />
            );
        }
        return stars;
    }

    return <div className="d-flex flex-nowrap m-0 p-0 pe-1">{renderStars()}</div>;
}

export default StarRating;
