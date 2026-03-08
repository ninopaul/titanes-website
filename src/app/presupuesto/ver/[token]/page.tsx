'use client';

/**
 * Public Presupuesto Preview Page (Website)
 *
 * Accessible via magic link sent by email — no authentication required.
 * Allows client to view, approve, or reject a presupuesto.
 *
 * Route: /presupuesto/ver/{token}
 * API:   GET  /api/v1/web/presupuesto/ver/{token}/
 *        POST /api/v1/web/presupuesto/ver/{token}/aprobar/
 *        POST /api/v1/web/presupuesto/ver/{token}/rechazar/
 */

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';

// ---------------------------------------------------------------------------
// API helper (no auth, public endpoints)
// ---------------------------------------------------------------------------

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1/web';

async function publicFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<{ ok: boolean; status: number; data: T }> {
    const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'X-Tenant-Id': 'titanes_tenant',
            ...((options.headers as Record<string, string>) || {}),
        },
    });
    const data = await res.json().catch(() => ({} as T));
    return { ok: res.ok, status: res.status, data };
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PresupuestoItem {
    descripcion: string;
    detalle: string;
    cantidad: number;
    unidad_cobro: string;
    precio_unitario: number;
    subtotal: number;
    total: number;
}

interface PresupuestoData {
    numero: string;
    titulo: string;
    fecha: string;
    fecha_vencimiento: string | null;
    cliente: {
        nombre: string;
        contacto: string;
        email: string;
    };
    vendedor: {
        nombre: string;
    };
    items: PresupuestoItem[];
    subtotal: number;
    impuesto: number;
    descuento: number;
    total: number;
    incluir_iva: boolean;
    notas: string;
    estado: string;
    respuesta: string;
    respuesta_at: string | null;
    notas_cliente: string;
}

type PageState =
    | 'loading'
    | 'invalid'
    | 'expired'
    | 'normal'
    | 'responded'
    | 'thank-you'
    | 'error';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-VE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}

function formatDate(dateStr: string): string {
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function LoadingState() {
    return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a1a' }}>
            <div className="text-center space-y-6">
                <div className="relative mx-auto w-16 h-16">
                    <div
                        className="absolute inset-0 rounded-full border-2 border-transparent animate-spin"
                        style={{ borderTopColor: '#f0c040', borderRightColor: '#f0c040' }}
                    />
                    <div
                        className="absolute inset-2 rounded-full border-2 border-transparent animate-spin"
                        style={{
                            borderBottomColor: '#d4a830',
                            borderLeftColor: '#d4a830',
                            animationDirection: 'reverse',
                            animationDuration: '1.5s',
                        }}
                    />
                </div>
                <p style={{ color: '#a0a0c0' }} className="text-sm tracking-wide">
                    Cargando presupuesto...
                </p>
            </div>
        </div>
    );
}

function ErrorState({ message, icon }: { message: string; icon: string }) {
    return (
        <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0a0a1a' }}>
            <div
                className="max-w-md w-full rounded-2xl p-8 text-center space-y-5"
                style={{ background: '#12122a', border: '1px solid #1e1e3a' }}
            >
                <div className="text-5xl">{icon}</div>
                <p style={{ color: '#c0c0d8' }} className="text-lg">
                    {message}
                </p>
                <p style={{ color: '#60607a' }} className="text-sm">
                    Si crees que esto es un error, contacta a tu vendedor.
                </p>
            </div>
        </div>
    );
}

