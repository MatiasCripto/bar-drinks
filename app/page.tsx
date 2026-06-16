import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-gradient-to-b from-amber-50 dark:from-amber-950 to-white dark:to-gray-950 px-4">
      <main className="flex flex-col items-center text-center max-w-md">
        <div className="w-20 h-20 bg-amber-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-amber-200">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Florencio Drinks
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          Escaneá el código QR de tu mesa para ver la carta y hacer tu pedido desde el celular.
        </p>

        <Link
          href="/auth/login"
          className="inline-flex items-center px-6 py-3 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700 transition-colors shadow-lg shadow-amber-200"
        >
          Acceder al dashboard
        </Link>

        <p className="text-xs text-gray-400 dark:text-gray-500 mt-12">
          {new Date().getFullYear()} — Todos los derechos reservados
        </p>
      </main>
    </div>
  );
}
