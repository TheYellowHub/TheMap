import { useEffect, useRef } from "react";

const useEffectOnlyAfterMount = (func: () => void, deps: any[]) => {
    const didMount = useRef(false);

    useEffect(() => {
        if (didMount.current) func();
        else didMount.current = true;
    }, deps);
};

export default useEffectOnlyAfterMount;
