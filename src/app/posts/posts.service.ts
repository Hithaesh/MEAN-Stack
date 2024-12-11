import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private Posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private httpClient: HttpClient) {}

  getPosts() {
    this.httpClient
      .get<{ message: String; Posts: any }>(
        'http://localhost:3000/api/posts'
      )
      .pipe(map((postData) => {
        return postData.Posts.map((post) => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
          }
        });
      }))
      .subscribe((transformedPosts) => {
        this.Posts = transformedPosts;
        this.postsUpdated.next([...this.Posts]);
      });
  }

  getPostUpdatedListener() {
    return this.postsUpdated.asObservable();
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
        this.Posts.push(post);
        this.postsUpdated.next([...this.Posts]);
      });
  }

  deletePost(postId: string) {
    this.httpClient.delete('http://localhost:3000/api/posts/' + postId)
    .subscribe(() => {
      console.log("Deleted!");
    })
  }
}
