import { Component } from '@angular/core';
import { YoutubeService } from './services/youtube.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Video, SavedVideo } from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  //#region variables
  channelId: string;
  videos = Array<Video>();
  loading: boolean;
  showData: boolean;
  dataLoaded: boolean;
  //#endregion

  constructor(
    private youtubeService: YoutubeService
  ) {

  }

  getVideos() {
    this.videos = [];

    if (!this.channelId) {
      return;
    }

    this.loading = true;

    this.youtubeService.getVideos(this.channelId).then(data => {
      if (!this.dataLoaded) {
        this.dataLoaded = true;
      }

      this.loading = false;
      this.showData = false;

      let items: Array<any> = data['items'];
      items.map(item => {
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
    savedVideos.map(item => {
      let video = videos.filter(e => e.id == item.id);
      this.videos.push(video[0]);
    });
  }

  open(videoId) {
    window.open('https://www.youtube.com/watch?v=' + videoId, '_blank')
  }

  drop(event: CdkDragDrop<string[]>) {
    let savedVideos = this.getSavedVideos();
    moveItemInArray(savedVideos, event.previousIndex, event.currentIndex);
    this.updateSavedVideos(savedVideos);

    moveItemInArray(this.videos, event.previousIndex, event.currentIndex);
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
  private getSavedVideos(): Array<SavedVideo> {
    let savedVideosString = localStorage.getItem('savedvideos_' + this.channelId);
    let savedVideos = JSON.parse(savedVideosString);
    return savedVideos ? savedVideos : new Array<SavedVideo>();
  }

  private updateSavedVideos(savedVideos) {
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