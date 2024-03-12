import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CandidateDetailsService {

  constructor() { }

  candidate: any = {}

  setCandidate(candidate: any) {
    window.localStorage.setItem('candidate', JSON.stringify(candidate))
    this.candidate = candidate
  }

  getCandidate() {
    if(!Object.values(this.candidate).length){
      this.candidate = JSON.parse(window.localStorage.getItem('candidate') || '')
    }
    return this.candidate
  }
}
