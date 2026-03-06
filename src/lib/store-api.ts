const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1/web';

class StoreAPI {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = API_BASE;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Tenant-Id': 'titanes_tenant',
      'X-Request-Id': `web-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      ...((options.headers as Record<string, string>) || {}),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: 'Error de conexion' }));
      throw new Error(error.detail || `Error ${res.status}`);
    }

    return res.json();
  }

  // Config
  async getConfig() { return this.request('/config/'); }

  // Servicios
  async getServicios() { return this.request('/servicios/'); }
  async getServicio(slug: string) { return this.request(`/servicios/${slug}/`); }

  // Productos
  async getProductos(params?: { page?: number; categoria?: string; search?: string; ordering?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.categoria) searchParams.set('categoria', params.categoria);
    if (params?.search) searchParams.set('search', params.search);
    if (params?.ordering) searchParams.set('ordering', params.ordering);
    const qs = searchParams.toString();
    return this.request(`/productos/${qs ? '?' + qs : ''}`);
  }
  async getProducto(slug: string) { return this.request(`/productos/${slug}/`); }

  // Categorias
  async getCategorias() { return this.request('/categorias/'); }

  // Blog
  async getBlogPosts(params?: { page?: number; categoria?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.categoria) searchParams.set('categoria', params.categoria);
    const qs = searchParams.toString();
    return this.request(`/blog/${qs ? '?' + qs : ''}`);
  }
  async getBlogPost(slug: string) { return this.request(`/blog/${slug}/`); }

  // Portafolio
  async getPortafolio() { return this.request('/portafolio/'); }

  // Maquinas
  async getMaquinas() { return this.request('/maquinas/'); }

  // Tasa BCV
  async getTasaBCV() { return this.request('/tasa-bcv/'); }

  // Auth
  async registro(data: { email: string; nombre: string; apellido: string; telefono: string; password: string }) {
    return this.request('/auth/registro/', { method: 'POST', body: JSON.stringify(data) });
  }
  async login(data: { email: string; password: string }) {
    return this.request('/auth/login/', { method: 'POST', body: JSON.stringify(data) });
  }
  async refreshToken(refresh: string) {
    return this.request('/auth/refresh/', { method: 'POST', body: JSON.stringify({ refresh }) });
  }
  async getPerfil() { return this.request('/auth/perfil/'); }
  async updatePerfil(data: Record<string, unknown>) {
    return this.request('/auth/perfil/', { method: 'PATCH', body: JSON.stringify(data) });
  }

  // Pedidos
  async getMisPedidos() { return this.request('/mis-pedidos/'); }
  async getMiPedido(id: number) { return this.request(`/mis-pedidos/${id}/`); }
  async crearPedido(data: Record<string, unknown>) {
    return this.request('/pedido/', { method: 'POST', body: JSON.stringify(data) });
  }
  async subirComprobante(pedidoId: number, formData: FormData) {
    const headers: Record<string, string> = {
      'X-Tenant-Id': 'titanes_tenant',
      'X-Request-Id': `web-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    };
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;
    const res = await fetch(`${this.baseUrl}/pedido/${pedidoId}/comprobante/`, {
      method: 'POST', headers, body: formData,
    });
    return res.json();
  }

  // Cupones
  async validarCupon(codigo: string) {
    return this.request('/validar-cupon/', { method: 'POST', body: JSON.stringify({ codigo }) });
  }

  // Contacto
  async enviarContacto(data: { nombre: string; email: string; telefono: string; mensaje: string }) {
    return this.request('/contacto/', { method: 'POST', body: JSON.stringify(data) });
  }
}

export const storeApi = new StoreAPI();
export default storeApi;
