import { SavedVideo } from '../models/saved-video.model';
import * as VideosActions from '../actions/video.actions';

export function videosReducer(state: SavedVideo[], action: VideosActions.Actions) {
  switch (action.type) {
    case VideosActions.UPDATE_VIDEOS:
      return action.payload;

    default:
      return state;
  }
}