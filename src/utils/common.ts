import { lazy } from "react";

export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const lazyLoad = (path: string, namedExport: string) => {
    return lazy(() => {
        const promise = import(path);
        if (namedExport) {
            return promise.then((module) => ({ default: module[namedExport] }));
        }
        return promise;
    })
}
