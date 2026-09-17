import { useEffect, useState } from 'react';
import { ANIMATION_DURATION, DIALOG_STEP_DURATION } from '../utils';
export const useDialogStep = ({ text }: { text: string[] }) => {
    const [step, setStep] = useState(0);
    const [isStepShown, setStepShown] = useState(true);
    useEffect(() => {
        if (step >= text.length - 1) return;
        let fade: ReturnType<typeof setTimeout>;
        const timer = setTimeout(() => {
            setStepShown(false);
            fade = setTimeout(() => {
                setStep((value) => value + 1);
                setStepShown(true);
            }, ANIMATION_DURATION / 2);
        }, DIALOG_STEP_DURATION);
        return () => {
            clearTimeout(timer);
            clearTimeout(fade);
        };
    }, [step, text.length]);
    return { step: text[Math.min(step, text.length - 1)] ?? '', isStepShown };
};
