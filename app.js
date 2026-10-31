document.addEventListener("DOMContentLoaded", () =>{
    updateclock();
    setInterval(updateclock, 1000);
});

let audioCtx = null;
let currentPressure = 0;

function initAudio(){
    if (!audioCtx){
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } else if (audioCtx.state === 'suspended'){
        audioCtx.resume();
    }
}
function updateclock(){
    const now = new Date();
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours();

    const secondDeg = (seconds/60) * 360;
    const minuteDeg = ((minutes + seconds/60)/60) * 360;
    const hourDeg = (((hours % 12)+ minutes / 60)/12) * 360;

    const secondHand = document.getElementById("secondHand");
    const minuteHand = document.getElementById("minuteHand");
    const hourHand = document.getElementById("hourHand");

    if(secondHand){
        secondHand.style.transform= `rotate(${secondDeg}deg)`;
        playMechanicalTick();
    } 
    if (minuteHand) minuteHand.style.transform = `rotate(${minuteDeg}deg)`;
    if (hourHand) hourHand.style.transform= `rotate(${hourDeg}deg)`;

    const pad = (num) => String(num).padStart(2,'0');
    const digitalTime = document.getElementById("digitalTime");
    if (digitalTime){
        digitalTime.innerText = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
    const antiqueDate = document.getElementById("antiqueDate");
    if (antiqueDate){
        antiqueDate.innerText = `Anno Domini - Sunday, 28 October 1888`;
    }

    updateSundialShadow(hours, minutes);
    updateAtmospherelighting(hours);
    updatePressure();
}
function updateAtmospherelighting(hours){
    const body = document.body;

    body.classList.remove("time-day","time-evening","time-night");
    if (hours >= 6 && hours < 17){
        body.classList.add("time-day");
    } else if(hours >=17 && hours < 20) {
        body.classList.add("time-evening");
    } else {
        body.classList.add("time-night");
    }
}
function updateSundialShadow(hours, minutes){
    const gnomonShadow = document.getElementById("gnomonShadow");
    if (!gnomonShadow) return;

    const totalMinutes = hours * 60 + minutes;
    const sunrise = 6 * 60;
    const sunset = 18 * 60;

    if(totalMinutes < sunrise || totalMinutes > sunset){

        let nightMinutes = totalMinutes > sunset ? totalMinutes - sunset : totalMinutes + (24 * 60 - sunset);
        const nightProgress = nightMinutes / (24 * 60 - (sunset - sunrise));
        const nightAngle = -70 + (nightProgress * 140);
        gnomonShadow.style.opacity = "0.7";
        gnomonShadow.style.transform = `rotate(${nightAngle}deg)`;
    } else{
        const dayProgress = (totalMinutes - sunrise) / (sunset - sunrise);
        const angle = -70 + (dayProgress * 140);
        gnomonShadow.style.opacity = "0.8";
        gnomonShadow.style.transform = `rotate(${angle}deg)`;
    }
}
function playMechanicalTick() {
    if (!audioCtx) return;
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.015);
    gain.gain.setValueAtTime(0.15,audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.015);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.015);
}

function playSteamhiss(){
    initAudio();
    if (!audioCtx) return;

    const buffersize = audioCtx.sampleRate * 0.4;
    const buffer = audioCtx.createBuffer(1, buffersize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i=0; i < buffersize; i++){
        data[i] = Math.random() * 2 - 1;
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer= buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1000, audioCtx.currentTime);
    filter.Q.setValueAtTime(3, audioCtx.currentTime);
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    noise.start();
}
function updatePressure(){
    if (currentPressure < 100){
        currentPressure += 0.8;
        if (currentPressure > 100) currentPressure = 100;
    }

    const needle = document.getElementById("gaugeNeedle");
    const status = document.getElementById("gaugeStatus");

    if (needle){
        const angle = -90 + (currentPressure / 100) * 180;
        needle.style.transform = `translateX(-50%) rotate(${angle}deg)`;
    }
    const speedFactor = Math.max(0.8,8 - (currentPressure / 14));
    const gearContainer = document.querySelector('.gear-container');
    if (gearContainer){
        gearContainer.style.setProperty('--gear-speed', `${speedFactor}s`);
    }

    if (status){
        if (currentPressure > 85){
            status.innerText = "WARNING: OVERPRESSURE!";
            status.style.color = "#ff4500";
        } else if (currentPressure > 50){
            status.innerText = "Pressure Building...";
            status.style.color="var(--copper)";
        } else {
            status.innerText="Pressure Stable";
            status.style.color ="var(--brass-primary)";
        }
    }
}
function releasePressure(){
    playSteamhiss();
    currentPressure = 0;
    updatePressure();
}