import React, { useState } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    fallbackSrc?: string;
    fallbackText?: string;
}

export default function ImageWithFallback({
    src,
    fallbackSrc = 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80',
    fallbackText = 'Image not available',
    alt,
    className,
    ...props
}: ImageWithFallbackProps) {
    const [hasError, setHasError] = useState(false);

    return (
        <img
            src={hasError || !src ? fallbackSrc : src}
            alt={alt || fallbackText}
            className={className}
            onError={(e) => {
                if (!hasError) {
                    setHasError(true);
                    // Prevent infinite loop if fallback also fails
                    e.currentTarget.src = fallbackSrc;
                }
            }}
            {...props}
        />
    );
}
