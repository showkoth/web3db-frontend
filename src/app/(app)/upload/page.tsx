import type { Metadata } from 'next';
import { UploadView } from '@/components/features/upload/upload-view';

export const metadata: Metadata = { title: 'Upload · web3db' };

export default function UploadPage() {
  return <UploadView />;
}
