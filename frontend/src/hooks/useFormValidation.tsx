import { useEffect } from "react";

export default function useFormValidation( formRef: React.RefObject<HTMLFormElement> ) {
    const reportValidity = () => {
        const inputs: NodeListOf<HTMLInputElement> | undefined = formRef.current?.querySelectorAll("input, textarea");
        inputs?.forEach((input) => input?.reportValidity());
    };

    const isFormValid = () => {
        return formRef?.current?.checkValidity();
    };

    useEffect(() => {
        const inputs = formRef.current?.querySelectorAll("input, textarea");
        inputs?.forEach((input) =>
            input.addEventListener("input", (e) => {
                (e.target as HTMLInputElement).reportValidity();
            })
        );
    }, [formRef]);

    return (
        {reportValidity, isFormValid}
    );
}