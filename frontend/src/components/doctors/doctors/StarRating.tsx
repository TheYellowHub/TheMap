import Icon from "../../utils/Icon";

interface StarRatingProps {
    rating: number;
}

function StarRating({ rating }: StarRatingProps) {
    function renderStars() {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(
                    <Icon icon="fa-star" solid={true} padding={false} />
                );
            } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
                stars.push(
                    <Icon
                        icon="fa-star-half-alt"
                        solid={true}
                        padding={false}
                    />
                );
            } else {
                stars.push(
                    <Icon icon="fa-star" solid={false} padding={false} />
                );
            }
        }
        return stars;
    }
    return renderStars();
}

export default StarRating;
