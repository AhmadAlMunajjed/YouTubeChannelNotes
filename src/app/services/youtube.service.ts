import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {

  //#region varialbes
  private apiKey = 'AIzaSyB5aEx7sSMICvrKDEg0PL9k0Mv1n39odZ8';
  private maxResults = 10;
  private getVideosApiUrl(channelId): string {
    return `https://www.googleapis.com/youtube/v3/search?key=${this.apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=${this.maxResults}`;
  }
  //#endregion

  constructor(
    private httpClient: HttpClient,
  ) { }

  getVideos(channelId) {
    return this.httpClient.get(this.getVideosApiUrl(channelId)).toPromise();
  }
}
