import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private Posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private httpClient: HttpClient) {}

  getPosts() {
    this.httpClient
      .get<{ message: String; Posts: Post[] }>(
        'http://localhost:3000/api/posts'
      )
      .subscribe((postData) => {
        this.Posts = postData.Posts;
        this.postsUpdated.next([...this.Posts]);
      });
  }

  addPost(title: string, content: string) {
    const post = {
      id: null,
      title: title,
      content: content,
    };
    this.httpClient
      .post<{ message: string }>('http://localhost:3000/api/posts', post)
      .subscribe((response) => {
        console.log(response.message);
        this.Posts.push(post); // Locally storing, but it runs when we get the response only on success
        this.postsUpdated.next([...this.Posts]); //observer
      });
  }
  getPostUpdatedListener() {
    return this.postsUpdated.asObservable(); // Passing it as an observable
  }
}
