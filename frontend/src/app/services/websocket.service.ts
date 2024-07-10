import { Injectable } from '@angular/core';
import { environment as env} from 'src/environments/environment';
import * as Rx from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  constructor() { }

  private subject!: Rx.Subject<MessageEvent<ArrayBuffer>>;
  private url: string = '';
  private ws!: WebSocket;

  public connect(url: string): Rx.Subject<MessageEvent<ArrayBuffer>> {
    if (!this.subject) {
      this.url = url;
      // Create the socket connection
      this.open_socket();
      this.subject = this.fetch_subject();
      console.log("Connected: " + url);
    }
    return this.subject;
  }

  public open_socket() {
    this.ws = new WebSocket(this.url);
    // Since we are receiving binary data from the controller
    this.ws.binaryType = 'arraybuffer';
    this.ws.addEventListener('open', () => {
      this.tell("PUR 1 9999")
    });
    this.ws.addEventListener('error', () => {
      console.log(`Unavailable connection to ${this.url}...`);
    });
    this.ws.addEventListener('close', () => {
      console.log(`Connection closed to ${this.url}...`);
      if (env.enable_auto_reconnect) {
        setTimeout(() => {
          console.log(`Reconnecting to ${this.url}...`);
          this.open_socket();
        }, 1000);
      }
    })
  }

  private tell(data: string) {
    let encoder = new TextEncoder();
    this.ws.send(encoder.encode(data));
  }

  private fetch_subject(): Rx.Subject<MessageEvent<ArrayBuffer>> {
    let observable = Rx.Observable.create(
      (obs: Rx.Observer<any>) => {
        this.ws.onmessage = obs.next.bind(obs);
        this.ws.onerror = obs.error.bind(obs);
        this.ws.onclose = obs.complete.bind(obs);
        return this.ws.close.bind(this.ws);
      }
    )

    let observer = {
      next: (data: any) => {
        if (this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(data);
        }
      }
    }

    return Rx.Subject.create(observer, observable)
  }
}
