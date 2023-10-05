function StarRating({ rating }: { rating: number }) {
    function renderStars() {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(<i className="fas fa-star p-0"></i>);
            } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
                stars.push(<i className="fas fa-star-half-alt p-0"></i>);
            } else {
                stars.push(<i className="far fa-star p-0"></i>);
            }
        }
        return stars;
    }
    return renderStars();
}

export default StarRating;
