import { useEffect, useState } from "react";

const useEffectOnlyAfterMount = (func: () => void, deps: any[]) => {
    const [didMount, setDidMount] = useState(false);

    useEffect(() => {
        if (didMount) {
            func();
        } else {
            setDidMount(true);
        }
    }, deps);
};

export default useEffectOnlyAfterMount;
