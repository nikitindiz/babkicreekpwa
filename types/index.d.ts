declare module 'qr-encode' {
  export = QR;

  function QR(text: string, opts?: QRCodeOptions): string;

  namespace QR {
    function level(level: string): QR;
  }

  interface QRCodeOptions {
    type?: number;
    level?: string;
    size?: number;
    margin?: number;
  }
}
