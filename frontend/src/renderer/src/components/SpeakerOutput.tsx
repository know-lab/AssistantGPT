import React, { useEffect, useState } from 'react';

const AudioPlayer = ({ src }) => {
    return (
        <div>
            <audio controls>
                <source src={src} type="audio/wav" />
                Your browser does not support the audio element.
            </audio>
        </div>
    );
};

const SpeakerOutput = () => {
    const [audioSrc, setAudioSrc] = useState(null);

    useEffect(() => {
        const fetchAudio = async () => {
            const response = await fetch('http://localhost/voice/speak?message=test');
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setAudioSrc(url);
        };

        fetchAudio();
    }, []);

    return audioSrc ? <AudioPlayer src={audioSrc} /> : <div>Loading...</div>;
};

export default SpeakerOutput;