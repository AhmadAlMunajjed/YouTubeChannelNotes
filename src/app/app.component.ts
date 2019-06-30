import { Component } from '@angular/core';
import { YoutubeService } from './services/youtube.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  channelId: string;
  videos = [];
  loading: boolean;

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
      this.loading = false;
      console.log(data['items']);
      data['items'].forEach(item => {
        this.videos.push({
          ...item.snippet,
          id: item.id.videoId,
          order: Math.floor(Math.random() * 11),
          note: 55
        });
      });
      this.videos = this.videos.sort(e => e.order);
      console.log(this.videos);
    }).catch(() => {
      this.loading = false;
    });
  }

  open(videoId) {
    window.open('https://www.youtube.com/watch?v=' + videoId, '_blank')
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.videos, event.previousIndex, event.currentIndex);
  }
}
