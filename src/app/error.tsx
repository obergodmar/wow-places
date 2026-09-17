'use client';
import '../components/dialog-box/dialog-box.scss';
export default function ErrorPage({ reset }: { reset: () => void }) {
    return (
        <div role="alert" className="dialog-box">
            <span className="dialog-box-message">Unable to load places. Please try again.</span>
            <button onClick={reset}>Retry</button>
        </div>
    );
}
