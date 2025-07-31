class ProgressRing extends HTMLElement {
	constructor() {
		super();

		const shadow = this.attachShadow({ mode: 'open' });

		shadow.innerHTML = `
<style>
	:host {
		display: flex;
		font-family: Roboto, sans-serif;
		gap: 40px;
		align-items: center;
	}
	.container {
		display: flex;
		flex-direction: column;
		gap: 30px;
	}
	svg {
		width: 200px;
		height: 200px;
		transform: rotate(-90deg);
		transition: opacity 0.3s ease;
	}
	.progress-ring__bg {
		fill: none;
		stroke: #f0f0f0;
		stroke-width: 15;
	}
	.progress-ring__value {
		fill: none;
		stroke: #006aff;
		stroke-width: 15;
		stroke-linecap: round;
		stroke-dasharray: 502.65;
		stroke-dashoffset: 502.65;
		transition: stroke-dashoffset 0.3s ease;
		transform-origin: center;
	}
	.progress-ring__value.animated {
		animation: spin 1s linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	.controls {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
	.field {
		display: flex;
		align-items: center;
		gap: 15px;
		font-size: 1.2em;
	}
	input[type="number"] {
		width: 100px;
		height: 50px;
		border-radius: 30px;
		background: white;
		border: 1px solid black;
		text-align: center;
		font-size: 1.05em;
		outline: none;
	}
	input[type="number"]::-webkit-outer-spin-button,
	input[type="number"]::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	input[type="number"] {
		-moz-appearance: textfield;
	}
	.checkbox {
		width: 60px;
		height: 30px;
		background: rgb(197, 205, 220);
		border-radius: 20px;
		padding: 3px;
		position: relative;
		cursor: pointer;
		box-sizing: border-box;
	}
	.checkbox.active {
		background: #006aff;
	}
	.checkbox-circle {
		width: 24px;
		height: 24px;
		background: white;
		border-radius: 50%;
		position: absolute;
		top: 3px;
		left: 3px;
		transition: left 0.3s ease;
	}
	.checkbox-circle.right {
		left: calc(100% - 27px);
	}
	.invisible {
		opacity: 0;
		pointer-events: none;
	}
	@media (max-width: 500px) {
		:host {
			flex-direction: column;
			align-items: stretch;
			gap: 20px;
		}
		svg {
			margin: 0 auto;
		}
		.controls {
			width: 100%;
			align-items: center;
		}
	}
</style>
<div class="container">
	<svg class="progress-ring">
		<circle class="progress-ring__bg" cx="100" cy="100" r="80"/>
		<circle class="progress-ring__value" cx="100" cy="100" r="80"/>
	</svg>
</div>
<div class="controls">
	<label class="field">
		<input type="number" min="0" max="100" value="0">
		<span>Value</span>
	</label>
	<label class="field">
		<div class="checkbox animate-box">
			<div class="checkbox-circle"></div>
		</div>
		<span>Animate</span>
	</label>
	<label class="field">
		<div class="checkbox hide-box">
			<div class="checkbox-circle"></div>
		</div>
		<span>Hide</span>
	</label>
</div>
`;

		const ring = shadow.querySelector('.progress-ring__value');
		const input = shadow.querySelector('input[type=number]');
		const animateBox = shadow.querySelector('.animate-box');
		const animateDot = animateBox.querySelector('.checkbox-circle');
		const hideBox = shadow.querySelector('.hide-box');
		const hideDot = hideBox.querySelector('.checkbox-circle');
		const svg = shadow.querySelector('svg');

		let current = 0;
		const radius = 80;
		const circleLength = 2 * Math.PI * radius;

		const setProgress = (val) => {
			const offset = circleLength * (1 - val / 100);
			ring.style.strokeDashoffset = offset;
		};

		input.addEventListener('input', () => {
			let val = input.value;
			if (val.startsWith('0') && val !== '0') val = val.slice(1);
			if (!val.length) val = '0';
			if (+val > 100) val = 100;
			if (+val < 0) val = 0;
			input.value = val;
			current = +val;
			setProgress(current);
		});

		animateBox.addEventListener('click', () => {
			const active = animateBox.classList.toggle('active');
			animateDot.classList.toggle('right', active);
			ring.classList.toggle('animated', active);
			setProgress(current);
		});

		hideBox.addEventListener('click', () => {
			const active = hideBox.classList.toggle('active');
			hideDot.classList.toggle('right', active);
			svg.classList.toggle('invisible', active);
		});
	}
}
customElements.define('progress-ring', ProgressRing);
