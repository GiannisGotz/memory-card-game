import { useState, useEffect } from 'react';
import heroes from "./heroes.ts";
import Card from './Card.tsx';
import Confetti from 'react-confetti';

type Hero = {
    id: number;
    name: string;
    src: string;
}

type GameCard = Hero & {
    isMatched: boolean;
}

type SelectedCard = GameCard & {
    index: number;
}

const Gameboard = () => {
    const [cardsArray, setCardsArray] = useState<GameCard[]>([]);
    const [firstCard, setFirstCard] = useState<SelectedCard | null>(null);
    const [secondCard, setSecondCard] = useState<SelectedCard | null>(null);
    const [win, setWin] = useState(0);
    const [lock, setLock] = useState(false);
    const [count, setCount] = useState(0);
    const [record,setRecord] = useState(0);


    useEffect(() => {
        shuffleCards();
    }, []);

    const shuffleCards = () => {
        const cards = [...heroes, ...heroes].map((card) => ({
            ...card,
            isMatched: false,
        }));

        // Fisher–Yates shuffle
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }

        setCardsArray(cards);
        setFirstCard(null);
        setSecondCard(null);
        setWin(0);
        setLock(false);
        setCount(0);
    };

    const handleOpenedCards = (cardIndex: number) => {
        const card = cardsArray[cardIndex];
        if (lock || card.isMatched) return;
        if (!firstCard) {
            setFirstCard({ ...card, index: cardIndex });
            return;
        }
        if (cardIndex === firstCard.index) return; // ignore same-card click
        setSecondCard({ ...card, index: cardIndex });
    };

    useEffect(() => {
        if (!firstCard || !secondCard) return;

        setLock(true);

        if (firstCard.id === secondCard.id) {
            // Match
            setCardsArray((prev) =>
                prev.map((c) => (c.id === firstCard.id ? { ...c, isMatched: true } : c))
            );
            setWin((prev) => prev + 1);
            resetTurn();
        } else {
            // Not a match: briefly show both, then hide
            const t = setTimeout(() => {
                resetTurn();
            }, 800);
            return () => clearTimeout(t);
        }
    }, [firstCard, secondCard]);

    const resetTurn = () => {
        setFirstCard(null);
        setSecondCard(null);
        setLock(false);
    };

    const totalPairs = cardsArray.length / 2;

    useEffect(() => {
        if (win === totalPairs && totalPairs !== 0) {
            if (record === 0 || count < record) {
                setRecord(count);
            }
        }
    }, [win, totalPairs, count, record]);

    return (
        <>
            {win === totalPairs && totalPairs > 0 && <Confetti />}

            <div className="p-2 sm:p-4 lg:p-8 min-h-screen flex items-center justify-center">
                <div className="text-center w-full max-w-4xl">

                    <h1 className="text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-white mb-2 sm:mb-4 lg:mb-8 px-1 sm:px-2 leading-tight">
                        Kαλώς ήρθατε στο παιχνίδι μνήμης της Αριάνας!!!</h1>

                    <button
                        className="bg-purple-800 hover:bg-purple-200 text-white font-semibold py-1.5 px-3 sm:py-2 sm:px-4 lg:px-6 rounded-lg shadow-md transition-colors duration-200 mb-2 sm:mb-4 lg:mb-8 text-xs sm:text-sm lg:text-base"
                        onClick={shuffleCards}>
                        Νέο παρτίδα
                    </button>


                    <div className="card-grid">
                        {cardsArray.map((card, index) => (
                            <Card
                                key={index}
                                onClick={() => {
                                    handleOpenedCards(index);
                                    setCount((count) => count + 1);
                                }}
                                {...card}
                                visible={
                                    index === firstCard?.index ||
                                    index === secondCard?.index ||
                                    card.isMatched
                                }
                            />
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center mt-2 sm:mt-4 lg:mt-8 gap-1 sm:gap-2 lg:gap-8 px-1 sm:px-4">

                    <button
                        className="bg-purple-800 hover:bg-purple-200 text-white font-semibold py-1.5 px-3 sm:py-2 sm:px-4 lg:px-6 rounded-lg shadow-md transition-colors duration-200 text-xs sm:text-sm lg:text-base whitespace-nowrap"
                    >
                        Κινήσεις {count}
                    </button>

                <button
                    className="bg-purple-800 hover:bg-purple-200 text-white font-semibold py-1.5 px-3 sm:py-2 sm:px-4 lg:px-6 rounded-lg shadow-md transition-colors duration-200 text-xs sm:text-sm lg:text-base whitespace-nowrap"
                >
                    Ρεκόρ {record}
                </button>
            </div>
                </div>
            </div>

        </>
    );
};

export default Gameboard;
