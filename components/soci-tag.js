import SociComponent from './soci-component.js'

export default class SociTag extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      :host {
        display: inline-flex;
        align-items: center;
        height: 20px;
        border-radius: 3px;
        background: var(--bg-secondary);
        box-shadow: 0 0 0 1px var(--bg-secondary-hover) inset;
        font-size: 0.625em;
        line-height: 20px;
        padding-right: 8px;
        color: var(--text-secondary);
        cursor: pointer;
        font-weight: 600;
        user-select: none;
        //transition: background 0.1s var(--soci-ease-out);
        margin-right: 6px;
        overflow: hidden;
        white-space: nowrap;
        --fill-color: none;
      }
      soci-link:hover {
        text-decoration: underline;
      }
      slot {
        letter-spacing: 0.5px;
      }
      slot:before {
        content: '';
      }
      soci-icon {
        width: 16px;
        height: 24px;
        margin-right: 2px;
      }
      #vote {
        padding: 0 6px 0 3px;
        display: inline-flex;
        align-items: center;
        margin-right: 6px;
        border-right: 1px solid var(--bg-secondary-hover);
      }
      #vote:hover {
        background: var(--bg-secondary-hover);
        color: var(--text-secondary-hover);
      }
      #vote:active {
        background: var(--bg-brand-secondary);
        border-right: 1px solid transparent;
        --fill-color: var(--text);
      }
      :host([upvoted]) {
        --fill-color: var(--text-color);
      }
      :host([upvoted]) #vote {
        color: var(--text-brand);
        font-weight: 500;
      }
      :host([upvoted]) #vote:active {
        --fill-color: transparent;
        background: var(--bg-secondary-hover);
        border-right: 1px solid var(--bg-secondary-hover);
      }
      :host([tag="nsfw"]) soci-link {
        color: var(--text-danger);
      }
      :host([tag="nsfw"]) #vote:active {
        background: var(--bg-danger-secondary);
      }
      :host([tag="nsfw"][upvoted]) #vote {
        color: var(--text-danger);
      }
      :host([tag="nsfw"][upvoted]) #vote:active {
        background: var(--bg-secondary-hover);
      }

    `
  }

  html(){ return `
    <div id="vote" @click=vote >
      <soci-icon glyph="upvote"></soci-icon>
      <score></score>
    </div>
    <soci-link></soci-link>
  `}

  static get observedAttributes() {
    return ['color', 'name', 'upvoted', 'score', 'tag']
  }

  attributeChangedCallback(name, oldValue, newValue){
    switch(name){
      case 'score':
        this.select('score').innerHTML = newValue
        break
      case 'tag':
        let link = this.select('soci-link')
        link.setAttribute('href', '/#' + newValue)
        link.innerHTML = newValue
    }
  }

  get score(){
    return parseInt(this.getAttribute('score')) || 0
  }

  set score(val){
    this.setAttribute('score', val)
  }

  get tag(){
    return this.getAttribute('tag')
  }

  set tag(val){
    this.setAttribute('tag', val)
  }
  
  vote(e){
    e?.preventDefault()
    const score = parseInt(this.getAttribute('score')) || 0
    const upvoted = this.toggleAttribute('upvoted')
    this.setAttribute('score', score + (upvoted ? 1 : -1))
    this.fire('vote', {
      dom: this,
      tag: this.tag,
      upvoted: upvoted
    })

    const post = this.closest('[post-id]')
    if(post) {
      this.postData(`/posttag/${upvoted ? 'add' : 'remove'}-vote`, {
        post: post.getAttribute('url'),
        tag: this.tag
      }).then(()=>{
        soci.votes[post.getAttribute('post-id')].push(parseInt(this.getAttribute('tag-id')))
      })
    }
    else {
      console.warn('No parent element found with a url for tag:')
      console.warn(this)
    }

    // if we're removing a vote, and it's the last vote, delete the tag
    if(!upvoted && this.score == 0) this.remove()
  }
}
