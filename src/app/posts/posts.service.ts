import { Injectable } from "@angular/core";
import { Post } from "./post.model";

@Injectable({
  providedIn: 'root'
}) // Alternative way is add it in, app.module.ts file in providers
// service will be created as a singleton and injected into the root module of our application
// * Restricts the instantiation of a class to a single instance and provides a global point of access to that instance.

export class PostsService {
  private Posts : Post[] = [];

  getPosts() {
    return [...this.Posts]; 
    // Here we are using spread operator, but here we are not passing the Posts array because in JS, arrays use reference.
    // So, we create a copy of this array and pass it on, so it won't modify the original array.
  }

  addPost(title: string, content: string) {
    const post = {
      title: title,
      content: content,
    };
    this.Posts.push(post);
  }
}