document.addEventListener("DOMContentLoaded", () =>{
    updateclock();
    setInterval(updateclock, 1000);
});

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

    if(secondHand) secondHand.style.transform= `rotate(${secondDeg}deg)`;
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
}

function updateSundialShadow(hours, minutes){
    const gnomonShadow = document.getElementById("gnomonShadow");
    if (!gnomonShadow) return;

    const totalMinutes = hours * 60 + minutes;
    const sunrise = 6 * 60;
    const sunset = 18 * 60;

    if(totalMinutes < sunrise || totalMinutes > sunset){
        gnomonShadow.style.opacity = "0.2";
        gnomonShadow.style.transform = "rotate(90deg) scaleY(0.5)";
    } else{
        const dayProgress = (totalMinutes - sunrise) / (sunset - sunrise);
        const angle = -70 + (dayProgress * 140);
        gnomonShadow.style.opacity = "0.8";
        gnomonShadow.style.transform = `rotate(${angle}deg)`;
    }
}