import React, { useState, useEffect } from 'react';

const GlitchText = ({ text, isFractured, className = "" }) => {
    const [glitched, setGlitched] = useState(text);

    useEffect(() => {
        if (!isFractured) {
            setGlitched(text);
            return;
        }

        // A simple symbol mapping 
        const glitchChars = '!<>-_\\\\/[]{}—=+*^?#_$%&■▲◆';

        const interval = setInterval(() => {
            // 30% chance to partially randomize the text to mimic language collapsing
            if (Math.random() > 0.7) {
                let newText = "";
                for (let i = 0; i < text.length; i++) {
                    if (text[i] === ' ' || text[i] === '\n') {
                        newText += text[i];
                    } else if (Math.random() > 0.8) {
                        newText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
                    } else {
                        newText += text[i];
                    }
                }
                setGlitched(newText);
            } else {
                setGlitched(text);
            }
        }, 150);

        return () => clearInterval(interval);
    }, [text, isFractured]);

    return (
        <span
            className={`transition-all duration-300 ${isFractured ? 'text-red-400 font-mono tracking-widest' : ''} ${className}`}
            data-text={text}
        >
            {glitched}
        </span>
    );
};

export default GlitchText;
