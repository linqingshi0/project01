export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
      <p>© {new Date().getFullYear()} LightEats · 吃得轻盈，活得畅快</p>
      <p className="mt-1">版本 {__APP_VERSION__}</p>
    </footer>
  );
}
