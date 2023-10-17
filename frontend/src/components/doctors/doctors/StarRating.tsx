import Icon from "../../utils/Icon";

function StarRating({ rating }: { rating: number }) {
    function renderStars() {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(<Icon icon="fa-star" solid={true} padding={false} />);
                // stars.push(<i className="fas fa-star p-0"></i>);
            } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
                stars.push(<Icon icon="fa-star-half-alt" solid={true} padding={false} />);
            } else {
                stars.push(<Icon icon="fa-star" solid={false} padding={false} />);
            }
        }
        return stars;
    }
    return renderStars();
}

export default StarRating;
