var m=Object.defineProperty;var g=(n,o,t)=>o in n?m(n,o,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[o]=t;var l=(n,o,t)=>(g(n,typeof o!="symbol"?o+"":o,t),t);class b extends HTMLElement{constructor(){super();l(this,"shadow");l(this,"dieRolls",[]);l(this,"bonusDieRoll",0);l(this,"finalTotal");l(this,"success",!1);this.shadow=this.attachShadow({mode:"open"})}getA(t,e=""){return this.getAttribute(t)||e}get dice(){return this.getA("dice","6").split(",")}get bonusDie(){const t=this.getA("bonus-die","0");return Number(t)}get modifier(){const t=this.getA("modifier","0");return Number(t)}get total(){return this.getA("total","sum")}get difficulty(){return Number(this.getA("difficulty","0"))}get title(){return this.getA("title")}get size(){return Number(this.getA("size","1"))}static get observedAttributes(){return["dice","modifier","best-of"]}connectedCallback(){this.render(),this.addEventListeners()}rollDie(t){return Math.floor(Math.random()*t+1)}rollDice(){this.dieRolls=[],this.bonusDieRoll=0,this.dice.forEach((t,e)=>{this.dieRolls[e]=this.rollDie(Number(t))})}sumTotal(){let t;return this.total==="highest"?t=this.maxDie():this.total==="highest-two"?t=this.twoHighest().reduce(function(e,s){return e+s},0):this.total==="lowest"?t=this.minDie():this.total==="lowest-two"?(console.log("lowest-two"),t=this.twoLowest().reduce(function(e,s){return e+s},0)):t=this.dieRolls.reduce(function(e,s){return e+s},0),this.bonusDie>0&&(this.bonusDieRoll=this.rollDie(this.bonusDie),t+=this.bonusDieRoll),this.finalTotal=t+this.modifier,this.difficulty>0&&(this.success=t>=this.difficulty),this.finalTotal}maxDie(){return this.dieRolls.reduce(function(e,s){return Math.max(e,s)},-1/0)}minDie(){return this.dieRolls.reduce(function(e,s){return Math.min(e,s)},1/0)}twoHighest(){return this.dieRolls.reduce((t,e)=>e>t[1]?[t[1],e]:e>t[0]?[e,t[1]]:t,[0,0])}twoLowest(){return this.dieRolls.reduce((t,e)=>(console.log(t),e<t[1]?[t[1],e]:e<t[0]?[e,t[1]]:t),[1/0,1/0])}rollAnimation(){const t=()=>{this.rollDice(),this.render()};let e;e||(e=setInterval(t,100)),setTimeout(()=>{clearInterval(e),this.sumTotal(),this.render()},1e3)}addEventListeners(){this.shadow.addEventListener("click",()=>{console.log("roll"),this.finalTotal=void 0,this.success=!1,this.render(),this.rollAnimation()},!1)}attributeChangedCallback(t,e,s){console.log("changed",t,e,s)}render(){const t=this.modifier>0?"+"+this.modifier.toString():this.modifier<0?this.modifier.toString():"",e=this.bonusDie>0?`+ bonus ${this.bonusDie}d`:"",s=this.title||`${this.dice} ${this.total} ${t} ${e}`,i=this.size,a=this.finalTotal!==void 0?`<div class="total"><h5>TOTAL</h5><span>${this.finalTotal}</span></div>`:"",h=this.finalTotal!==void 0&&this.difficulty>0?this.success?"<div class='result success'><span>Success!</span></div>":"<div class='result failure'><span>Fail</span></div>":"",u=`
        <style>
            :host {
                margin: 1rem 0;
                display: block;
                font-weight: 700;
                max-width: max-content;
                --dice-bg: transparent;
                --dice-border: 2px solid #fff;
                --modifier-bg: transparent;
                --modifier-border: 2px solid transparent;
                --total-bg: transparent;
                --total-border: 2px solid transparent;
            }
            .dice {
                display: flex;
                gap: .6em;
                flex-wrap: wrap;
                width: fit-content;
            }
            .die {
                width: ${i*2}em;
                height: ${i*2}em;
                border: var(--dice-border);
                border-radius: ${i/2}em;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .die span {
                font-size: ${i}em;
            }
            .modifier {
                width: 1em;
                height: 2em;
                display: flex;
                align-items: center;
                justify-content: center;
                border: var(--modifier-border);
                background: var(--modifier-bg);
                font-size: ${i}em;
            }
            .modifier:empty {
                display: none;
            }
            .modifier.plus {
                width: ${i/2}em;
            }
            .total {
                width: ${i*2}em;
                height: ${i*2}em;
                display: flex;
                line-height: 1;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                border: var(--total-border);
                background: var(--total-bg);
                position: relative;
            }
            .total h5 {
                margin: 0;
                font-size: ${i/2.5}em;
                position: absolute;
                top:0;
            }
            .total span {
                font-size: ${i}em;
            }
            .result {
                height: ${i*2}em;
                display: flex;
                line-height: 1;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }
            .result span {
                font-size: ${i/1.5}em;
            }
            h4 {
                display: flex;
                gap: ${i/2}em;
                font-size: ${i/1.5}em;
                margin: 0 0 .4em;
            }
            
        </style>
        `;let r="";this.bonusDie>0&&(r=`<div class="modifier plus">+</div><div class="die bonus"><span>${this.bonusDieRoll>0?this.bonusDieRoll:`d${this.bonusDie}`}</span></div>`);let c=`
        <div>
            <h4>${s}</h4>
            <div class="dice">
                ${this.dice.map((d,f)=>`<div class="die"><span>${this.dieRolls[f]||`d${d}`}</span></div>`).join("")}
                <div class="modifier">${t}</div>
                ${r}
                ${a}
                ${h}
            </div>
        </div>
        `;this.shadow.innerHTML=`${u}${c}`}}customElements.define("dice-roller",b);
//# sourceMappingURL=dice-roller.js.map
