import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Post } from './post.model';
@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private Posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private httpClient: HttpClient, private router: Router) {}

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

  getPost(id: string) {
    return this.httpClient.get<{_id: string, title: string, content: string}>(`http://localhost:3000/api/posts/${id}`);
  }

  addPost(title: string, content: string) {
    const post = {
      id: null,
      title: title,
      content: content,
    };
    this.httpClient
      .post<{ message: string, postId: string}>('http://localhost:3000/api/posts', post)
      .subscribe((response) => {
        post.id = response.postId;
        this.Posts.push(post);
        this.postsUpdated.next([...this.Posts]);
        this.router.navigate(["/"]);
      });
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = {
      id: id,
      title: title,
      content: content,
    }
    this.httpClient.put('http://localhost:3000/api/posts/' + id, post)
    .subscribe( (response) => {
      const updatedPosts = [...this.Posts];
      const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
      updatedPosts[oldPostIndex] = post;
      this.Posts = updatedPosts;
      this.postsUpdated.next([...this.Posts]);
      //Todo: Navigates to the "VIEW MY POST Page"
      //? We are using the Angular router, router.navigate(), paramters should be same as routerLink
      //* router.navigate(["/"]) "/" = points to the root page.
      this.router.navigate(["/"]);
    })
  }

  deletePost(postId: string) {
    this.httpClient.delete<{message: string}>('http://localhost:3000/api/posts/' + postId)
    .subscribe(() => {
      const updatedPosts = this.Posts.filter((post) => post.id !== postId);
      this.Posts = updatedPosts;
      this.postsUpdated.next([...this.Posts]);
    })
  }
}
