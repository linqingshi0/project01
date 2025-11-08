import * as Toast from '@radix-ui/react-toast';
import useAppStore from '../lib/store';

export function ToastViewport() {
  const { toast } = useAppStore();

  return (
    <Toast.Provider swipeDirection="right">
      {toast.messages.map((item) => (
        <Toast.Root
          key={item.id}
          className="bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg mb-2"
          open
          onOpenChange={(open) => {
            if (!open && item.id) toast.dismiss(item.id);
          }}
        >
          <Toast.Title className="font-semibold text-sm">{item.title}</Toast.Title>
          {item.description && (
            <Toast.Description className="mt-1 text-xs text-slate-200">{item.description}</Toast.Description>
          )}
        </Toast.Root>
      ))}
      <Toast.Viewport className="fixed bottom-6 right-6 w-80" />
    </Toast.Provider>
  );
}
