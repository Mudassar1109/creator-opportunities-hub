interface Props {
  role: string;
}

export function UserRoleBadge({ role }: Props) {
  const isBrand = role === "brand";
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold ${
      isBrand
        ? "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400"
        : "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
    }`}>
      {isBrand ? "Brand" : "Creator"}
    </span>
  );
}
