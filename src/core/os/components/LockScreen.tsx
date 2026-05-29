"use client";

import {
    useEffect,
    useRef,
    useState,
    type PointerEvent as ReactPointerEvent,
} from "react";
import { ChevronUp, Delete, Fingerprint, Lock, ScanFace } from "lucide-react";

const PIN_CODE = "1234";
const EXIT_ANIMATION_MS = 620;

const formatTime = (date: Date) =>
    date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

const formatDate = (date: Date) =>
    date.toLocaleDateString([], {
        weekday: "long",
        month: "long",
        day: "numeric",
    });

const LockScreen = () => {
    const overlayRef = useRef<HTMLDivElement>(null);
    const pointerState = useRef({
        active: false,
        startY: 0,
        lastDragY: 0,
    });
    const unlockTimer = useRef<number | null>(null);

    const [mounted, setMounted] = useState(true);
    const [phase, setPhase] = useState<
        "locked" | "hello" | "pin" | "unlocking"
    >("locked");
    const [dragY, setDragY] = useState(0);
    const [dragging, setDragging] = useState(false);
    const [pin, setPin] = useState("");
    const [shake, setShake] = useState(false);
    const [now, setNow] = useState(() => new Date());
    const [panelHeight, setPanelHeight] = useState(1);
    const [platformAuthenticatorAvailable, setPlatformAuthenticatorAvailable] =
        useState<boolean | null>(null);

    useEffect(() => {
        const timer = window.setInterval(() => {
            setNow(new Date());
        }, 30_000);

        return () => window.clearInterval(timer);
    }, []);

    useEffect(() => {
        let alive = true;

        const detectHello = async () => {
            if (
                typeof window === "undefined" ||
                !("PublicKeyCredential" in window) ||
                !("credentials" in navigator) ||
                typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable !==
                    "function"
            ) {
                if (alive) setPlatformAuthenticatorAvailable(false);
                return;
            }

            try {
                const available =
                    await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
                if (alive) setPlatformAuthenticatorAvailable(available);
            } catch {
                if (alive) setPlatformAuthenticatorAvailable(false);
            }
        };

        detectHello();

        return () => {
            alive = false;
        };
    }, []);

    useEffect(() => {
        const element = overlayRef.current;
        if (!element) return;

        const updateHeight = () => {
            setPanelHeight(element.clientHeight || 1);
        };

        updateHeight();

        const resizeObserver =
            typeof ResizeObserver !== "undefined"
                ? new ResizeObserver(updateHeight)
                : null;

        resizeObserver?.observe(element);
        window.addEventListener("resize", updateHeight);

        return () => {
            resizeObserver?.disconnect();
            window.removeEventListener("resize", updateHeight);
        };
    }, [mounted]);

    useEffect(() => {
        if (phase !== "unlocking") return;

        unlockTimer.current = window.setTimeout(() => {
            setMounted(false);
        }, EXIT_ANIMATION_MS);

        return () => {
            if (unlockTimer.current !== null) {
                window.clearTimeout(unlockTimer.current);
                unlockTimer.current = null;
            }
        };
    }, [phase]);

    const height = panelHeight;
    const maxDrag = height * 0.88;
    const unlockThreshold = height * 0.34;

    const transition =
        phase === "unlocking"
            ? "transform 620ms cubic-bezier(0.22, 1, 0.36, 1), opacity 620ms cubic-bezier(0.22, 1, 0.36, 1)"
            : dragging
              ? "none"
              : "transform 320ms cubic-bezier(0.22, 1, 0.36, 1), opacity 320ms cubic-bezier(0.22, 1, 0.36, 1)";

    const updatePin = (digit: string) => {
        if (phase === "unlocking") return;

        const nextPin = `${pin}${digit}`.slice(0, 4);
        setPin(nextPin);

        if (nextPin.length !== 4) return;

        if (nextPin === PIN_CODE) {
            unlock();
            return;
        }

        setShake(true);
        window.setTimeout(() => {
            setShake(false);
            setPin("");
        }, 220);
    };

    const clearPin = () => {
        if (phase === "unlocking") return;
        setPin((current) => current.slice(0, -1));
    };

    const unlock = () => {
        setPhase("unlocking");
        pointerState.current.lastDragY = -height;
        setDragY(-height);
    };

    const beginPinFallback = () => {
        setPhase("pin");
        pointerState.current.lastDragY = 0;
        setDragY(0);
        setPin("");
    };

    const attemptHello = async () => {
        if (phase === "unlocking") return;

        if (platformAuthenticatorAvailable === false) {
            beginPinFallback();
            return;
        }

        setPhase("hello");

        try {
            const challenge = crypto.getRandomValues(new Uint8Array(32));
            const credential = await navigator.credentials.get({
                publicKey: {
                    challenge,
                    userVerification: "required",
                    timeout: 60_000,
                },
            });

            if (credential) {
                unlock();
                return;
            }

            beginPinFallback();
        } catch {
            beginPinFallback();
        }
    };

    const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (phase !== "locked") return;

        pointerState.current.active = true;
        pointerState.current.startY = event.clientY;
        pointerState.current.lastDragY = dragY;
        setDragging(true);
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (!pointerState.current.active || phase !== "locked") return;

        const nextDragY = Math.min(
            0,
            event.clientY - pointerState.current.startY,
        );
        const clampedDragY = Math.max(nextDragY, -maxDrag);
        pointerState.current.lastDragY = clampedDragY;
        setDragY(clampedDragY);
    };

    const handlePointerUp = () => {
        if (!pointerState.current.active || phase !== "locked") return;

        pointerState.current.active = false;
        setDragging(false);

        if (Math.abs(pointerState.current.lastDragY) >= unlockThreshold) {
            void attemptHello();
            return;
        }

        pointerState.current.lastDragY = 0;
        setDragY(0);
    };

    useEffect(() => {
        return () => {
            if (unlockTimer.current !== null) {
                window.clearTimeout(unlockTimer.current);
            }
        };
    }, []);

    if (!mounted) return null;

    return (
        <div
            ref={overlayRef}
            className="absolute inset-0 z-[999] select-none overflow-hidden bg-black text-white touch-none"
            style={{
                transform: `translate3d(0, ${dragY}px, 0)`,
                opacity: phase === "unlocking" ? 0 : 1,
                transition,
            }}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onTransitionEnd={(event) => {
                if (event.propertyName !== "transform" || phase !== "unlocking")
                    return;
                setMounted(false);
            }}
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.25),transparent_28%),radial-gradient(circle_at_20%_20%,rgba(74,222,128,0.16),transparent_26%),linear-gradient(180deg,#1f2b4a_0%,#111827_35%,#050505_100%)]" />
            <div className="absolute -top-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-fuchsia-500/15 blur-3xl" />

            <div className="relative z-10 flex h-full flex-col px-6 pb-6 pt-5">
                <div className="flex items-center justify-between text-xs font-medium text-white/80">
                    <span>{formatTime(now)}</span>
                    <span>Ready to unlock</span>
                </div>

                <div className="mt-12 flex flex-1 flex-col items-center justify-between">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <div>
                            <p className="text-5xl font-semibold tracking-tight">
                                {formatTime(now)}
                            </p>
                            <p className="mt-2 text-sm text-white/75">
                                {formatDate(now)}
                            </p>
                        </div>
                    </div>

                    <div className="w-full">
                        {phase === "hello" ? (
                            <div className="mx-auto flex w-full max-w-[280px] flex-col items-center rounded-[2rem] border border-white/15 bg-white/10 px-5 py-6 shadow-[0_24px_80px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
                                <div className="relative mb-4 flex h-20 w-20 items-center justify-center">
                                    <div className="absolute inset-0 animate-pulse rounded-full border border-cyan-300/30" />
                                    <div className="absolute inset-2 rounded-full border border-cyan-200/20" />
                                    <ScanFace className="h-9 w-9 text-cyan-100" />
                                </div>
                                <p className="text-lg font-semibold">
                                    Unlock with Windows Hello
                                </p>
                                <p className="mt-2 text-center text-sm text-white/65">
                                    Look at your camera or use your configured
                                    platform authenticator.
                                </p>
                                <div className="mt-4 flex items-center gap-2 text-xs text-white/55">
                                    <div className="h-2 w-2 rounded-full bg-cyan-300" />
                                    <span>Waiting for verification</span>
                                </div>
                            </div>
                        ) : null}

                        {phase === "pin" ? (
                            <div className="mx-auto w-full max-w-[330px] rounded-[2rem] border border-white/15 bg-white/10 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
                                        <Lock className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">
                                            Enter PIN
                                        </p>
                                        <p className="text-xs text-white/60">
                                            Windows Hello is not available right
                                            now.
                                        </p>
                                    </div>
                                </div>

                                <div
                                    className={`mt-5 flex items-center justify-center gap-3 ${shake ? "animate-[shake_220ms_ease-in-out]" : ""}`}
                                >
                                    {Array.from({ length: 4 }).map(
                                        (_, index) => (
                                            <div
                                                key={index}
                                                className="flex h-4 w-4 items-center justify-center rounded-full border border-white/20 bg-white/10"
                                            >
                                                <span
                                                    className={`h-2.5 w-2.5 rounded-full bg-white transition-opacity ${
                                                        pin[index]
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    }`}
                                                />
                                            </div>
                                        ),
                                    )}
                                </div>

                                <div className="mt-5 grid grid-cols-3 gap-2">
                                    {[
                                        "1",
                                        "2",
                                        "3",
                                        "4",
                                        "5",
                                        "6",
                                        "7",
                                        "8",
                                        "9",
                                    ].map((digit) => (
                                        <button
                                            key={digit}
                                            type="button"
                                            onClick={() => updatePin(digit)}
                                            className="flex h-12 items-center justify-center rounded-2xl bg-white/10 text-xl font-medium text-white transition active:scale-95"
                                        >
                                            {digit}
                                        </button>
                                    ))}
                                    <div />
                                    <button
                                        type="button"
                                        onClick={() => updatePin("0")}
                                        className="flex h-12 items-center justify-center rounded-2xl bg-white/10 text-xl font-medium text-white transition active:scale-95"
                                    >
                                        0
                                    </button>
                                    <button
                                        type="button"
                                        onClick={clearPin}
                                        className="flex h-12 items-center justify-center rounded-2xl bg-white/10 text-white transition active:scale-95"
                                    >
                                        <Delete className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        ) : null}
                    </div>

                    <div
                        className="flex w-full flex-col items-center gap-3 pb-1 pt-10"
                        onPointerDown={handlePointerDown}
                    >
                        <div className="flex items-center gap-2 text-xs text-white/45">
                            <ChevronUp className="h-4 w-4" />
                            <span>
                                {platformAuthenticatorAvailable
                                    ? "Windows Hello ready -  SWIPE UP"
                                    : "PIN fallback will appear"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LockScreen;
