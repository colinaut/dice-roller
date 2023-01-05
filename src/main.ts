export default class DiceRoller extends HTMLElement {
	private shadow: ShadowRoot;

	constructor() {
		super();
		this.shadow = this.attachShadow({ mode: "open" });
	}

	private getA(attr: string, fallback: string = ""): string {
		return this.getAttribute(attr) || fallback;
	}

	get amount(): number {
		return Number(this.getA("amount", "1"));
	}
	get sides(): number {
		return Number(this.getA("sides", "6"));
	}

	get roll(): number {
		return Number(this.getA("roll", this.sides.toString()));
	}

	set roll(roll) {
		this.setAttribute("roll", roll.toString());
	}

	static get observedAttributes(): string[] {
		return ["amount", "sides", "roll"];
	}

	public connectedCallback(): void {
		this.render();
		this.addEventListeners();
	}

	private addEventListeners(): void {
		this.shadow.addEventListener(
			"click",
			(event) => {
				// console.log(event);

				const changeDieFace = (roll: number) => {
					roll = Math.floor(Math.random() * this.sides + 1);
					this.roll = roll;
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
		// console.log("changed", name, oldValue, newValue);

		this.render();
	}

	private render() {
		const css = `
        <style>
            .dice {
                width: 5rem;
                height: 5rem;
                border: 2px solid #fff;
                border-radius: .5rem;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .num {
                font-size: 3rem;
            }
        </style>
        `;

		let html = `
        <div>
            <h3>${this.amount}d${this.sides}</h3>
            <div class="dice" >
               <div class="num">${this.roll}</div>
            </div>
        </div>
        `;

		this.shadow.innerHTML = `${css}${html}`;
	}
}
customElements.define("dice-roller", DiceRoller);
