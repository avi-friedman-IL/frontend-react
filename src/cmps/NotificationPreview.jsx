import { t } from "i18next";

export function NotificationPreview({ notification }) {
    return (
        <li className='notification-preview'>
            <span className="notification-subject">{t(notification.subject) || t('No subject')}</span>
            {t(notification.text)}
        </li>
    )
}