import { HamburgerToggle } from "@/components/HamburgerToggle";
import { useZoom } from "@/contexts/ZoomContext";
import { CSSModuleClasses } from "chess-utils";
import Link from "next/link";
import { type FC, useState } from "react";
import uncheckedClasses from "./Header.module.scss";


const classes = new CSSModuleClasses(uncheckedClasses);


const resetZoomImage = (
    <svg
        className={classes.get("resetZoomImage")}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 21 21"
    >
        <path
            d="M3.5 8.5a5 5 0 1 0 1.057-3.074M4.5 1.5v4h4m9 12-5.379-5.379"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);


const lightThemeImage = (
    <svg
        className={classes.get("lightThemeImage")}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
    >
        <path
            d="
            M12 0a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0V1a1 1 0 0 1 1-1zM4.929 3.515a1 1 0 0 0-1.414
            1.414l2.828 2.828a1 1 0 0 0 1.414-1.414L4.93 3.515zM1 11a1 1 0 1 0 0 2h4a1 1 0 1 0
            0-2H1zm17 1a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2h-4a1 1 0 0 1-1-1zm-.343 4.243a1 1 0 0 0-1.414
            1.414l2.828 2.828a1 1 0 1 0 1.414-1.414l-2.828-2.828zm-9.9 1.414a1 1 0 1
            0-1.414-1.414L3.515 19.07a1 1 0 1 0 1.414 1.414l2.828-2.828zM20.485 4.929a1 1 0 0
            0-1.414-1.414l-2.828 2.828a1 1 0 1 0 1.414 1.414l2.828-2.828zM13 19a1 1 0 1 0-2 0v4a1 1
            0 1 0 2 0v-4zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z
            "
        />
    </svg>
);


const darkThemeImage = (
    <svg
        className={classes.get("darkThemeImage")}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 256 256"
    >
        <path
            d="
            M253.279 169.116a2.818 2.818 0 0 0-3.327-.174c-46.405 30.528-108.638
            24.135-147.978-15.202-39.337-39.337-45.73-101.57-15.2-147.975a2.81 2.81 0 0
            0-3.4-4.15A130.314 130.314 0 0 0 39.756 30.51c-51.128 51.128-51.128 134.324 0 185.452
            25.563 25.562 59.145 38.345 92.724 38.345 33.583 0 67.162-12.783 92.728-38.345a130.362
            130.362 0 0 0 28.898-43.62 2.816 2.816 0 0 0-.826-3.226zm-34.789-54.831a46.506 46.506 0
            0 1-29.28-29.278 5.387 5.387 0 0 0-5.173-3.748c-2.383 0-4.414 1.472-5.17 3.751a46.508
            46.508 0 0 1-29.277 29.275 5.387 5.387 0 0 0-3.749 5.173c0 2.383 1.472 4.414 3.749
            5.173a46.489 46.489 0 0 1 29.274 29.278h.003c.759 2.278 2.787 3.748 5.17 3.748 2.386 0
            4.418-1.472 5.174-3.748a46.514 46.514 0 0 1 29.277-29.278 5.384 5.384 0 0 0
            3.751-5.173c0-2.386-1.472-4.417-3.748-5.173zm12.311-80.347a24.68 24.68 0 0
            1-15.539-15.536 4.28 4.28 0 0 0-8.132.003 24.658 24.658 0 0 1-15.531 15.533 4.28 4.28 0
            0 0-.003 8.127A24.683 24.683 0 0 1 207.133 57.6a4.285 4.285 0 0 0 4.06 2.942h.006a4.285
            4.285 0 0 0 4.063-2.939 24.68 24.68 0 0 1 15.54-15.536 4.288 4.288 0 0 0 2.939-4.064
            4.288 4.288 0 0 0-2.94-4.066zm-82.504 19.985a30.708 30.708 0 0 1-19.338-19.336 4.603
            4.603 0 0 0-8.745 0 30.71 30.71 0 0 1-19.336 19.336 4.603 4.603 0 0 0 0 8.745 30.708
            30.708 0 0 1 19.336 19.338 4.603 4.603 0 0 0 8.745 0 30.713 30.713 0 0 1 19.335-19.338
            4.608 4.608 0 0 0 .003-8.745z
            "
        />
    </svg>
);


const systemThemeImage = (
    <svg
        className={classes.get("systemThemeImage")}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 407.484 407.484"
    >
        <path
            d="
            M378.939 16.564H28.544C12.805 16.564 0 29.369 0 45.108v219.985c0 15.739 12.805 28.544
            28.544 28.544h131.46l-7.197 33.431h-24.994a13.428 13.428 0 0 0-9.818 4.268l-34.512
            37a13.424 13.424 0 0 0 9.818 22.583h220.885a.067.067 0 0 1 .02 0c7.415 0 13.427-6.011
            13.427-13.426 0-3.766-1.55-7.168-4.047-9.606l-34.094-36.551a13.426 13.426 0 0
            0-9.818-4.268H254.68l-7.197-33.431h131.459c15.74 0 28.545-12.805
            28.545-28.544V45.108c-.003-15.739-12.807-28.544-28.548-28.544zm-7.697
            243.173h-335V50.465h335v209.272z
            "
        />
    </svg>
);


export type HeaderProps = {
    readonly isDarkTheme: boolean | undefined;
    readonly setIsDarkTheme: (value: boolean | undefined) => void;
};

export const Header: FC<HeaderProps> = ({ isDarkTheme, setIsDarkTheme }) => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [, setZoom] = useZoom();

    const renderThemeButton = (buttonIsDarkTheme: typeof isDarkTheme, index: number) => (
        <button
            key={index}
            className={
                classes.build()
                    .add("themingButton")
                    .addIf(isDarkTheme === buttonIsDarkTheme, "selected")
                    .class
            }
            onClick={
                isDarkTheme === buttonIsDarkTheme
                    ? undefined
                    : () => setIsDarkTheme(buttonIsDarkTheme)
            }
        >
            {
                buttonIsDarkTheme === undefined
                    ? systemThemeImage
                    : buttonIsDarkTheme ? darkThemeImage : lightThemeImage
            }
        </button>
    );

    return (
        <header className={classes.get("header")}>
            <div className={classes.get("toggleContainer")}>
                <HamburgerToggle
                    isOpen={!isCollapsed}
                    onClick={() => setIsCollapsed(!isCollapsed)}
                />
            </div>
            <div
                className={
                    classes.build()
                        .add("collapsible")
                        .addIf(isCollapsed, "collapsed")
                        .class
                }
            >
                <div className={classes.get("collapsibleInner")}>
                    <section className={classes.get("content")}>
                        <Link className={classes.get("link")} href="./offline">Offline</Link>
                        <Link className={classes.get("link")} href="./online">Online</Link>
                        <button
                            className={classes.get("resetZoomButton")}
                            onClick={() => setZoom(1)}
                        >
                            {resetZoomImage}
                        </button>
                        <div className={classes.get("themingPanel")}>
                            {[true, undefined, false].map(renderThemeButton)}
                        </div>
                    </section>
                </div>
            </div>
        </header>
    );
};
