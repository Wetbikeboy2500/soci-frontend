import SociComponent from './soci-component.js'

export default class SociTagGroup extends SociComponent {
  constructor() {
    super()
  }

  css(){ return `
    :host {
      --height: 20px;
      --tag-font-size: 10px;
      display: flex;
      line-height: var(--height);
      align-items: center;
      position: relative;
    }
    #tags {
      overflow: hidden;
      overflow-x: auto;
      height: var(--height);
      line-height: 16px;
      border-radius: 3px;
      scrollbar-width: none;
      margin-left: 3px;
    }
    :host::-webkit-scrollbar {
      display: none;
    }
    #add-tag {
      margin-left: 8px;
      border: 1px solid var(--base-background-subtle);
      box-sizing: border-box;
      height: var(--height);
      width: 32px;
      min-width: 32px;
      border-radius: 3px;
      text-align: center;
      display: inline-flex;
      align-items: center;
      cursor: pointer;
      overflow: hidden;
      position: relative;
    }
    #add-tag:not([active]):hover {
      background: var(--base-background-hover);
    }
    #add-tag input {
      position: absolute;
      opacity: 0;
      pointer-events: none;
      width: calc(100% - 2px);
      border: 0;
      height: 18px;
      padding-left: 28px;
      line-height: 18px;
      background: transparent;
      color: var(--base-text-subtle);
    }
    #add-tag svg {
      position: absolute;
      left: 7px;
    }
    #add-tag[active] {
      transition: all 0.1s var(--soci-ease-out);
      width: 150px;
      background: var(--brand-background-subtle);
      border: 1px solid var(--brand-background);
    }
    #add-tag[active] input {
      opacity: 1;
      pointer-events: all;
    }
    #add-tag[active] input:focus,
    #add-tag[active] input:active {
      outline: 0;
    }

    :host([size="large"]) {
      --height: 20px;
      --tag-font-size: 14px;
    }

    :host([size="large"]) #tags {
      margin-left: 4px;
    }

    :host([size="large"]) #arrow {
      width: 12px;
    }

    soci-user {
      --font-weight: 500;
    }

    ::slotted(soci-tag) {
      height: var(--height);
      line-height: var(--height);
      font-size: var(--tag-font-size);
      margin-right: 4px;
    }

    ::slotted(div) {
      font-size: 16px;
      height: calc(var(--height) - 2px);
      line-height: calc(var(--height) - 2px);
      color: var(--base-text-subtle);
      min-width: 36px;
      padding: 0 6px;
      text-align: center;
      border: 1px solid var(--base-background-subtle);
      border-radius: 3px;
      font-weight: 600;
      user-select: none;
    }

    :host([upvoted]) ::slotted(div) {
      color: var(--base-text-inverse);
      background: var(--brand-background);
      border-color: var(--brand-background);
    }


  `}

  html(){ return `
    <slot name="score"></slot>
    <div id="add-tag" @click=_addTagClick>
      <input type="text"></input>
      <svg width="16px" height="17px" viewBox="0 0 24 17" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <g id="Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g id="icon/tags" transform="translate(-4.000000, -5.000000)">
              <g>
                  <path d="M11.557416,6.29956503 C11.1595912,6.29956503 10.7780604,6.45760029 10.4967558,6.73890486 L6.49675579,10.7389049 C5.91096935,11.3246913 5.91096935,12.2744388 6.49675579,12.8602252 L10.4967558,16.8602252 C10.7780604,17.1415298 11.1595912,17.299565 11.557416,17.299565 L21.2959045,17.299565 C22.1243317,17.299565 22.7959045,16.6279922 22.7959045,15.799565 L22.7959045,7.79956503 C22.7959045,6.9711379 22.1243317,6.29956503 21.2959045,6.29956503 L11.557416,6.29956503 Z" id="Rectangle" stroke="currentColor" transform="translate(14.012447, 11.799565) rotate(135.000000) translate(-14.012447, -11.799565) "></path>
                  <path d="M15.9239992,8.86037916 L17.5218753,11.416981 C17.6682305,11.6511493 17.5970439,11.9596245 17.3628756,12.1059797 C17.2834098,12.1556458 17.191586,12.1819805 17.0978762,12.1819805 L13.9021238,12.1819805 C13.6259814,12.1819805 13.4021238,11.9581229 13.4021238,11.6819805 C13.4021238,11.5882707 13.4284585,11.4964468 13.4781247,11.416981 L15.0760008,8.86037916 C15.222356,8.62621089 15.5308312,8.55502431 15.7649995,8.70137948 C15.829384,8.74161983 15.8837588,8.79599459 15.9239992,8.86037916 Z" id="Triangle" stroke="currentColor" transform="translate(15.500000, 10.181981) rotate(45.000000) translate(-15.500000, -10.181981) "></path>
                  <rect id="Rectangle" fill="currentColor" x="23" y="13" width="5" height="1" rx="0.5"></rect>
                  <rect id="Rectangle" fill="currentColor" transform="translate(25.500000, 13.500000) rotate(-270.000000) translate(-25.500000, -13.500000) " x="23" y="13" width="5" height="1" rx="0.5"></rect>
              </g>
          </g>
      </g>
      </svg>
    </div>
    <div id="tags"><slot></slot></div>
  `}

