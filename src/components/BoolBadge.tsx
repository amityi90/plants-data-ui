interface Props {
  value: boolean;
  trueLabel: string;
  falseLabel: string;
}

export default function BoolBadge({ value, trueLabel, falseLabel }: Props) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
        value
          ? 'bg-moss/25 text-forest-dark ring-1 ring-moss/40'
          : 'bg-forest/5 text-forest/45 ring-1 ring-forest/10'
      }`}
    >
      {value ? trueLabel : falseLabel}
    </span>
  );
}
