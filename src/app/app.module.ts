// core
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// plugins
import { StoreModule } from '@ngrx/store';
import { videosReducer } from './reducers';
import { SortablejsModule } from "ngx-sortablejs";

// components
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    StoreModule.forRoot({
      videos: videosReducer
    }),
    SortablejsModule.forRoot({
      animation: 100,
      // ghostClass: 'blue-background-class'
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
