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
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

  constructor(private httpClient: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    console.log(queryParams); // '?pagesize=1&page=2'
    this.httpClient
      .get<{ message: String; Posts: any, maxPosts: number }>(
        'http://localhost:3000/api/posts'+ queryParams
      )
      .pipe(
        map((postData) => {
        return {
          posts: postData.Posts.map((post) => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath
          }
        }), maxPosts: postData.maxPosts};
      }))
      .subscribe((transformedPostData) => {
        this.Posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.Posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }

  getPostUpdatedListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.httpClient.get<{_id: string, title: string, content: string, imagePath: string}>(`http://localhost:3000/api/posts/${id}`);
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);

    this.httpClient
      .post<{ message: string, post: Post}>('http://localhost:3000/api/posts', postData) 
      .subscribe((response) => {
        this.router.navigate(["/"]); 
      });
  }

  updatePost(id: string, title: string, content: string, image: string | File) {
    let postData : Post | FormData;
    if(typeof(image) === 'object') {
      postData = new FormData();
      postData.append("id", id);
      postData.append('title', title)
      postData.append('content', content)
      postData.append('image', image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image
      }
    }
    this.httpClient.put('http://localhost:3000/api/posts/' + id, postData)
    .subscribe( (response) => {
      this.router.navigate(["/"]);
    })
  }

  deletePost(postId: string) {
    return this.httpClient.delete<{message: string}>('http://localhost:3000/api/posts/' + postId);
  }
}
