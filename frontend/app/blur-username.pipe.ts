import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'blurUsername'
})
export class BlurUsernamePipe implements PipeTransform {

  transform(username: string): string {
    const blurredSegment = '********'; // Replace with the desired blurred text
    const startIdx = 2; // Index of the first character to blur
    const endIdx = 8; // Index of the last character to blur

    // Check if the username is long enough to blur the specified segment
    if (username.length >= endIdx) {
      const prefix = username.substring(0, startIdx);
      const suffix = username.substring(endIdx);
      return prefix + blurredSegment + suffix;
    } else {
      // Return the original username if it's too short
      return username;
    }
  }
}