function ThankYouScreen({ action }: { action: 'aprobado' | 'rechazado' }) {
    const isApproved = action === 'aprobado';
    return (
        <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0a0a1a' }}>
            <div
                className="max-w-md w-full rounded-2xl p-10 text-center space-y-6"
                style={{ background: '#12122a', border: '1px solid #1e1e3a' }}
            >
                <div
                    className="mx-auto w-20 h-20 rounded-full flex items-center justify-center text-4xl"
                    style={{
                        background: isApproved ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    }}
                >
                    {isApproved ? '✓' : '✗'}
                </div>
                <h2 className="text-2xl font-bold" style={{ color: '#f0f0ff' }}>
                    Gracias por tu respuesta
                </h2>
                <p style={{ color: '#a0a0c0' }}>
                    {isApproved
                        ? 'Tu presupuesto ha sido aprobado. Nuestro equipo se pondrá en contacto contigo para los próximos pasos.'
                        : 'Tu respuesta fue registrada. Si deseas recibir una nueva propuesta, no dudes en contactarnos.'}
                </p>
                <div
                    className="inline-block rounded-full px-5 py-2 text-sm font-semibold"
                    style={{
                        background: isApproved ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: isApproved ? '#22c55e' : '#ef4444',
                    }}
                >
                    {isApproved ? 'Presupuesto Aprobado' : 'Presupuesto Rechazado'}
                </div>
            </div>
        </div>
    );
}

