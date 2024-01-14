

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  public getJsonValue: any;
  public skip: number = 0;
  public limit: number = 10;
  public searchKeyword: string = ''; 
  private originalData: any; 
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getMethod();
  }

  public search(): void {
    if (!this.searchKeyword.trim()) {
      this.resetSearch();
      return;
    }
    if (this.getJsonValue && this.getJsonValue.response) {
      this.getJsonValue.response = this.getJsonValue.response.filter((item: any) =>
        item.title.toLowerCase().includes(this.searchKeyword.toLowerCase())
      );
    }
  }
  

  public resetSearch(): void {
    this.getMethod();
  }

  public getMethod(): void {
    const apiKey = 'bW9jay04ODc3NTU2NjExMjEyNGZmZmZmZmJ2';
    const headers = new HttpHeaders().set('apiKey', apiKey);

    const body = {
      skip: this.skip,
      limit: this.limit,
      latitude: 0,
      longitude: 0,
    };

    this.http.post('https://smarty.kerzz.com:4004/api/mock/getFeed', body, { headers }).subscribe(
      (data: any) => {
        if (this.getJsonValue && this.getJsonValue.response) {
          this.getJsonValue.response = this.getJsonValue.response.concat(data.response);
        } else {
          this.getJsonValue = data;
          this.originalData = { response: [...data.response] };
        }
      },
      (error) => {
        console.error('HATA', error);
      }
    );
  }

  loadData(event: any): void {
    this.skip += this.limit;
    this.getMethod();

    setTimeout(() => {
      event.target.complete();

      if (this.getJsonValue && this.getJsonValue.response && this.getJsonValue.response.length < this.limit) {
        event.target.disabled = true;
      }
    }, 3000);
  }
  onInput(event: any): void {
    this.search();
  }
}
