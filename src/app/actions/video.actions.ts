import { Action } from '@ngrx/store'
import { SavedVideo } from '../models/saved-video.model';

export const UPDATE_VIDEOS = '[VIDEOS] Update'

export class UpdateVideos implements Action {
    readonly type = UPDATE_VIDEOS

    constructor(public payload: SavedVideo[]) { }
}

export type Actions = UpdateVideos
