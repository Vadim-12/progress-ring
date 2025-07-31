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
	input[type="number"],
	.checkbox {
		width: 100px;
		height: 50px;
		border-radius: 30px;
		box-sizing: border-box;
	}
	input[type="number"] {
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
		background: rgb(197, 205, 220);
		padding: 4px;
		position: relative;
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
	}
	input:focus, .checkbox:focus {
		outline: none;
	}
	.checkbox.active {
		background: #006aff;
	}
	.checkbox-circle {
		width: 42px;
		height: 42px;
		background: white;
		border-radius: 50%;
		position: absolute;
		top: 4px;
		left: 4px;
		transition: left 0.3s ease;
	}
	.checkbox-circle.right {
		left: calc(100% - 46px);
	}
	.hidden {
		opacity: 0;
		visibility: hidden;
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
		<div class="checkbox animate-checkbox">
			<div class="checkbox-circle"></div>
		</div>
		<span>Animate</span>
	</label>
	<label class="field">
		<div class="checkbox hide-checkbox">
			<div class="checkbox-circle"></div>
		</div>
		<span>Hide</span>
	</label>
</div>
		`;

		const ring = shadow.querySelector('.progress-ring__value');
		const input = shadow.querySelector('input[type=number]');
		const animate = shadow.querySelector('.animate-checkbox');
		const animateDot = shadow.querySelector(
			'.animate-checkbox .checkbox-circle'
		);
		const hide = shadow.querySelector('.hide-checkbox');
		const hideDot = shadow.querySelector('.hide-checkbox .checkbox-circle');
		const svg = shadow.querySelector('svg');

		let progress = 0;
		const circleLength = 2 * Math.PI * 80;

		const setProgress = (val) => {
			ring.style.strokeDashoffset = circleLength * (1 - val / 100);
		};

		input.addEventListener('input', () => {
			let val = input.value;
			if (val.startsWith('0') && val !== '0') val = val.slice(1);
			if (!val.length) val = '0';
			if (+val > 100) val = 100;
			if (+val < 0) val = 0;
			input.value = val;
			progress = +val;
			if (!ring.classList.contains('animated')) {
				setProgress(progress);
			} else {
				ring.style.strokeDashoffset = circleLength * (1 - progress / 100);
			}
		});

		animate.addEventListener('click', () => {
			const isOn = animate.classList.toggle('active');
			animateDot.classList.toggle('right', isOn);
			ring.classList.toggle('animated', isOn);
			if (!isOn) setProgress(progress);
		});

		hide.addEventListener('click', () => {
			const isHidden = hide.classList.toggle('active');
			hideDot.classList.toggle('right', isHidden);
			svg.classList.toggle('hidden', isHidden);
		});
	}
}

customElements.define('progress-ring', ProgressRing);
