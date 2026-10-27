import { Component, type ReactNode } from 'react';
import { useTranslation } from '@/i18n/i18n';
import { Button } from '@/components/ui/button';

export function LoadingState() {
  const { t } = useTranslation();
  return <div role="status" className="container mx-auto min-h-48 px-6 py-16 text-muted-foreground">{t('common.loading')}</div>;
}
function LoadError() {
  const { t } = useTranslation();
  return <div role="alert" className="container mx-auto px-6 py-16"><p className="mb-4">{t('common.loadError')}</p><Button onClick={() => window.location.reload()}>{t('common.reload')}</Button></div>;
}
export class LoadBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <LoadError /> : this.props.children; }
}