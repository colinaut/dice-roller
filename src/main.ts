export default class DiceRoller extends HTMLElement {
	private shadow: ShadowRoot;

	constructor() {
		super();
		this.shadow = this.attachShadow({ mode: "open" });
	}

	private getA(attr: string, fallback: string = ""): string {
		return this.getAttribute(attr) || fallback;
	}

	private getArray(attr: string, fallback: string[] = []): string[] {
		const temp = this.getA(attr, "");
		if (!temp) return fallback;

		let tempArray: string[] = [];
		try {
			// check to see if this is a JSON string
			tempArray = JSON.parse(temp);
		} catch (err) {
			// check to see if this a comma separated string
			tempArray = temp.split(",");
		}
		if (Array.isArray(tempArray)) {
			return tempArray;
		} else return fallback;
	}

	get dice(): string[] {
		const diceAttr = this.getAttribute("dice") || "6";
		const diceArray = diceAttr.split(",");
		return diceArray;
	}

	get modifier(): number {
		const modifier = this.getAttribute("modifier") || 0;
		return Number(modifier);
	}

	get bestOf(): number {
		const bestOf = this.getAttribute("bestOf") || this.dice.length;
		return Number(bestOf);
	}

	static get observedAttributes(): string[] {
		return ["dice", "modifier", "bestOf"];
	}

	private dieRolls: number[] = [];
	private total: number = 0;

	public connectedCallback(): void {
		this.rollDice();
		this.render();
		this.addEventListeners();
	}

	private rollDie(sides: number) {
		return Math.floor(Math.random() * sides + 1);
	}

	private rollDice() {
		this.dice.forEach((die, i) => {
			this.dieRolls[i] = this.rollDie(Number(die));
		});
		this.total =
			this.dieRolls.reduce(function (accum, curValue) {
				return accum + curValue;
			}, 0) + this.modifier;
	}

	private maxDie(): number {
		const max: number = this.dieRolls.reduce(function (a: number, b: number) {
			return Math.max(a, b);
		}, -Infinity);
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

	private addEventListeners(): void {
		this.shadow.addEventListener(
			"click",
			() => {
				// console.log(event);

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
				}, 1000);
			},
			false
		);
	}

	public attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		console.log("changed", name, oldValue, newValue);

		this.render();
	}

	private render() {
		const modifier: string = this.modifier > 0 ? "+" + this.modifier.toString() : this.modifier < 0 ? this.modifier.toString() : "";
		const css = `
        <style>
            .dice {
                display: flex;
                gap: .8rem;
                flex-wrap: wrap;
            }
            .die {
                width: 5rem;
                height: 5rem;
                border: 2px solid #fff;
                border-radius: .5rem;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 3rem;
            }
            .total {
                height: 5rem;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 3rem;
                order: 2px solid transparent;
                font-weight: bold;
                padding-left: .5rem;
            }
            .highest {
                height: 5rem;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1rem;
                order: 2px solid transparent;
                font-weight: bold;
                padding-left: .5rem;
            }
        </style>
        `;

		let html = `
        <div>
            <h3>${this.dice} <span>${modifier}</span></h3>
            <div class="dice">
                ${this.dieRolls.map((roll) => `<div class="die">${roll}</div>`).join("")} \
                <div class="total">${this.total}</div>
                <div class="highest">Highest: ${this.maxDie()}</div>
                <div class="highest">Two Highest: ${this.twoHighest()}</div>
            </div>
        </div>
        `;

		this.shadow.innerHTML = `${css}${html}`;
	}
}
customElements.define("dice-roller", DiceRoller);
