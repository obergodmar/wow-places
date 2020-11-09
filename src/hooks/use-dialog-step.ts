import { useEffect, useRef, useState } from 'react';
import { ANIMATION_DURATION, DIALOG_STEP_DURATION } from '../utils';

interface dialogStepType {
    step: string;
    isStepShown: boolean;
}

interface Props {
    text: string[];
}

export const useDialogStep = ({ text }: Props): dialogStepType => {
    const [stepsCount] = useState(text.length);
    const [step, setStep] = useState(0);
    const [isStepShown, setStepShown] = useState(true);
    const stepIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const stepShownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        stepIntervalRef.current = setInterval(() => {
            const nextStep = step + 1;
            if (nextStep === stepsCount && stepIntervalRef.current) {
                clearInterval(stepIntervalRef.current);
            }

            setStepShown(false);
            stepShownTimeoutRef.current = setTimeout(() => {
                setStep(nextStep);
                setStepShown(true);
            }, ANIMATION_DURATION / 2);
        }, DIALOG_STEP_DURATION);

        return () => {
            if (stepIntervalRef.current) {
                clearInterval(stepIntervalRef.current);
            }

            if (stepShownTimeoutRef.current) {
                clearTimeout(stepShownTimeoutRef.current);
            }
        };
    }, [step, stepsCount]);

    return {
        step: text[step],
        isStepShown,
    };
};
