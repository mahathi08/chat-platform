import { useState } from "react";

export default function useLocalStorage<T>(
    key: string,
    initialValue: T
) {
    const [storedValue, setStoredValue] =
        useState<T>(() => {
            const item =
                localStorage.getItem(key);

            if (!item) {
                return initialValue;
            }

            return JSON.parse(item);
        });

    function setValue(value: T) {
        setStoredValue(value);

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );
    }

    return [storedValue, setValue] as const;
}