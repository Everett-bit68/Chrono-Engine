Chrono-Engine 

An interactive, high-fidelity Victorian steampunk dashboard and chronometer built with vanilla HTML, CSS, and JavaScript. Featuring procedural Web Audio synthesis, atmospheric lighting states, and dynamic mechanical widgets.

Key Features & Complications

Victorian Chronometer Housing: Real-time analog clock face with sweep second hand, hour/minute indicators, and a live lunar phase subdial calculating accurate synodic lunar cycles.

Aether-Drive Throttle Lever: Adjustable slider (0.2x to 3.0x) controlling gear rotational velocity and energizing glowing dual thermionic vacuum coils that shift into a blue-violet Overdrive pulse.

Boiler Pressure Manometer: Simulated pressure gauge that builds under aether load, featuring an interactive manual pressure purge valve, steam-hiss/whistle audio feedback, and emergency safety relief beacons.

Solar Sundial & Gnomon Shadow: Dynamic daytime/nighttime shadow calculation shifting based on local epochs and solar progression angles.

Barometric Storm Glass: Victorian weather vial containing crystalline structures that shift appearance depending on atmospheric pressure and engine strain.

Telegraph & Dispatch Log: Live scrolling ticker receiving historical dispatch messages and system telemetry updates with interactive Morse pulse transmission.

Procedural Soundscape: Zero external audio files—all mechanical ticks, steam hisses, and telegraph tones are synthesized dynamically via the browser's Web Audio API.

How the project is built:

HTML: Semantic layout mimicking an antique brass-plated instrument panel.

CSS: Custom variables, radial gradients, keyframe animations for gears/pistons, and responsive state styling.

JavaScript: Custom loop architecture handling time math, audio oscillators, pressure dynamics, and DOM state binding.

To run locally:

Clone the repository:

git clone https://github.com/Everett-bit8/Chrono-Engine.git

Open index.html directly in your browser, or launch via a local development server (e.g., VS Code Live Server).
