interface DoctorCategoryProps {
    category?: string;
}

function DoctorCategory({ category }: DoctorCategoryProps) {
    if (category) {
        return (
            <div className="doctorCategoryRibbon">
                <p className="text-black">{category}</p>
            </div>
        );
    } else {
        return <div className="doctorEmptyCategory"></div>;
    }
}
export default DoctorCategory;
