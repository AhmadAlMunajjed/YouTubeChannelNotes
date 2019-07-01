import { Component } from '@angular/core';
import { YoutubeService } from './services/youtube.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

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
  dataLoaded: boolean;
  //#endregion

  constructor(
    private youtubeService: YoutubeService
  ) {

  }

  getSavedVideos(): Array<SavedVideo> {
    let savedVideosString = localStorage.getItem('savedvideos');
    let savedVideos = JSON.parse(savedVideosString);
    return savedVideos ? savedVideos : new Array<SavedVideo>();
  }

  updateNote(id, note) {
    let savedVideos: Array<SavedVideo> = this.getSavedVideos();
    let video = savedVideos.find(e => e.id == id);
    if (video) { // edit
      let index = savedVideos.findIndex(e => e.id == id);
      savedVideos[index].note = note;
    } else { // add
      savedVideos.push({
        id,
        note,
        order: this.getVideoOrder(id)
      });
    }

    this.updateSavedVideos(savedVideos);
    console.log('video');
    console.log(video);
  }

  updateSavedVideos(savedVideos) {
    localStorage.setItem('savedvideos', JSON.stringify(savedVideos));
  }

  getVideoOrder(id): number {
    return this.videos.findIndex(e => e.id == id);
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
      data['items'].forEach((item, index) => {
        this.videos.push({
          title: item.snippet.title,
          imageUrl: item.snippet.thumbnails.medium.url,
          id: item.id.videoId,
          order: this.getOrder(item.id.videoId, index),
          note: this.getNote(item.id.videoId),
          immutableNote: this.getNote(item.id.videoId),
          editMode: false,
        });
      });

    }).catch(() => {
      this.loading = false;
    });
  }

  getNote(id) {
    let savedVideos: Array<SavedVideo> = this.getSavedVideos();
    let video = savedVideos.find(e => e.id == id);
    return video ? video.note : "";
  }

  getOrder(id, defaultOrder) {
    let savedVideos: Array<SavedVideo> = this.getSavedVideos();
    let savedVideo = savedVideos.find(e => e.id == id);
    return savedVideo ? savedVideo.order : defaultOrder;

  }

  open(videoId) {
    window.open('https://www.youtube.com/watch?v=' + videoId, '_blank')
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.videos, event.previousIndex, event.currentIndex);
  }

  edit(video) {
    video.editMode = true;
  }

  save(video) {
    video.immutableNote = video.note;
    video.editMode = false;
    this.updateNote(video.id, video.note);
  }

  cancel(video) {
    video.note = video.immutableNote;
    video.editMode = false;
  }

}

export class SavedVideo {
  id: string;
  order: number;
  note: string;
}

export class Video {
  id: string;
  title: string;
  imageUrl: string;
  order: number;
  note: string;
  immutableNote: string;
  editMode: boolean;
}