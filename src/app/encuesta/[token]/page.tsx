'use client';

/**
 * Encuesta de satisfacción pública (WhatsApp CRM F16) — magic link anónimo.
 *
 * Réplica del kiosco del frontend ERP para que el link funcione también en
 * el dominio del fundador (este sitio sirve www.titanesgraficos.com.ve).
 * El backend resuelve la empresa dueña del token internamente (anti-cruce),
 * así que el header de tenant es irrelevante para este endpoint.
 *
 * Route: /encuesta/{token}
 * API:   GET/POST {NEXT_PUBLIC_API_URL}/encuesta/{token}/
 *
 * Auto-contenida (estilos inline): no depende del design system del sitio.
 */

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' && window.location.hostname.includes('titanesgraficos.com') ? 'https://api.printacloud.com/api/v1/web' : 'http://localhost:8000/api/v1/web');

async function publicFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<{ ok: boolean; data: T }> {
    const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'X-Tenant-Id': 'titanes_tenant',
            ...((options.headers as Record<string, string>) || {}),
        },
    });
    const data = await res.json().catch(() => ({} as T));
    return { ok: res.ok, data };
}

const CARAS: { valor: number; emoji: string; label: string }[] = [
    { valor: 1, emoji: '😡', label: 'Muy mala' },
    { valor: 2, emoji: '😞', label: 'Mala' },
    { valor: 3, emoji: '😐', label: 'Regular' },
    { valor: 4, emoji: '🙂', label: 'Buena' },
    { valor: 5, emoji: '😍', label: 'Excelente' },
];

type Estado = 'cargando' | 'lista' | 'enviando' | 'gracias' | 'invalida';

const st = {
    page: {
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #020617 0%, #0f172a 50%, #020617 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
    } as React.CSSProperties,
    card: {
        width: '100%', maxWidth: 384, background: 'rgba(15,23,42,0.85)',
        border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: 24,
    } as React.CSSProperties,
    h1: { fontSize: 20, fontWeight: 700, color: '#fff', textAlign: 'center', margin: 0 } as React.CSSProperties,
    sub: { fontSize: 12, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: 6 } as React.CSSProperties,
    boton: {
        width: '100%', padding: '14px 0', borderRadius: 16, border: 'none',
        background: '#a855f7', color: '#fff', fontWeight: 600, fontSize: 14,
        cursor: 'pointer', marginTop: 20,
    } as React.CSSProperties,
    textarea: {
        width: '100%', marginTop: 16, background: '#1e293b',
        border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12,
        padding: '10px 12px', fontSize: 14, color: '#fff', resize: 'none' as const,
        boxSizing: 'border-box' as const,
    } as React.CSSProperties,
};

export default function EncuestaPublicaPage() {
    const params = useParams<{ token: string }>();
    const token = params?.token;

    const [estado, setEstado] = useState<Estado>('cargando');
    const [motivo, setMotivo] = useState('');
    const [empresa, setEmpresa] = useState('');
    const [rating, setRating] = useState<number | null>(null);
    const [comentario, setComentario] = useState('');

    useEffect(() => {
        if (!token) return;
        publicFetch<{ success?: boolean; data?: { empresa?: string }; error?: string }>(
            `/encuesta/${token}/`,
        ).then((r) => {
            if (r.ok && r.data?.success) {
                setEmpresa(r.data.data?.empresa || '');
                setEstado('lista');
            } else {
                setMotivo(r.data?.error || '');
                setEstado('invalida');
            }
        }).catch(() => setEstado('invalida'));
    }, [token]);

    const enviar = async () => {
        if (!rating || estado === 'enviando') return;
        setEstado('enviando');
        const r = await publicFetch(`/encuesta/${token}/`, {
            method: 'POST',
            body: JSON.stringify({ rating, comentario: comentario.trim() }),
        });
        setEstado(r.ok ? 'gracias' : 'lista');
    };

    return (
        <div style={st.page}>
            <div style={st.card}>
                {estado === 'cargando' && (
                    <p style={{ ...st.sub, fontSize: 14 }}>Cargando…</p>
                )}

                {estado === 'invalida' && (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 48 }}>⌛</div>
                        <h1 style={{ ...st.h1, fontSize: 17, marginTop: 10 }}>
                            Este enlace ya no está disponible
                        </h1>
                        <p style={st.sub}>
                            {motivo === 'usado'
                                ? 'Esta encuesta ya fue respondida. ¡Gracias!'
                                : 'El enlace venció o no es válido.'}
                        </p>
                    </div>
                )}

                {(estado === 'lista' || estado === 'enviando') && (
                    <>
                        <h1 style={st.h1}>
                            ¿Cómo fue tu atención{empresa ? ` en ${empresa}` : ''}?
                        </h1>
                        <p style={st.sub}>
                            Tu respuesta es anónima y nos ayuda a mejorar. Toma 10 segundos.
                        </p>

                        <div style={{ display: 'flex', gap: 4, marginTop: 20 }}>
                            {CARAS.map((c) => (
                                <button
                                    key={c.valor}
                                    type="button"
                                    onClick={() => setRating(c.valor)}
                                    style={{
                                        flex: 1, display: 'flex', flexDirection: 'column',
                                        alignItems: 'center', gap: 4, padding: '12px 0',
                                        borderRadius: 16, cursor: 'pointer',
                                        background: rating === c.valor
                                            ? 'rgba(168,85,247,0.25)' : 'rgba(255,255,255,0.05)',
                                        border: rating === c.valor
                                            ? '2px solid #c084fc' : '2px solid transparent',
                                        transform: rating === c.valor ? 'scale(1.08)' : 'none',
                                        transition: 'all .15s',
                                    }}
                                >
                                    <span style={{ fontSize: 28 }}>{c.emoji}</span>
                                    <span style={{
                                        fontSize: 10,
                                        color: rating === c.valor ? '#e9d5ff' : 'rgba(255,255,255,0.4)',
                                    }}>
                                        {c.label}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {rating !== null && (
                            <textarea
                                value={comentario}
                                onChange={(e) => setComentario(e.target.value)}
                                rows={3}
                                maxLength={2000}
                                placeholder={rating <= 3
                                    ? '¿Qué pudo ser mejor? Cuéntanos (opcional)…'
                                    : '¿Algo que quieras contarnos? (opcional)…'}
                                style={st.textarea}
                            />
                        )}

                        <button
                            type="button"
                            onClick={enviar}
                            disabled={!rating || estado === 'enviando'}
                            style={{
                                ...st.boton,
                                opacity: !rating || estado === 'enviando' ? 0.4 : 1,
                            }}
                        >
                            {estado === 'enviando' ? 'Enviando…' : 'Enviar mi opinión'}
                        </button>
                    </>
                )}

                {estado === 'gracias' && (
                    <div style={{ textAlign: 'center', padding: '16px 0' }}>
                        <div style={{ fontSize: 56 }}>🙌</div>
                        <h1 style={{ ...st.h1, marginTop: 8 }}>¡Mil gracias!</h1>
                        <p style={st.sub}>Tu opinión nos ayuda a atenderte cada día mejor.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
