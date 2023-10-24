import Icon from "../../utils/Icon";

interface StarRatingProps {
    rating: number;
}

function StarRating({ rating }: StarRatingProps) {
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
                <Icon icon={icon.name} solid={icon.solid} padding={false} />
            );
        }
        return stars;
    }
    return renderStars();
}

export default StarRating;
