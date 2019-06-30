import { Component } from '@angular/core';
import { YoutubeService } from './services/youtube.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  channelId: string;
  videos = [];
  constructor(

    private youtubeService: YoutubeService
  ) {

  }

  getVideos() {
    this.videos = [];

    if (!this.channelId) {
      return;
    }

    this.youtubeService.getVideos(this.channelId).then(data => {
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
    });
  }

  open(videoId) {
    window.open('https://www.youtube.com/watch?v=' + videoId, '_blank')
  }
}
