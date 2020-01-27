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
      margin-left: 8px;
    }
    :host::-webkit-scrollbar {
      display: none;
    }
    #score {
      white-space: nowrap;
      display: block;
    }
    #score span {
      margin-left: 4px;
    }
    #add-tag {
      border: 1px solid var(--n1);
      box-sizing: border-box;
      height: var(--height);
      width: 32px;
      min-width: 32px;
      border-radius: 3px;
      text-align: center;
      display: inline-flex;
      align-items: center;
      color: var(--n4);
      margin-left: 4px;
      cursor: pointer;
      overflow: hidden;
      position: relative;
    }
    #add-tag:hover {
      background: var(--n1);
    }
    #add-tag input {
      position: absolute;
      top: 1px;
      left: 1px;
      opacity: 0;
      pointer-events: none;
      width: calc(100% - 2px);
      border: 0;
      height: 18px;
      border-radius: 3px;
      padding-left: 24px;
      border: var(--n1) 1px solid;
    }
    #add-tag svg {
      position: absolute;
      left: 7px;
    }
    #add-tag[active] {
      width: 150px;
    }
    #add-tag[active] input {
      opacity: 1;
    }
    #add-tag[active] input:focus,
    #add-tag[active] input:active {
      outline: 0;
      box-shadow: 1px solid var(--b3);
    }

    :host([size="large"]) {
      --height: 20px;
      --tag-font-size: 14px;
    }

    :host([size="large"]) #score {
      font-size: 24px;
      color: var(--n3);
      min-width: 48px;
      text-align: center;
      transform: translateY(-2px);
    }

    :host([size="large"]) #tags {
      margin-left: 10px;
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
    }

  `}

  html(){ return `
    <div id="score"></div>
    <div id="tags" @click=_tagVote><slot></slot></div>
    <div id="add-tag" @click=_addTag>
      <input type="text"></input>
      <svg width="16px" height="17px" viewBox="0 0 24 17" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <g id="Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g id="icon/tags" transform="translate(-4.000000, -5.000000)">
              <g>
                  <path d="M11.557416,6.29956503 C11.1595912,6.29956503 10.7780604,6.45760029 10.4967558,6.73890486 L6.49675579,10.7389049 C5.91096935,11.3246913 5.91096935,12.2744388 6.49675579,12.8602252 L10.4967558,16.8602252 C10.7780604,17.1415298 11.1595912,17.299565 11.557416,17.299565 L21.2959045,17.299565 C22.1243317,17.299565 22.7959045,16.6279922 22.7959045,15.799565 L22.7959045,7.79956503 C22.7959045,6.9711379 22.1243317,6.29956503 21.2959045,6.29956503 L11.557416,6.29956503 Z" id="Rectangle" stroke="#7B9089" transform="translate(14.012447, 11.799565) rotate(135.000000) translate(-14.012447, -11.799565) "></path>
                  <path d="M15.9239992,8.86037916 L17.5218753,11.416981 C17.6682305,11.6511493 17.5970439,11.9596245 17.3628756,12.1059797 C17.2834098,12.1556458 17.191586,12.1819805 17.0978762,12.1819805 L13.9021238,12.1819805 C13.6259814,12.1819805 13.4021238,11.9581229 13.4021238,11.6819805 C13.4021238,11.5882707 13.4284585,11.4964468 13.4781247,11.416981 L15.0760008,8.86037916 C15.222356,8.62621089 15.5308312,8.55502431 15.7649995,8.70137948 C15.829384,8.74161983 15.8837588,8.79599459 15.9239992,8.86037916 Z" id="Triangle" stroke="#7B9089" transform="translate(15.500000, 10.181981) rotate(45.000000) translate(-15.500000, -10.181981) "></path>
                  <rect id="Rectangle" fill="#7B9089" x="23" y="13" width="5" height="1" rx="0.5"></rect>
                  <rect id="Rectangle" fill="#7B9089" transform="translate(25.500000, 13.500000) rotate(-270.000000) translate(-25.500000, -13.500000) " x="23" y="13" width="5" height="1" rx="0.5"></rect>
              </g>
          </g>
      </g>
      </svg>
    </div>
  `}

  static get observedAttributes() {
    return ['score']
  }

  attributeChangedCallback(name, oldValue, newValue){
    if(name == 'score')
      this.select('#score').innerHTML = `${newValue}`
  }

  _addTag(e){
    this.select('#add-tag').toggleAttribute('active')
    let input = this.select('input')
    input.focus()

  }

  _tagVote(e){
    let tag = e.target.closest('soci-tag')
    if(!tag) return 0
    if(tag.hasAttribute('upvoted')){
      if(this.querySelectorAll('soci-tag[upvoted]').length == 1){
        this.setAttribute('score', parseInt(this.getAttribute('score')) + 1)
      }
    }
    else {
      if(this.querySelectorAll('soci-tag[upvoted]').length == 0){
        this.setAttribute('score', parseInt(this.getAttribute('score')) - 1)
      }
    }
  }
}
