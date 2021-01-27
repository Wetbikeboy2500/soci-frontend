import SociComponent from './soci-component.js'
import config from '../config.js'

export default class SociVideoPlayer extends SociComponent {
  constructor() {
    super()
  }

  css(){ return `
    :host {
      display: block;
      width: 100%;
      position: relative;
      background: #000;
    }
    video {
      max-width: var(--media-width);
      max-height: min(calc(100vh - 100px), var(--media-height));
      margin: 0 auto;
      display: block;
    }
    controls {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      padding: 60px 16px 4px;
      position: absolute;
      width: 100%;
      bottom: 0;
      opacity: 0;
      transition: opacity 0.2s var(--soci-ease);
      background: linear-gradient(#00000000, #00000088);
      box-sizing: border-box;
      color: #fff;
    }
    :host(:hover) controls {
      /* visual bug in chrome windows makes opacity 1 do strange things */
      opacity: 0.99;
      transition: none;
    }
    #track-container {
      width: 100%;
      position: relative;
      margin: 0 10px;
      padding: 8px 0;
    }
    #track {
      position: relative;
      width: 100%;
      display: block;
      height: 4px;
      background: #ffffff30;
      border-radius: 3px;
      overflow: hidden;
      pointer-events: none;
      transition: all 0.1s linear;
    }
    #track-container:hover #track {
      height: 6px;
      border-radius: 3px;
    }
    soci-icon {
      opacity: 0.7;
      cursor: pointer;
    }
    soci-icon:hover {
      opacity: 1;
    }
    #click-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: calc(100% - 32px);
    }
    #progress,
    #seek,
    .buffer {
      position: absolute;
      top: 0;
      display: block;
      height: 100%;
      width: 0;
      transition: width 0.3s ease;
      background: #ffffff40;
    }
    #progress {
      transition: width 0.1s linear;
      background: var(--brand-background);
      width: 0;
    }
    #seek {
      transition: none;
      background: #ffffff60;
      display: none;
    }
    #track-container:hover #seek {
      display: block;
    }
    #buffers {
      opacity: 0.3;
      pointer-events: none;
    }
    .buffer {
      background: #fff;
    }
    #thumb {
      width: 12px;
      height: 12px;
      transition: all 0.1s linear;
      background: var(--brand-background);
      border-radius: 50%;
      position: absolute;
      top: 5px;
      transform-origin: left center;
      transform: scale(0) translateX(-6px);
    }
    #track-container:hover #thumb {
      transform: scale(1) translateX(-6px);
    }
    #track-container[seeking] #progress, 
    #track-container[seeking] #thumb {
      transition: none;
    }
    :host(:fullscreen) video {
      max-width: 100vw;
      max-height: 100vh;
      width: 100%;
    }
    soci-icon[glyph="exitfullscreen"],
    :host(:fullscreen) soci-icon[glyph="fullscreen"] {
      display: none;
    }
    :host(:fullscreen) soci-icon[glyph="exitfullscreen"] {
      display: block;
    }
  `}

  html(){ return `
    <video autoplay @play=_onplay @pause=_onpause></video>
    <controls>
      <soci-icon id="play" glyph="play" @click=_togglePlay></soci-icon>
      <soci-icon glyph="volume"></soci-icon>
      <div id="track-container" @mousedown=_seekDown @mousemove=_seekMove>
        <div id="track">
          <div id="buffers"></div>
          <div id="seek"></div>
          <div id="progress"></div>
        </div>
        <div id="thumb"></div>
      </div>
      <soci-icon glyph="resolution"></soci-icon>
      <soci-icon glyph="fullscreen" @click=_fullscreen></soci-icon>
      <soci-icon glyph="exitfullscreen" @click=_exitFullscreen></soci-icon>
    </controls>
    <div id="click-overlay" @click=_togglePlay></div>
  `}

  static get observedAttributes() {
    return ['url', 'resolution']
  }

  connectedCallback(){
    this._bufferInterval = setInterval(this._updateBuffer.bind(this), 1000)
    this._playInterval = setInterval(this._updateTime.bind(this), 100)
    this._video = this.select('video')
    this._seekUp = this._seekUp.bind(this)
  }

  disconnectedCallback(){
    clearInterval(this._bufferInterval)
    clearInterval(this._playInterval)
  }

  attributeChangedCallback(name, oldValue, newValue){
    switch(name) {
      case 'url':
        this.url = newValue
        break
    }
  }

  _togglePlay(){
    if(this.playing) {
      this._video.pause()
    } 
    else {
      this._video.play()
    }
  }

  _updateBuffer(){
    let buffer = this._video.buffered
    let container = this.select('#buffers')

    for(let i = 0; i < buffer.length; i++) {
      let dom = container.children[i]
      if(dom == undefined){
        dom = document.createElement('div')
        dom.className = 'buffer'
        container.appendChild(dom)
      }
      dom.style.left = `${100 * buffer.start(i) / this._video.duration}%`
      dom.style.width = `${100 * buffer.end(i) / this._video.duration}%`
    }
  }

  _updateTime(){
    let percent = `${100 * this._video.currentTime / this._video.duration}%`
    this.select('#progress').style.width = percent
    this.select('#thumb').style.left = percent
  }

  _onplay(){
    this.select('#play').setAttribute('glyph', 'pause')
  }

  _onpause(){
    this.select('#play').setAttribute('glyph', 'play')
  }

  _seekDown(e){
    this._video.pause()
    this._seeking = true
    this._seekMove(e)
    let container = this.select('#track-container')
    container.toggleAttribute('seeking', true)
    container.removeEventListener('mousemove', this._seekMove)
    document.addEventListener('mousemove', this._seekMove)
    document.addEventListener('mouseup', this._seekUp)
  }

  _seekUp(e){
    this._video.play()
    this._seeking = false
    let container = this.select('#track-container')
    container.toggleAttribute('seeking', false)
    container.addEventListener('mousemove', this._seekMove)
    document.removeEventListener('mousemove', this._seekMove)
    document.removeEventListener('mouseup', this._seekUp)
  }

  _seekMove(e){
    let container = this.select('#track-container')
    let offsetX = e.clientX - container.getBoundingClientRect().x
    let percent = offsetX / container.offsetWidth
    this.select('#seek').style.width = `${100 * percent}%`
    if(this._seeking){
      this._video.currentTime = percent * this._video.duration
      this.select('#progress').style.width = `${100 * percent}%`
      this.select('#thumb').style.left = `${100 * percent}%`
    }
  }

  _fullscreen(e){
    this.requestFullscreen()
  }

  _exitFullscreen(e){
    document.exitFullscreen()
  }

  get playing(){
    return this._video.currentTime > 0 && !this._video.paused && !this._video.ended && this._video.readyState > 2
  }

  get url() {
    return this.getAttribute('url')
  }

  set url(val) {
    if(this.getAttribute('url') != val){
      this.setAttribute('url', val)
      return
    }
    let startingRes = '480p'
    this._video.src = `${config.VIDEO_HOST}/${val}.mp4`
  }
}
