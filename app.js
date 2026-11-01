document.addEventListener("DOMContentLoaded", () =>{
    updateclock();
    setInterval(updateclock, 1000);
});

let audioCtx = null;
let currentPressure = 0;
let lastSpeedFactor = 0;
let isMuted = false;
let MainspringPower = 100;
let isEngineRunDown = false;

function initAudio(){
    if (!audioCtx){
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } else if (audioCtx.state === 'suspended'){
        audioCtx.resume();
    }
}
function updateclock(){
    if (isEngineRunDown) return;
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
    updatelunarsubdial();
    updatePowerReserve();
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
function toggleMute(){
    isMuted = !isMuted;
    const container = document.querySelector('.mute-switch-container');
    const statusText = document.getElementById('switchStatus');

    if(isMuted){
        container.classList.add('muted');
        if (statusText) statusText.innerText = "SILENCED";
        if (statusText) statusText.style.color = "#5c4713";
    } else {
        container.classList.remove('muted');
        if (statusText) statusText.innerText = "ENGAGED";
        if (statusText) statusText.style.color = "var(--brass-primary)";
    }
}
function playMechanicalTick() {
    if (isMuted) return;
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
    if (isMuted) return;
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
function updatelunarsubdial(){
    const now = new Date();
    const knownNewMoon = new Date(2024, 0,11 ,11, 57).getTime();
    const synodicMonth = 29.5 * 86400000;
    const diff = now.getTime() - knownNewMoon;
    const cycleProgress = (diff % synodicMonth) /synodicMonth;
    const ageInDays = cycleProgress * 29.5;
    let phaseText = "NEW MOON";
    if (ageInDays >= 2 && ageInDays < 6) phaseText = "WAXING CRES";
    else if(ageInDays >= 6 && ageInDays < 9) phaseText = "1ST QUARTER";
    else if(ageInDays >= 9 &&ageInDays <13) phaseText= "WAXING GIBB";
    else if (ageInDays>= 13 &&ageInDays<17) phaseText="FULL MOON";
    else if(ageInDays >= 17 && ageInDays < 20) phaseText="WANING GIBB";
    else if(ageInDays >=20 && ageInDays< 24) phaseText="3RD QUARTER";
    else if(ageInDays >= 24 && ageInDays <29.5) phaseText="WANING CRES";
    const label = document.getElementById("lunarPhaseText");
    const shadow = document.getElementById("lunarShadow");
    if (label) label.innerText = phaseText;
    if(shadow){
        const offset = (cycleProgress - 0.5) * 200;
        shadow.style.transform = `translateX(${offset}%`;
    }
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
    let speedFactor = '8s';
    if(currentPressure > 75) speedFactor ='1.5s';
    else if (currentPressure > 50) speedFactor = '3s';
    else if (currentPressure > 25) speedFactor = '5s';
    else speedFactor = '8s';
    if (speedFactor !== lastSpeedFactor){
        lastSpeedFactor = speedFactor;
        const gearContainer = document.querySelector('.gear-container');
        if(gearContainer){
            gearContainer.style.setProperty('--gear-speed',speedFactor);
        }
    }
    if (status){
        if (currentPressure > 85){
            status.innerText = "WARNING: OVERPRESSURE!";
            status.style.color = "#ff4500";
            if(Math.random() < 0.15){
                playSteamhiss();
                spawnSteam();
            }
        } else if (currentPressure > 50){
            status.innerText = "Pressure Building...";
            status.style.color="var(--copper)";
        } else {
            status.innerText="Pressure Stable";
            status.style.color ="var(--brass-primary)";
        }
    }
}
function spawnSteam(){
    const container = document.querySelector('.main-container');
    if (!container) return;
    for (let i = 0; i < 12; i++){
        const puff = document.createElement('div');
        puff.classList.add('steam-puff');
        const size = Math.random() * 35 + 25;
        const randX = (Math.random() - 0.5) * 100 + 'px';
        const startX = Math.random() * 240 - 120 + 'px';
        puff.style.width = `${size}px`;
        puff.style.height = `${size}px`;
        puff.style.setProperty('--rand-x',randX);
        puff.style.top = '40px';
        puff.style.left = `calc(50% + ${startX})`;
        container.appendChild(puff);
        setTimeout(()=>{
            puff.remove();
        }, 900);
    }
}
function releasePressure(){
    playSteamhiss();
    spawnSteam();
    currentPressure = 0;
    updatePressure();
}
function updatePowerReserve(){
    if (MainspringPower > 0){
        MainspringPower -= 0.02;
        if (MainspringPower <= 0){
            MainspringPower = 0;
            isEngineRunDown = true;
            triggerEngineHalt();
        }
    }
    const fill = document.getElementById("powerBarFill");
    const status = document.getElementById("powerStatus");
    if (fill) fill.style.width = `${MainspringPower}%`;
    if (status){
        if (isEngineRunDown){
            status.innerText = "UNWOUND - CLICK TO WIND";
            status.style.color = "#ff4500";
        } else {
            status.innerText = `Tension: ${Math.floor(MainspringPower)} Units`;
            status.style.color = "var(--brass-primary)";
        }
    }
}
function triggerEngineHalt(){
    playSteamhiss();
    const gearContainer = document.querySelector('.gear-container');
    if (gearContainer){
        gearContainer.style.setProperty('--gear-speed','999999s');
    }
}
function windMainSpring(){
    MainspringPower = 100;
    isEngineRunDown = false;
    updatePressure();
    playMechanicalTick();
    const status = document.getElementById("powerStatus")
    if (status){
        status.innerText = "Tension: 100 Units";
        status.style.color = "var(--brass-primary)";
    }
}