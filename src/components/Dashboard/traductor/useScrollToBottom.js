import { useEffect, useRef } from 'react';

const useScrollToBottom = (dependencies, shouldScroll = true) => {
    const endRef = useRef(null);

    useEffect(() => {
        if (endRef.current && shouldScroll) {
            endRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [dependencies, shouldScroll]);

    return endRef;
};

export default useScrollToBottom;
