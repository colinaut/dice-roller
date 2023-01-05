export default class DiceRoller extends HTMLElement {
	private shadow: ShadowRoot;

	constructor() {
		super();
		this.shadow = this.attachShadow({ mode: "open" });
	}

	private getA(attr: string, fallback: string = ""): string {
		return this.getAttribute(attr) || fallback;
	}

	get dice(): string[] {
		const diceAttr = this.getA("dice", "6");
		const diceArray = diceAttr.split(",");
		return diceArray;
	}

	get bonusDie(): number {
		const bonusDie = this.getA("bonus-die", "0");
		return Number(bonusDie);
	}

	get modifier(): number {
		const modifier = this.getA("modifier", "0");
		return Number(modifier);
	}

	get total(): string {
		return this.getA("total", "sum");
	}

	get difficulty(): number {
		return Number(this.getA("difficulty", "0"));
	}

	get title(): string {
		return this.getA("title");
	}

	get size(): number {
		return Number(this.getA("size", "1"));
	}

	static get observedAttributes(): string[] {
		return ["dice", "modifier", "best-of"];
	}

	private dieRolls: number[] = [];
	private bonusDieRoll: number = 0;
	private finalTotal: number | undefined = undefined;
	private success: boolean = false;

	public connectedCallback(): void {
		this.render();
		this.addEventListeners();
	}

	private rollDie(sides: number) {
		return Math.floor(Math.random() * sides + 1);
	}

	private rollDice() {
		this.dieRolls = [];
		this.bonusDieRoll = 0;
		this.dice.forEach((die, i) => {
			this.dieRolls[i] = this.rollDie(Number(die));
		});
	}

	private sumTotal(): number {
		let total: number;
		if (this.total === "highest") {
			total = this.maxDie();
		} else if (this.total === "highest-two") {
			total = this.twoHighest().reduce(function (accum, curValue) {
				return accum + curValue;
			}, 0);
		} else if (this.total === "lowest") {
			total = this.minDie();
		} else if (this.total === "lowest-two") {
			console.log("lowest-two");

			total = this.twoLowest().reduce(function (accum, curValue) {
				return accum + curValue;
			}, 0);
		} else {
			total = this.dieRolls.reduce(function (accum, curValue) {
				return accum + curValue;
			}, 0);
		}
		if (this.bonusDie > 0) {
			this.bonusDieRoll = this.rollDie(this.bonusDie);
			total += this.bonusDieRoll;
		}
		this.finalTotal = total + this.modifier;
		if (this.difficulty > 0) {
			this.success = total >= this.difficulty;
		}
		return this.finalTotal;
	}

	private maxDie(): number {
		const max: number = this.dieRolls.reduce(function (a: number, b: number) {
			return Math.max(a, b);
		}, -Infinity);
		return max;
	}

	private minDie(): number {
		const max: number = this.dieRolls.reduce(function (a: number, b: number) {
			return Math.min(a, b);
		}, Infinity);
		return max;
	}

	private twoHighest(): number[] {
		return this.dieRolls.reduce(
			(acc, rec) => {
				return rec > acc[1] ? [acc[1], rec] : rec > acc[0] ? [rec, acc[1]] : acc;
			},
			[0, 0]
		);
	}

	private twoLowest(): number[] {
		return this.dieRolls.reduce(
			(acc, rec) => {
				console.log(acc);

				return rec < acc[1] ? [acc[1], rec] : rec < acc[0] ? [rec, acc[1]] : acc;
			},
			[Infinity, Infinity]
		);
	}

	private rollAnimation() {
		const changeDieFace = () => {
			// console.log("🚀 ~ file: main.ts:49 ~ DiceRoller ~ changeDieFace ~ this.dieRoll", this.dieRoll);
			this.rollDice();
			this.render();
		};

		let nIntervalId: number | undefined;

		if (!nIntervalId) {
			nIntervalId = setInterval(changeDieFace, 100);
		}

		setTimeout(() => {
			clearInterval(nIntervalId);
			this.sumTotal();
			this.render();
		}, 1000);
	}

	private addEventListeners(): void {
		const shadow = this.shadow;
		shadow.addEventListener(
			"click",
			() => {
				console.log("roll");

				this.finalTotal = undefined;
				this.success = false;
				this.render();
				this.rollAnimation();
			},
			false
		);
	}

	public attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		console.log("changed", name, oldValue, newValue);
	}

	private render() {
		const modifier: string = this.modifier > 0 ? "+" + this.modifier.toString() : this.modifier < 0 ? this.modifier.toString() : "";
		const bonusDieText: string = this.bonusDie > 0 ? `+ bonus ${this.bonusDie}d` : "";
		const title = this.title || `${this.dice} ${this.total} ${modifier} ${bonusDieText}`;
		const size = this.size;
		const finalTotal = this.finalTotal !== undefined ? `<div class="total"><h5>TOTAL</h5><span>${this.finalTotal}</span></div>` : "";
		const success =
			this.finalTotal !== undefined && this.difficulty > 0
				? this.success
					? "<div class='result success'><span>Success!</span></div>"
					: "<div class='result failure'><span>Fail</span></div>"
				: "";
		const css = `
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
                width: ${size * 2}em;
                height: ${size * 2}em;
                border: 2px solid #fff;
                border-radius: ${size / 2}em;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .die span {
                font-size: ${size}em;
            }
            .modifier {
                width: 1em;
                height: 2em;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 2px solid transparent;
                font-size: ${size}em;
            }
            .modifier:empty {
                display: none;
            }
            .modifier.plus {
                width: ${size / 2}em;
            }
            .total {
                width: ${size * 2}em;
                height: ${size * 2}em;
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
                font-size: ${size}em;
            }
            .result {
                height: ${size * 2}em;
                display: flex;
                line-height: 1;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }
            .result span {
                font-size: ${size / 1.5}em;
            }
            h4 {
                display: flex;
                gap: ${size / 2}em;
                font-size: ${size / 1.5}em;
                margin: 0 0 .4em;
            }
            
        </style>
        `;

		let bonusDie = "";

		if (this.bonusDie > 0) {
			const bonusDieRoll = this.bonusDieRoll > 0 ? this.bonusDieRoll : `d${this.bonusDie}`;
			bonusDie = `<div class="modifier plus">+</div><div class="die bonus"><span>${bonusDieRoll}</span></div>`;
		}

		let html = `
        <div>
            <h4>${title}</h4>
            <div class="dice">
                ${this.dice
					.map((dice, i) => {
						const text = this.dieRolls[i] || `d${dice}`;
						return `<div class="die"><span>${text}</span></div>`;
					})
					.join("")}
                <div class="modifier">${modifier}</div>
                ${bonusDie}
                ${finalTotal}
                ${success}
            </div>
        </div>
        `;

		this.shadow.innerHTML = `${css}${html}`;
	}
}
customElements.define("dice-roller", DiceRoller);
