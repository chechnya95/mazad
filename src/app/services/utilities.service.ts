import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  public url: any = '';
  public show: boolean = true;
  public loader: boolean = false;
  public title: string = 'Dashboard';
  
  constructor() { }

  static parseIfNotJsonObject(input: any): any {
    // First check if 'input' is already an object and not null
    if (typeof input === 'object' && input !== null) {
      return input;
    }
  
    try {
      // Attempt to parse it as JSON
      return JSON.parse(input);
    } catch (error) {
      // If an error is thrown, it's not valid JSON, handle it or return the original input
      console.error("Input is not valid JSON:", error);
      return input; // or handle it accordingly
    }
  }

  convertDateForInput(dateStr: string): string {
    const date = new Date(dateStr);
    return formatDate(date, 'yyyy-MM-ddTHH:mm', 'en-US');
  }

  isValidJson(input: any): boolean {
    if (typeof input === "string") {
        try {
            const json = JSON.parse(input);
            return (typeof json === 'object' && json !== null);
        } catch (e) {
            return false;
        }
    } else if (typeof input === "object" && input !== null) {
        try {
            JSON.parse(JSON.stringify(input));
            return true;
        } catch (e) {
            return false;
        }
    }

    return false;
  }
}
