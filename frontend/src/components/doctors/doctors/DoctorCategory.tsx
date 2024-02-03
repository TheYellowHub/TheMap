interface DoctorCategoryProps {
    category?: string;
}

function DoctorCategory({ category }: DoctorCategoryProps) {
    if (category) {
        return <div className="doctor-category text-black text-nowrap">{category}</div>;
    } else {
        return <></>;
    }
}
export default DoctorCategory;
