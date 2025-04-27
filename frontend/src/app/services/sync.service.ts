import { Injectable } from '@angular/core';
import { map, Subject } from "rxjs";
import { WebsocketService } from "src/app/services/websocket.service";
import { environment } from "src/environments/environment";
import { LiveControllers } from "src/interfaces/Controller";

interface ResponseController {
  action: string;
  number: number;
  position: number|string;
}


@Injectable({
  providedIn: 'root'
})
export class SyncService {

  //public message: Subject<Message>;
  public messages!: Subject<any>;
  public data_received: string = '';
  public liveControllers: LiveControllers = {};

  private kValueParseReg = /#(\d+)=(\d+)/

  constructor(
    private wsService: WebsocketService
  ) {
    //loaderService.isLoading.next(true);
    this.messages = <Subject<any>>wsService
      .connect(environment.socket)
      .pipe(
        map(
          (response: MessageEvent): any => {
            //loaderService.isLoading.next(false)
            let decoder = new TextDecoder();
            if (decoder.decode(response.data) === 'ACK') return 'ACK';
            // this.data_received += decoder.decode(response.data);
            this.processData(response.data)
            return this.liveControllers;
          }
        )
      )
  }

  private processData(rawData: any) {
    // First we will decode the data
    let decoder = new TextDecoder(),
        data: string = decoder.decode(rawData);
    if (data.length > 1) {
      let fetched = data.split('#');
      for (let i = 0; i < fetched.length; i++) {
        // Checks if the msg is not ACK
        if (fetched[i] !== '' && fetched[i] !== 'ACK') {
          this.processController('#' + fetched[i]);
        }
      }
    }
    // Check
    // if (matches !== null && matches.length === 3) {
    //   let controller_number = parseInt(matches[1], 10); // 65535
    //   this.liveControllers[controller_number] = parseInt(matches[2], 10);
    // }
    return false;
  }

  private processController(data: string) {
    // First we will decode the data
    let matches = this.kValueParseReg.exec(data);
    if (matches !== null && matches.length === 3) {
      let controller_number = parseInt(matches[1], 10); // 65535
      this.liveControllers[controller_number] = parseInt(matches[2], 10);
      return true;
    }
    return false;
  }

  public update(event: any) {
    let controller_number = event.handle,
        controller_value = event.value;
    return this.tell(`CSQ ${controller_number} ${controller_value}`)
  }

  private tell(msg: string) {
    let encoder = new TextEncoder(), encoded_msg = encoder.encode(msg);
    return this.messages.next(encoded_msg);
  }
}
