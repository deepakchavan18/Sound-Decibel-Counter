// Request microphone access and start measuring
navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);
    const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);

    analyser.smoothingTimeConstant = 0.8;
    analyser.fftSize = 1024;

    microphone.connect(analyser);
    analyser.connect(scriptProcessor);
    scriptProcessor.connect(audioContext.destination);

    scriptProcessor.onaudioprocess = () => {
        const array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        const max = Math.max(...array);
        const dB = Math.round((max / 256) * 100);

        // Update the dB bar and value
        const dBBar = document.getElementById('dB-bar');
        const dBValue = document.getElementById('dB-value');

        dBBar.style.width = `${dB}%`;
        dBValue.textContent = `${dB} dB`;

        // Change bar color based on dB level
        if (dB > 70) {
            dBBar.style.background = '#ff0000'; // Red for high levels
        } else if (dB > 40) {
            dBBar.style.background = '#ffff00'; // Yellow for moderate levels
        } else {
            dBBar.style.background = '#00ff00'; // Green for low levels
        }
    };
}).catch(error => {
    console.error('Microphone access denied:', error);
    alert('Microphone access is required to use this feature.');
});
