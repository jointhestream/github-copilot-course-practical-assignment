interface InlineAlertProps {
  type: 'error' | 'success' | 'info';
  message: string;
}

export default function InlineAlert({ type, message }: InlineAlertProps) {
  if (!message) return null;
  return <div className={`inline-alert alert-${type}`}>{message}</div>;
}