function ActionModal({
    type,
    onClose,
    onConfirm,
    loading,
}: {
    type: 'aprobar' | 'rechazar';
    onClose: () => void;
    onConfirm: (notas: string) => void;
    loading: boolean;
}) {
    const [notas, setNotas] = useState('');
    const isApprove = type === 'aprobar';

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
            style={{ background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
        >
            <div
                className="max-w-lg w-full rounded-2xl p-6 space-y-5"
                style={{ background: '#12122a', border: '1px solid #1e1e3a' }}
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-xl font-bold" style={{ color: '#f0f0ff' }}>
                    {isApprove ? 'Confirmar Aprobación' : 'Rechazar Presupuesto'}
                </h3>
                <p style={{ color: '#a0a0c0' }} className="text-sm">
                    {isApprove
                        ? 'Al aprobar, confirmas que aceptas los términos y precios de este presupuesto.'
                        : 'Por favor, indícanos el motivo del rechazo para poder mejorar nuestra propuesta.'}
                </p>
                <div>
                    <label
                        className="block text-xs font-medium mb-2 uppercase tracking-wider"
                        style={{ color: '#70708a' }}
                    >
                        {isApprove ? 'Notas adicionales (opcional)' : 'Motivo del rechazo'}
                    </label>
                    <textarea
                        rows={3}
                        value={notas}
                        onChange={(e) => setNotas(e.target.value)}
                        placeholder={
                            isApprove
                                ? 'Alguna observación...'
                                : 'Ej: El presupuesto excede nuestro límite...'
                        }
                        className="w-full rounded-lg px-4 py-3 text-sm outline-none resize-none transition-colors"
                        style={{
                            background: '#0a0a1a',
                            color: '#e0e0f0',
                            border: '1px solid #2a2a4a',
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = '#f0c040')}
                        onBlur={(e) => (e.currentTarget.style.borderColor = '#2a2a4a')}
                    />
                </div>
                <div className="flex items-center gap-3 pt-2">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 rounded-lg px-4 py-3 text-sm font-medium transition-colors"
                        style={{ background: '#1e1e3a', color: '#a0a0c0' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#2a2a4a')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = '#1e1e3a')}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => onConfirm(notas)}
                        disabled={loading || (!isApprove && !notas.trim())}
                        className="flex-1 rounded-lg px-4 py-3 text-sm font-bold transition-all"
                        style={{
                            background: isApprove ? '#16a34a' : '#dc2626',
                            color: '#fff',
                            opacity: loading || (!isApprove && !notas.trim()) ? 0.5 : 1,
                        }}
                    >
                        {loading
                            ? 'Enviando...'
                            : isApprove
                            ? 'Confirmar Aprobación'
                            : 'Confirmar Rechazo'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Badge for response status
// ---------------------------------------------------------------------------

function ResponseBadge({ respuesta }: { respuesta: string }) {
    const styles: Record<string, { bg: string; text: string; label: string }> = {
        aprobado: { bg: 'rgba(34, 197, 94, 0.15)', text: '#22c55e', label: 'Aprobado' },
        rechazado: { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444', label: 'Rechazado' },
    };
    const s = styles[respuesta] || { bg: 'rgba(160, 160, 192, 0.15)', text: '#a0a0c0', label: respuesta };
    return (
        <span
            className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold"
            style={{ background: s.bg, color: s.text }}
        >
            {s.label}
        </span>
    );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function PresupuestoVerPage() {
    const params = useParams();
    const token = params?.token as string;

    const [state, setState] = useState<PageState>('loading');
    const [data, setData] = useState<PresupuestoData | null>(null);
    const [modal, setModal] = useState<'aprobar' | 'rechazar' | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [lastAction, setLastAction] = useState<'aprobado' | 'rechazado' | null>(null);
    const [errorMsg, setErrorMsg] = useState('');

    // Fetch presupuesto data
    const fetchPresupuesto = useCallback(async () => {
        if (!token) return;
        setState('loading');
        try {
            const res = await publicFetch<{ success: boolean; data: PresupuestoData; error?: string }>(
                `/presupuesto/ver/${token}/`
            );

            if (res.status === 404) {
                setState('invalid');
                return;
            }
            if (res.status === 410) {
                setState('expired');
                return;
            }
            if (!res.ok) {
                setErrorMsg('Error al cargar el presupuesto. Intenta nuevamente.');
                setState('error');
                return;
            }

            if (!res.data.success) {
                setErrorMsg(res.data.error || 'Error desconocido.');
                setState('error');
                return;
            }

            setData(res.data.data);
            if (res.data.data.respuesta && res.data.data.respuesta !== '') {
                setState('responded');
            } else {
                setState('normal');
            }
        } catch {
            setErrorMsg('No se pudo conectar con el servidor.');
            setState('error');
        }
    }, [token]);

    useEffect(() => {
        fetchPresupuesto();
    }, [fetchPresupuesto]);

    // Handle approve/reject
    const handleAction = async (action: 'aprobar' | 'rechazar', notas: string) => {
        setActionLoading(true);
        try {
            const res = await publicFetch<{ success: boolean; error?: string; message?: string }>(
                `/presupuesto/ver/${token}/${action}/`,
                {
                    method: 'POST',
                    body: JSON.stringify({ notas_cliente: notas }),
                }
            );

            if (res.status === 409) {
                setModal(null);
                await fetchPresupuesto();
                return;
            }

            if (!res.ok || !res.data.success) {
                setErrorMsg(res.data.error || res.data.message || 'Error al enviar respuesta.');
                setState('error');
                setModal(null);
                return;
            }

            setModal(null);
            setLastAction(action === 'aprobar' ? 'aprobado' : 'rechazado');
            setState('thank-you');
        } catch {
            setErrorMsg('No se pudo conectar con el servidor.');
            setState('error');
            setModal(null);
        } finally {
            setActionLoading(false);
        }
    };

    // -----------------------------------------------------------------------
    // Render states
    // -----------------------------------------------------------------------

    if (state === 'loading') return <LoadingState />;

    if (state === 'invalid') {
        return <ErrorState icon="🔗" message="Este enlace no es válido o ya no existe." />;
    }

    if (state === 'expired') {
        return <ErrorState icon="⏰" message="Este presupuesto ha expirado." />;
    }

    if (state === 'error') {
        return <ErrorState icon="⚠️" message={errorMsg || 'Ocurrió un error inesperado.'} />;
    }

    if (state === 'thank-you' && lastAction) {
        return <ThankYouScreen action={lastAction} />;
    }

    if (!data) return <LoadingState />;

    // -----------------------------------------------------------------------
    // Main presupuesto view
    // -----------------------------------------------------------------------

    const hasResponded = state === 'responded';

    return (
        <div className="min-h-screen" style={{ background: '#0a0a1a' }}>
            {/* Header */}
            <header
                className="py-6"
                style={{
                    background: 'linear-gradient(180deg, #10102a 0%, #0a0a1a 100%)',
                    borderBottom: '1px solid #1a1a30',
                }}
            >
                <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-black"
                            style={{
                                background: 'linear-gradient(135deg, #f0c040 0%, #d4a830 100%)',
                                color: '#0a0a1a',
                            }}
                        >
                            T
                        </div>
                        <div>
                            <h1
                                className="text-lg font-bold tracking-wide"
                                style={{ color: '#f0c040' }}
                            >
                                TITANES GRÁFICOS
                            </h1>
                            <p className="text-xs" style={{ color: '#60607a' }}>
                                Presupuesto Comercial
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-mono font-bold" style={{ color: '#f0c040' }}>
                            {data.numero}
                        </p>
                        <p className="text-xs" style={{ color: '#60607a' }}>
                            {formatDate(data.fecha)}
                        </p>
                    </div>
                </div>
            </header>

            {/* Body */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
                {/* Response banner (if already responded) */}
                {hasResponded && (
                    <div
                        className="rounded-xl p-4 flex items-center gap-4"
                        style={{
                            background:
                                data.respuesta === 'aprobado'
                                    ? 'rgba(34, 197, 94, 0.08)'
                                    : 'rgba(239, 68, 68, 0.08)',
                            border: `1px solid ${
                                data.respuesta === 'aprobado'
                                    ? 'rgba(34, 197, 94, 0.2)'
                                    : 'rgba(239, 68, 68, 0.2)'
                            }`,
                        }}
                    >
                        <ResponseBadge respuesta={data.respuesta} />
                        <div className="flex-1">
                            <p className="text-sm" style={{ color: '#c0c0d8' }}>
                                Respuesta registrada
                                {data.respuesta_at && (
                                    <span style={{ color: '#60607a' }}>
                                        {' '}
                                        el {formatDate(data.respuesta_at.split('T')[0])}
                                    </span>
                                )}
                            </p>
                            {data.notas_cliente && (
                                <p className="text-xs mt-1" style={{ color: '#80809a' }}>
                                    Notas: {data.notas_cliente}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Client & Vendedor info card */}
                <div
                    className="rounded-xl p-6"
                    style={{ background: '#12122a', border: '1px solid #1e1e3a' }}
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <p
                                className="text-xs font-medium uppercase tracking-wider mb-2"
                                style={{ color: '#60607a' }}
                            >
                                Cliente
                            </p>
                            <p className="font-semibold text-lg" style={{ color: '#f0f0ff' }}>
                                {data.cliente.nombre}
                            </p>
                            {data.cliente.contacto && (
                                <p className="text-sm mt-1" style={{ color: '#a0a0c0' }}>
                                    {data.cliente.contacto}
                                </p>
                            )}
                            {data.cliente.email && (
                                <p className="text-sm" style={{ color: '#80809a' }}>
                                    {data.cliente.email}
                                </p>
                            )}
                        </div>
                        <div className="sm:text-right">
                            <p
                                className="text-xs font-medium uppercase tracking-wider mb-2"
                                style={{ color: '#60607a' }}
                            >
                                Vendedor
                            </p>
                            <p className="text-sm font-medium" style={{ color: '#a0a0c0' }}>
                                {data.vendedor.nombre}
                            </p>
                            {data.fecha_vencimiento && (
                                <p className="text-xs mt-2" style={{ color: '#80809a' }}>
                                    Válido hasta: {formatDate(data.fecha_vencimiento)}
                                </p>
                            )}
                        </div>
                    </div>
                    {data.titulo && (
                        <div
                            className="mt-5 pt-5"
                            style={{ borderTop: '1px solid #1e1e3a' }}
                        >
                            <p
                                className="text-xs font-medium uppercase tracking-wider mb-1"
                                style={{ color: '#60607a' }}
                            >
                                Referencia
                            </p>
                            <p className="text-sm" style={{ color: '#c0c0d8' }}>
                                {data.titulo}
                            </p>
                        </div>
                    )}
                </div>

                {/* Items table */}
                <div
                    className="rounded-xl overflow-hidden"
                    style={{ background: '#12122a', border: '1px solid #1e1e3a' }}
                >
                    <div className="px-6 py-4" style={{ borderBottom: '1px solid #1e1e3a' }}>
                        <h2 className="text-sm font-semibold" style={{ color: '#f0f0ff' }}>
                            Detalle de Items
                        </h2>
                    </div>

                    {/* Desktop table */}
                    <div className="hidden sm:block overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr style={{ borderBottom: '1px solid #1a1a30' }}>
                                    <th
                                        className="text-left text-xs font-medium uppercase tracking-wider px-6 py-3"
                                        style={{ color: '#50506a' }}
                                    >
                                        Descripción
                                    </th>
                                    <th
                                        className="text-center text-xs font-medium uppercase tracking-wider px-4 py-3"
                                        style={{ color: '#50506a' }}
                                    >
                                        Cant.
                                    </th>
                                    <th
                                        className="text-right text-xs font-medium uppercase tracking-wider px-4 py-3"
                                        style={{ color: '#50506a' }}
                                    >
                                        P. Unitario
                                    </th>
                                    <th
                                        className="text-right text-xs font-medium uppercase tracking-wider px-6 py-3"
                                        style={{ color: '#50506a' }}
                                    >
                                        Subtotal
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.items.map((item, i) => (
                                    <tr
                                        key={i}
                                        className="transition-colors"
                                        style={{ borderBottom: '1px solid #151530' }}
                                        onMouseEnter={(e) =>
                                            (e.currentTarget.style.background = 'rgba(240, 192, 64, 0.03)')
                                        }
                                        onMouseLeave={(e) =>
                                            (e.currentTarget.style.background = 'transparent')
                                        }
                                    >
                                        <td className="px-6 py-4">
                                            <p
                                                className="text-sm font-medium"
                                                style={{ color: '#e0e0f0' }}
                                            >
                                                {item.descripcion}
                                            </p>
                                            {item.detalle && (
                                                <p
                                                    className="text-xs mt-0.5"
                                                    style={{ color: '#70708a' }}
                                                >
                                                    {item.detalle}
                                                </p>
                                            )}
                                        </td>
                                        <td
                                            className="text-center px-4 py-4 text-sm"
                                            style={{ color: '#a0a0c0' }}
                                        >
                                            {item.cantidad}
                                            {item.unidad_cobro && (
                                                <span
                                                    className="text-xs ml-1"
                                                    style={{ color: '#60607a' }}
                                                >
                                                    {item.unidad_cobro}
                                                </span>
                                            )}
                                        </td>
                                        <td
                                            className="text-right px-4 py-4 text-sm font-mono"
                                            style={{ color: '#a0a0c0' }}
                                        >
                                            ${formatCurrency(item.precio_unitario)}
                                        </td>
                                        <td
                                            className="text-right px-6 py-4 text-sm font-mono font-medium"
                                            style={{ color: '#e0e0f0' }}
                                        >
                                            ${formatCurrency(item.subtotal)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="sm:hidden divide-y" style={{ borderColor: '#151530' }}>
                        {data.items.map((item, i) => (
                            <div key={i} className="px-5 py-4 space-y-2">
                                <p className="text-sm font-medium" style={{ color: '#e0e0f0' }}>
                                    {item.descripcion}
                                </p>
                                {item.detalle && (
                                    <p className="text-xs" style={{ color: '#70708a' }}>
                                        {item.detalle}
                                    </p>
                                )}
                                <div className="flex justify-between text-xs">
                                    <span style={{ color: '#80809a' }}>
                                        {item.cantidad}
                                        {item.unidad_cobro ? ` ${item.unidad_cobro}` : ''} x $
                                        {formatCurrency(item.precio_unitario)}
                                    </span>
                                    <span className="font-mono font-medium" style={{ color: '#e0e0f0' }}>
                                        ${formatCurrency(item.subtotal)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Totals */}
                <div
                    className="rounded-xl p-6"
                    style={{ background: '#12122a', border: '1px solid #1e1e3a' }}
                >
                    <div className="max-w-xs ml-auto space-y-3">
                        <div className="flex justify-between text-sm">
                            <span style={{ color: '#80809a' }}>Subtotal</span>
                            <span className="font-mono" style={{ color: '#c0c0d8' }}>
                                ${formatCurrency(data.subtotal)}
                            </span>
                        </div>
                        {data.descuento > 0 && (
                            <div className="flex justify-between text-sm">
                                <span style={{ color: '#80809a' }}>Descuento</span>
                                <span className="font-mono" style={{ color: '#22c55e' }}>
                                    -${formatCurrency(data.descuento)}
                                </span>
                            </div>
                        )}
                        {data.incluir_iva && data.impuesto > 0 && (
                            <div className="flex justify-between text-sm">
                                <span style={{ color: '#80809a' }}>IVA (16%)</span>
                                <span className="font-mono" style={{ color: '#c0c0d8' }}>
                                    ${formatCurrency(data.impuesto)}
                                </span>
                            </div>
                        )}
                        <div
                            className="flex justify-between items-center pt-3"
                            style={{ borderTop: '1px solid #1e1e3a' }}
                        >
                            <span className="text-sm font-semibold" style={{ color: '#f0f0ff' }}>
                                Total
                            </span>
                            <span
                                className="text-2xl font-bold font-mono"
                                style={{ color: '#f0c040' }}
                            >
                                ${formatCurrency(data.total)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Notes */}
                {data.notas && (
                    <div
                        className="rounded-xl p-6"
                        style={{ background: '#12122a', border: '1px solid #1e1e3a' }}
                    >
                        <p
                            className="text-xs font-medium uppercase tracking-wider mb-3"
                            style={{ color: '#60607a' }}
                        >
                            Condiciones Comerciales
                        </p>
                        <p
                            className="text-sm whitespace-pre-wrap leading-relaxed"
                            style={{ color: '#a0a0c0' }}
                        >
                            {data.notas}
                        </p>
                    </div>
                )}

                {/* Action buttons (only if not responded) */}
                {!hasResponded && (
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button
                            onClick={() => setModal('aprobar')}
                            className="flex-1 rounded-xl px-6 py-4 text-base font-bold transition-all hover:scale-[1.01] active:scale-[0.99]"
                            style={{
                                background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                                color: '#fff',
                                boxShadow: '0 4px 20px rgba(22, 163, 74, 0.3)',
                            }}
                        >
                            Aprobar Presupuesto
                        </button>
                        <button
                            onClick={() => setModal('rechazar')}
                            className="flex-1 rounded-xl px-6 py-4 text-base font-bold transition-all hover:scale-[1.01] active:scale-[0.99]"
                            style={{
                                background: 'transparent',
                                color: '#ef4444',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)')
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.background = 'transparent')
                            }
                        >
                            Rechazar
                        </button>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer
                className="py-8 mt-12"
                style={{ borderTop: '1px solid #1a1a30' }}
            >
                <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-2">
                    <p className="text-sm font-semibold" style={{ color: '#f0c040' }}>
                        Titanes Gráficos C.A.
                    </p>
                    <p className="text-xs" style={{ color: '#50506a' }}>
                        Imprenta Digital &middot; Gran Formato &middot; Publicidad
                    </p>
                    <p className="text-xs" style={{ color: '#40405a' }}>
                        Valencia, Venezuela &middot; titanesgraficos.com.ve
                    </p>
                </div>
            </footer>

            {/* Modal */}
            {modal && (
                <ActionModal
                    type={modal}
                    onClose={() => setModal(null)}
                    onConfirm={(notas) => handleAction(modal, notas)}
                    loading={actionLoading}
                />
            )}
        </div>
    );
}
