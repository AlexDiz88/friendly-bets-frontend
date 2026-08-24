import { apiFetch } from '../../../shared/apiClient';

function apiUrl(path: string): string {
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		return path;
	}
	return `${import.meta.env.VITE_PRODUCT_SERVER}${path}`;
}

export type DbBackupTelegramResult = {
	filename?: string;
	sizeBytes?: number;
	sha256?: string;
	snapshotUtc?: string;
	telegramMessageId?: number;
	message?: string;
};

export async function sendDbBackupToTelegram(): Promise<DbBackupTelegramResult> {
	const result = await apiFetch(apiUrl('/api/admin/db-backup/telegram'), { method: 'POST' });
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function downloadDbBackupToPc(): Promise<void> {
	const result = await apiFetch(apiUrl('/api/admin/db-backup/download'), { method: 'GET' });
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	const blob = await result.blob();
	const filename = filenameFromContentDisposition(result.headers.get('Content-Disposition'));
	const objectUrl = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = objectUrl;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	link.remove();
	URL.revokeObjectURL(objectUrl);
}

function filenameFromContentDisposition(header: string | null): string {
	if (!header) {
		return 'FriendlyBets-backup.zip';
	}
	const quoted = /filename="([^"]+)"/.exec(header);
	if (quoted?.[1]) {
		return quoted[1];
	}
	const plain = /filename=([^;]+)/.exec(header);
	if (plain?.[1]) {
		return plain[1].trim();
	}
	return 'FriendlyBets-backup.zip';
}
