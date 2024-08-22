import { type Dispatch, type SetStateAction, useEffect, useMemo, useRef, useState } from "react";


const removeCookie = (name: string): void => {
    document.cookie = `${encodeURIComponent(name)}=;max-age=0`;
};

const enum TimeInSeconds {
    Second = 1,
    Minute = 60 * Second,
    Hour = 60 * Minute,
    Day = 24 * Hour,
    Year = 365 * Day
}

export const useCookieState = <S>(
    initialState: S | (() => S),
    cookieName: string,
    serialize: (state: S) => string | null = String
): [S, Dispatch<SetStateAction<S>>] => {
    const previousCookieNameRef = useRef<string>();
    const stateAndDispatch = useState(initialState);
    const [state] = stateAndDispatch;

    const cookieValue = useMemo(() => serialize(state), [serialize, state]);

    useEffect(() => {
        const previousCookieName = previousCookieNameRef.current;
        if (previousCookieName !== undefined) {
            removeCookie(previousCookieName);
        }
        previousCookieNameRef.current = cookieName;
    }, [cookieName]);

    useEffect(() => {
        if (cookieValue === null) {
            removeCookie(cookieName);
            return;
        }

        document.cookie =
            `${encodeURIComponent(cookieName)}=${encodeURIComponent(cookieValue)}`
            + `;max-age=${TimeInSeconds.Year}`;
    }, [cookieName, cookieValue]);

    return stateAndDispatch;
};
