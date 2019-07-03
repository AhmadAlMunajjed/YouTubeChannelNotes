import { Component } from '@angular/core';
import { YoutubeService } from './services/youtube.service';
import { Video, SavedVideo } from './models';
import { Store } from '@ngrx/store';
import { AppState } from './app.state';
import { UpdateVideos } from './actions/video.actions';
import { SortablejsOptions } from 'ngx-sortablejs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  //#region variables
  sortablejsOptions: SortablejsOptions;
  channelId: string;
  videos = Array<Video>();
  loading: boolean;
  showData: boolean;
  dataLoaded: boolean;
  //#endregion

  constructor(
    private youtubeService: YoutubeService,
    private store: Store<AppState>
  ) {
    this.store.select('videos').subscribe(savedVideos => {
      console.log(savedVideos);
    });
    this.configureSortable();
  }

  private configureSortable() {
    this.sortablejsOptions = {
      onUpdate: (event) => {
        let savedVideos = this.getSavedVideos();
        this.moveItemInArray(savedVideos, event.oldIndex, event.newIndex);
        this.updateSavedVideos(savedVideos);
      }
    };
  }

  getVideos() {
    this.videos = [];

    if (!this.channelId) {
      return;
    }

    this.loading = true;

    this.youtubeService.getVideos(this.channelId).then((data: any) => {
      if (!this.dataLoaded) {
        this.dataLoaded = true;
      }

      this.loading = false;
      this.showData = false;

      data.items.map(item => {
        this.videos.push({
          title: item.snippet.title,
          imageUrl: item.snippet.thumbnails.default.url,
          id: item.id.videoId,
          note: this.getNote(item.id.videoId),
          immutableNote: this.getNote(item.id.videoId),
          editMode: false,
        });
      });

      this.onLoadVideos();

      this.sortVideos();

      this.showData = true;

    }).catch(() => {
      this.loading = false;
    });
  }

  private sortVideos() {
    let videos = this.videos;
    this.videos = [];

    let savedVideos = this.getSavedVideos();
    this.store.dispatch(new UpdateVideos(savedVideos));
    savedVideos.map(item => {
      let video = videos.filter(e => e.id == item.id);
      if (video) {
        this.videos.push(video[0]);
      }
    });
  }

  open(videoId) {
    window.open('https://www.youtube.com/watch?v=' + videoId, '_blank')
  }


  edit(video) {
    video.editMode = true;
  }

  save(video) {
    video.immutableNote = video.note;
    video.editMode = false;
    this.updateVideoNote(video.id, video.note);
  }

  cancel(video) {
    video.note = video.immutableNote;
    video.editMode = false;
  }

  //#region private functions
  moveItemInArray(arr, old_index, new_index) {
    if (new_index >= arr.length) {
      var k = new_index - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr;
  };


  private getSavedVideos(): Array<SavedVideo> {
    let savedVideosString = localStorage.getItem('savedvideos_' + this.channelId);
    let savedVideos = JSON.parse(savedVideosString);
    return savedVideos ? savedVideos : new Array<SavedVideo>();
  }

  private updateSavedVideos(savedVideos) {
    this.store.dispatch(new UpdateVideos(savedVideos));
    localStorage.setItem('savedvideos_' + this.channelId, JSON.stringify(savedVideos));
  }

  private onLoadVideos() {
    let savedVideos = this.getSavedVideos();

    this.videos.forEach((video, index) => {
      let savedVideo = savedVideos.find(e => e.id == video.id);
      if (!savedVideo) {
        savedVideos.push({
          id: video.id,
          note: ''
        })
      }
    });

    this.updateSavedVideos(savedVideos);
  }

  private updateVideoNote(id, note) {
    let savedVideos = this.getSavedVideos();
    this.store.dispatch(new UpdateVideos(savedVideos));
    let video = savedVideos.find(e => e.id == id);
    if (video) {
      let index = savedVideos.findIndex(e => e.id == id);
      savedVideos[index].note = note;
    }
    this.updateSavedVideos(savedVideos);
  }

  private getSavedOrder(video) {
    let savedVideos = this.getSavedVideos();
    let index = savedVideos.findIndex(e => e.id == video.id);
    return index;
  }

  private getNote(id) {
    let savedVideos = this.getSavedVideos();
    let video = savedVideos.find(e => e.id == id);
    return video ? video.note : "";
  }

  //#endregion

}