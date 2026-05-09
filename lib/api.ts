export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000';

export async function fetchCurrentSession() {
  const response = await fetch(`${BACKEND_URL}/api/sessions/current`, {
    cache: 'no-store',
  });
  if (!response.ok) throw new Error('Failed to fetch current session');
  return response.json();
}

export async function verifyQrAttendance({
  token,
  studentId,
  selfieBlob,
}: {
  token: string;
  studentId: string;
  selfieBlob: Blob;
}) {
  const formData = new FormData();
  formData.append('token', token);
  formData.append('student_id', studentId);
  formData.append('selfie', selfieBlob, 'selfie.jpg');

  const response = await fetch(`${BACKEND_URL}/api/qr/verify`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload?.detail || 'QR verification failed');
  }
  return response.json();
}

export class WebSocketService {
  private ws: WebSocket | null = null;
  private messageListeners: ((data: any) => void)[] = [];
  private reconnectTimer: number | null = null;
  private closedByUser = false;

  constructor(private clientId: string, private role: string) {}

  connect() {
    if (this.ws && [WebSocket.OPEN, WebSocket.CONNECTING].includes(this.ws.readyState)) return;

    this.closedByUser = false;
    this.ws = new WebSocket(`${WS_URL}/ws/${this.clientId}/${this.role}`);

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.messageListeners.forEach(listener => listener(data));
      } catch (e) {
        console.error('Error parsing WS message', e);
      }
    };

    this.ws.onclose = () => {
      if (this.closedByUser) return;
      this.reconnectTimer = window.setTimeout(() => this.connect(), 3000);
    };
  }

  disconnect() {
    this.closedByUser = true;
    if (this.reconnectTimer) {
      window.clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  send(data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  addMessageListener(listener: (data: any) => void) {
    this.messageListeners.push(listener);
    return () => {
      this.messageListeners = this.messageListeners.filter(l => l !== listener);
    };
  }
}
