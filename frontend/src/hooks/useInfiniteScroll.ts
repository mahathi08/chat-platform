import { useEffect, RefObject } from "react";

interface Props {
    target: RefObject<HTMLElement>;
    callback: () => void;
    enabled?: boolean;
}

export default function useInfiniteScroll({
    target,
    callback,
    enabled = true,
}: Props) {
    useEffect(() => {
        if (!enabled) return;

        const element = target.current;

        if (!element) return;

        function handleScroll() {
            if (
                element.scrollTop +
                    element.clientHeight >=
                element.scrollHeight - 100
            ) {
                callback();
            }
        }

        element.addEventListener(
            "scroll",
            handleScroll
        );

        return () =>
            element.removeEventListener(
                "scroll",
                handleScroll
            );
    }, [target, callback, enabled]);
}