import React from 'react';
import './Card.css';

type CardProps = {
    src: string;
    name: string;
    visible: boolean;
    onClick: () => void;
    id?: number;
    isMatched?: boolean;
    index?: number;
}

const Card: React.FC<CardProps> = ({ src, name, visible, onClick }) => {
    return (
        <div className={`card ${visible ? 'is-flipped' : ''}`} onClick={onClick}>
            <div className="card-inner">
                <div className="card-face card-front">
                    <img src={src} alt={name} />
                </div>


                <div className="card-face card-back" />
            </div>
        </div>
    );
};

export default Card;
