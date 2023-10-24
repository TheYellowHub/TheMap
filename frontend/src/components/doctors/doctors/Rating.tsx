import StarRating from "./StarRating";

interface RatingProps {
    averageRating: number;
    totalReviews: number;
}

function Rating({ averageRating, totalReviews }: RatingProps) {
    return (
        <div className="dark-grey row w-100 m-0 mt-auto flex-nowrap">
            <div className="col ps-0 text-nowrap">
                <p className="">
                    {StarRating({ rating: averageRating })} {averageRating}
                </p>
            </div>
            <div className="col-auto pe-0">
                <p className="">{totalReviews} Reviews</p>
            </div>
        </div>
    );
}

export default Rating;
