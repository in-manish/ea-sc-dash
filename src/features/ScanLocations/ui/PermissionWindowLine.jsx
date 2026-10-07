import { formatPermissionWindow } from '../domain/permissionWindow';

export default function PermissionWindowLine({ permission }) {
  const text = formatPermissionWindow(permission);
  return (
    <span className="block text-[10px] leading-tight opacity-80" title={text}>
      {text}
    </span>
  );
}
