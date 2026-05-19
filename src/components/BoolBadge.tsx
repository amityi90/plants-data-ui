interface Props {
  value: boolean;
  trueLabel: string;
  falseLabel: string;
}

export default function BoolBadge({ value, trueLabel, falseLabel }: Props) {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
        value ? 'bg-forest/15 text-forest-dark' : 'bg-forest/5 text-forest/40'
      }`}
    >
      {value ? trueLabel : falseLabel}
    </span>
  );
}
