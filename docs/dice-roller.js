var m=Object.defineProperty;var g=(n,o,t)=>o in n?m(n,o,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[o]=t;var l=(n,o,t)=>(g(n,typeof o!="symbol"?o+"":o,t),t);class p extends HTMLElement{constructor(){super();l(this,"shadow");l(this,"dieRolls",[]);l(this,"bonusDieRoll",0);l(this,"finalTotal");l(this,"success",!1);this.shadow=this.attachShadow({mode:"open"})}getA(t,i=""){return this.getAttribute(t)||i}get dice(){return this.getA("dice","6").split(",")}get bonusDie(){const t=this.getA("bonus-die","0");return Number(t)}get modifier(){const t=this.getA("modifier","0");return Number(t)}get total(){return this.getA("total","sum")}get difficulty(){return Number(this.getA("difficulty","0"))}get title(){return this.getA("title")}get size(){return Number(this.getA("size","1"))}static get observedAttributes(){return["dice","modifier","best-of"]}connectedCallback(){this.render(),this.addEventListeners()}rollDie(t){return Math.floor(Math.random()*t+1)}rollDice(){this.dieRolls=[],this.bonusDieRoll=0,this.dice.forEach((t,i)=>{this.dieRolls[i]=this.rollDie(Number(t))})}sumTotal(){let t;return this.total==="highest"?t=this.maxDie():this.total==="highest-two"?t=this.twoHighest().reduce(function(i,e){return i+e},0):this.total==="lowest"?t=this.minDie():this.total==="lowest-two"?(console.log("lowest-two"),t=this.twoLowest().reduce(function(i,e){return i+e},0)):t=this.dieRolls.reduce(function(i,e){return i+e},0),this.bonusDie>0&&(this.bonusDieRoll=this.rollDie(this.bonusDie),t+=this.bonusDieRoll),this.finalTotal=t+this.modifier,this.difficulty>0&&(this.success=t>=this.difficulty),this.finalTotal}maxDie(){return this.dieRolls.reduce(function(i,e){return Math.max(i,e)},-1/0)}minDie(){return this.dieRolls.reduce(function(i,e){return Math.min(i,e)},1/0)}twoHighest(){return this.dieRolls.reduce((t,i)=>i>t[1]?[t[1],i]:i>t[0]?[i,t[1]]:t,[0,0])}twoLowest(){return this.dieRolls.reduce((t,i)=>(console.log(t),i<t[1]?[t[1],i]:i<t[0]?[i,t[1]]:t),[1/0,1/0])}rollAnimation(){const t=()=>{this.rollDice(),this.render()};let i;i||(i=setInterval(t,100)),setTimeout(()=>{clearInterval(i),this.sumTotal(),this.render()},1e3)}addEventListeners(){this.shadow.addEventListener("click",()=>{console.log("roll"),this.finalTotal=void 0,this.success=!1,this.render(),this.rollAnimation()},!1)}attributeChangedCallback(t,i,e){console.log("changed",t,i,e)}render(){const t=this.modifier>0?"+"+this.modifier.toString():this.modifier<0?this.modifier.toString():"",i=this.bonusDie>0?`+ bonus ${this.bonusDie}d`:"",e=this.title||`${this.dice} ${this.total} ${t} ${i}`,s=this.size,h=this.finalTotal!==void 0?`<div class="total"><h5>TOTAL</h5><span>${this.finalTotal}</span></div>`:"",a=this.finalTotal!==void 0&&this.difficulty>0?this.success?"<div class='result success'><span>Success!</span></div>":"<div class='result failure'><span>Fail</span></div>":"",u=`
        <style>
            :host {
                margin: 1rem 0;
                display: block;
                font-weight: 700;
                max-width: max-content;
            }
            .dice {
                display: flex;
                gap: .6em;
                flex-wrap: wrap;
                width: fit-content;
            }
            .die {
                width: ${s*2}em;
                height: ${s*2}em;
                border: 2px solid #fff;
                border-radius: ${s/2}em;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .die span {
                font-size: ${s}em;
            }
            .modifier {
                width: 1em;
                height: 2em;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 2px solid transparent;
                font-size: ${s}em;
            }
            .modifier:empty {
                display: none;
            }
            .modifier.plus {
                width: ${s/2}em;
            }
            .total {
                width: ${s*2}em;
                height: ${s*2}em;
                display: flex;
                line-height: 1;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                border: 2px solid transparent;
                position: relative;
            }
            .total h5 {
                margin: 0;
                font-size: 0.6em;
                position: absolute;
                top:0;
            }
            .total span {
                font-size: ${s}em;
            }
            .result {
                height: ${s*2}em;
                display: flex;
                line-height: 1;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }
            .result span {
                font-size: ${s/1.5}em;
            }
            h4 {
                display: flex;
                gap: ${s/2}em;
                font-size: ${s/1.5}em;
                margin: 0 0 .4em;
            }
            
        </style>
        `;let r="";this.bonusDie>0&&(r=`<div class="modifier plus">+</div><div class="die bonus"><span>${this.bonusDieRoll>0?this.bonusDieRoll:`d${this.bonusDie}`}</span></div>`);let c=`
        <div>
            <h4>${e}</h4>
            <div class="dice">
                ${this.dice.map((d,f)=>`<div class="die"><span>${this.dieRolls[f]||`d${d}`}</span></div>`).join("")}
                <div class="modifier">${t}</div>
                ${r}
                ${h}
                ${a}
            </div>
        </div>
        `;this.shadow.innerHTML=`${u}${c}`}}customElements.define("dice-roller",p);
//# sourceMappingURL=dice-roller.js.map
