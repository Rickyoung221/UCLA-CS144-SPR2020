import { Component, OnInit } from '@angular/core';
import { Parser, HtmlRenderer } from 'commonmark';
import { Post, BlogService } from '../blog.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {
  public post: Post;
  public title_preview: string;
  public body_preview: string;
  public username: string;

  constructor(
                private blogService: BlogService,
                private router: Router,
                private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.username = this.parseJWT(document.cookie).usr;
    this.activatedRoute.params.subscribe(() => this.getPost());
  }

  getPost(): void{
    let postid = this.activatedRoute.snapshot.paramMap.get('id');
    console.log(postid);
	this.post = this.blogService.getCurrentDraft();
   // this.blogService.getPost(this.username, Number(postid)).then(res => {
   //   this.post = res;
      console.log(this.post.title, this.post.body);
      if (this.post) {
        //this.post = post;

        let reader = new Parser();
        let writer = new HtmlRenderer();
        this.title_preview = writer.render(reader.parse(this.post.title));
        this.body_preview = writer.render(reader.parse(this.post.body));
        console.log(this.title_preview, this.body_preview);
      }
   /// });
    //console.log(this.post.title, this.post.body);
  }

  editPost(): void{
    this.router.navigate(['/edit/' + this.post.postid]);
  }
  private parseJWT(token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  }
}
