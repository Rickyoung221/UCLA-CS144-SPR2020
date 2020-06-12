import { Component, OnInit } from '@angular/core';
import { BlogService, Post } from '../blog.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  //const maxID;
  public username: string;
  constructor(private blogService: BlogService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { this.username = this.parseJWT(document.cookie).usr; }
  //public username: string;
  //const payload = this.parseJWT(document.cookie);
  //username = this.parseJWT(document.cookie).usr;
  public posts: Post[];


  ngOnInit(): void {

    this.getPost();
    //this.router.paramMap.subscribe(() => {
    //console.log('init subscribe');
    //this.getPost()});
    this.activatedRoute.paramMap.subscribe(() =>{
      this.getPost();
    }
    );
  }
  getPost(): void{
    console.log("list get post.")
    this.blogService.fetchPosts(this.username).then(res => this.posts = res );

      //.subscribe(posts => this.posts = posts);

  }

  onSelect(id: number): void{
    let selectPost = this.posts[id];
    console.log(selectPost.postid);
    this.blogService.setCurrentDraft(selectPost);
    this.router.navigate(['/edit/'+ selectPost.postid]);
  }
  newPost(): void{
    //let nextPostid = maxID;
    //username = this.posts.username;
    let postid = this.blogService.showMaxid() + 1;
    let curUsername = this.username;

    let ret : Post = {
                  //username: curUsername,
                  postid: postid,
                  created: new Date(Date.now()),
                  modified:  new Date(Date.now()),
                  title: "",
                  body: ""
    };
    console.log("list new post", ret.postid);
    //this.blogService.newPost(this.username, ret);
    this.blogService.setCurrentDraft(ret);


    //ret.observable.subscribe(
    this.router.navigate(['/edit/', postid])
    //)

  }
  private parseJWT(token)
  {
      let base64Url = token.split('.')[1];
      let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
  }

}
