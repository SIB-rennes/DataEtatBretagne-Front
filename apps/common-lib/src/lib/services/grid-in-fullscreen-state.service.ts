import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class GridInFullscreenStateService {

    private _is_fullscreen = false;


    public get fullscreen(): boolean {
        return this._is_fullscreen;
    }

    public set fullscreen(data) {
        this._is_fullscreen = data;
    }
}