  static get observedAttributes() {
    return ['score']
  }

  connectedCallback(){
    this._cancelAddTag = this._cancelAddTag.bind(this)
    this._inputKeyListener = this._inputKeyListener.bind(this)
    this.addEventListener('vote', this._tagVoted)
    this.toggleAttribute('upvoted', this.querySelectorAll('soci-tag[upvoted]').length)

    let score = document.createElement('div')
    score.setAttribute('slot', 'score')
    score.innerHTML = this.score
    this.appendChild(score)
  }

  attributeChangedCallback(name, oldValue, newValue){
    if(name == 'score'){
      let score = this.querySelector('[slot="score"]')
      if(score) score.innerHTML = `${newValue}`

    }
  }

  get url(){
    return this.getAttribute('url')
  }

  set url(val){
    return this.setAttribute('url', val)
  }

  get score() {
    let score = this.getAttribute('score') || 0
    return parseInt(score)
  }

  set score(val){
    return this.setAttribute('score', val)
  }

  addTag(){
    let input = this.select('#add-tag input')
    let tagName = input.value
    const url = this.closest('[url]')?.getAttribute('url')
    if(!url) {
      console.warn('No url found when creating tag.')
      return 0
    }

    this.postData('/posttag/create', {
      post: url,
      tag: tagName
    }).then(res => {
      if(res.postID && res.tagID)
        soci.votes[res.postID]?.push(res.tagID)
    })

    let newTag = document.createElement('soci-tag')
    newTag.setAttribute('tag', tagName)
    newTag.setAttribute('score', 1)
    newTag.toggleAttribute('upvoted')
    if(this.childNodes[0].nodeType == 3) this.childNodes[0].remove()
    this.prepend(newTag)
    this._tagVoted({detail:{upvoted: true}})
    this.select('#add-tag input').value = ''
  }

  _addTagClick(e){
    let button = this.select('#add-tag')
    if(button.hasAttribute('active')) return 0
    button.toggleAttribute('active')
    let input = this.select('input')
    input.focus()
    document.addEventListener('click', this._cancelAddTag)
    document.addEventListener('keydown', this._inputKeyListener)
  }

  _cancelAddTag(e){
    let button = e ? e.path[0].closest('#add-tag') : null
    if(button) return 0

    this.select('#add-tag').removeAttribute('active')
    this.select('#add-tag input').value = ''
    document.removeEventListener('click', this._cancelAddTag)
    document.removeEventListener('keydown', this._inputKeyListener)
  }

  _inputKeyListener(e){
    if(e.key == 'Enter') {
      this.addTag()
    }
    else if (e.key == 'Escape') {
      this._cancelAddTag()
    }
    else if (e.key == ' ') {
      e.preventDefault()
      let input = this.select('#add-tag input')
      setTimeout(()=>{
        if(input.value.charAt(input.value.length - 1) != '-')
          input.value = input.value + '-'
      }, 1)
    }
    else if (e.key == '#') {
      e.preventDefault()
    }
  }

  _tagVoted(e){
    let numberOfUpvotes = this.querySelectorAll('soci-tag[upvoted]').length
    if(numberOfUpvotes > 0){
      this.toggleAttribute('upvoted', true)
      if(numberOfUpvotes == 1 && e.detail.upvoted){
        this.score++
        this.fire('scoreChanged', {score: this.score})
      }
    }
    else {
      this.toggleAttribute('upvoted', false)
      this.score--
      this.fire('scoreChanged', {score: this.score})
    }

  }
}
