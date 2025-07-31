import React from 'react';

type Props = {
    onInput: (imgBase64: string) => void;
    id?: string;
    className?: string;
};

const Base64ImgInput = ({ onInput, id, className }: Props) => {
    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
        const file = e.currentTarget.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            onInput(result);
        };

        reader.readAsDataURL(file);
    };

    return (
        <input
        onInput={handleInput}
        id={id}
        type="file"
        accept="image/*, video/mp4"
        className={className}
        />
    );
};

export default Base64ImgInput;
