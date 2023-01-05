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
	set dice(diceArray) {
		this.setAttribute("dice", diceArray.toString());
	}

	get bonusDie(): number {
		const bonusDie = this.getAttribute("bonus-die") || 0;
		return Number(bonusDie);
	}
	set bonusDie(bonusDie) {
		this.setAttribute("bonus-die", bonusDie.toString());
	}

	get modifier(): number {
		const modifier = this.getAttribute("modifier") || 0;
		return Number(modifier);
	}

	set modifier(modifier: number) {
		this.setAttribute("modifier", modifier.toString());
	}

	get total(): string {
		return this.getAttribute("total") || "All Dice";
	}

	set total(total: string) {
		this.setAttribute("total", total);
	}

	static get observedAttributes(): string[] {
		return ["dice", "modifier", "best-of"];
	}

	private dieRolls: number[] = [];
	private finalTotal: number = 0;

	public connectedCallback(): void {
		this.rollDice();
		this.render();
		this.addEventListeners();
	}

	private rollDie(sides: number) {
		return Math.floor(Math.random() * sides + 1);
	}

	private rollDice() {
		this.dieRolls = [];
		this.dice.forEach((die, i) => {
			this.dieRolls[i] = this.rollDie(Number(die));
		});
		let total: number;
		if (this.total === "Highest Die") {
			total = this.maxDie();
		} else if (this.total === "Two Highest Dice") {
			total = this.twoHighest().reduce(function (accum, curValue) {
				return accum + curValue;
			}, 0);
		} else if (this.total === "Lowest Die") {
			total = this.minDie();
		} else {
			total = this.dieRolls.reduce(function (accum, curValue) {
				return accum + curValue;
			}, 0);
		}
		this.finalTotal = total + this.modifier;
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

	private rollAnimation() {
		const changeDieFace = () => {
			// console.log("🚀 ~ file: main.ts:49 ~ DiceRoller ~ changeDieFace ~ this.dieRoll", this.dieRoll);
			this.rollDice();
			this.render();
			this.addEventListeners();
		};

		let nIntervalId: number | undefined;

		if (!nIntervalId) {
			nIntervalId = setInterval(changeDieFace, 100);
		}

		setTimeout(() => {
			clearInterval(nIntervalId);
		}, 1000);
	}

	private addEventListeners(): void {
		const diceEl = this.shadow.querySelector(".dice");
		if (diceEl) {
			diceEl.addEventListener(
				"click",
				() => {
					// console.log(event);

					this.rollAnimation();
				},
				false
			);
		}
		const form = this.shadow.querySelector("form");
		if (form) {
			form.addEventListener(
				"submit",
				(event) => {
					console.log("🚀 ~ file: main.ts:136 ~ DiceRoller ~ addEventListeners ~ event", event);
					event.preventDefault();
					const target: EventTarget | null = event.target;
					if (target) {
						const dice: string = target.dice.value || "";
						const modifier: string = target.modifier.value || "";
						const bonusDie: string = target["bonus-die"].value || "";
						const total: string = target["best-of"].value || "All Dice";
						console.log(dice, modifier, total);

						if (dice) {
							this.dice = dice.split(",");
							this.modifier = modifier ? Number(modifier) : 0;
							this.bonusDie = bonusDie ? Number(bonusDie) : 0;
							this.total = total;
							this.render();
							this.rollAnimation();
							this.addEventListeners();
						}
					}
				},
				false
			);
		}
	}

	public attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		console.log("changed", name, oldValue, newValue);

		this.render();
	}

	private render() {
		const modifier: string = this.modifier > 0 ? "+" + this.modifier.toString() : this.modifier < 0 ? this.modifier.toString() : "";
		const css = `
        <style>
            :host {
                margin: 1rem 0;
                display: block;
            }
            .dice {
                display: flex;
                gap: .8rem;
                flex-wrap: wrap;
                width: fit-content;
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
            .bonus {
                background: #ffffff22;
            }
            .modifier {
                width: 2rem;
                height: 5rem;
                display: flex;
                font-size: 2rem;
                align-items: center;
                justify-content: center;
                font-weight: bold;
            }
            .modifier:empty {
                display: none;
            }
            .total {
                width: 5rem;
                height: 5rem;
                display: flex;
                line-height: 1;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                font-size: 1rem;
                order: 2px solid transparent;
                font-weight: bold;
            }
            .total h4 {
                margin: 0;
            }
            .total span{
                font-size: 3rem;
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
            h3 {
                display: flex;
                gap: .4rem;
            }
            form {
                margin-bottom: 1rem;
                display: flex;
                flex-wrap: wrap;
                gap: .8rem;
            }
            input {
                max-width: 6rem;
            }
            #modifier, #bonus-die {
                width: 2rem;
            }
        </style>
        `;

		let selectArray = ["All Dice", "Highest Die", "Two Highest Dice", "Lowest Die"];
		let selectOptions = "";
		selectArray.forEach((item) => {
			if (item === this.total) {
				selectOptions += `<option value="${item}" selected>${item}</option>`;
			} else {
				selectOptions += `<option value="${item}">${item}</option>`;
			}
		});

		let bonusDie = "";

		if (this.bonusDie > 0) {
			bonusDie = `<div class="die bonus">${this.bonusDie}</div>`;
		}

		let html = `
        <div>
            <h3>${this.dice} ${modifier} ${this.total}</h3>
            <form>
                <div>
                    <label for="dice">Dice:</label>
                    <input id="dice" type="text" name="dice" value="${this.dice}">
                </div>
                <div>
                    <label for="modifier">Modifier:</label>
                    <input id="modifier" type="number" name="modifier" value="${this.modifier}">
                </div>
                <div>
                    <label for="bonus-die">Bonus Die:</label>
                    <input id="bonus-die" type="number" name="bonus-die" value="${this.bonusDie}">
                </div>
                <div>
                    <label for="best-of">Total:</label>
                    <select id="best-of" name="best-of">
                        ${selectOptions}
                    </select>
                </div>
                <button type="submit">Roll Dice</button>
            </form>
            <div class="dice">
                ${this.dieRolls.map((roll) => `<div class="die">${roll}</div>`).join("")}
                <div class="modifier">${modifier}</div>
                ${bonusDie}
                <div class="total"><h4>TOTAL</h4><span>${this.finalTotal}</span></div>
            </div>
        </div>
        `;

		this.shadow.innerHTML = `${css}${html}`;
	}
}
customElements.define("dice-roller", DiceRoller);
