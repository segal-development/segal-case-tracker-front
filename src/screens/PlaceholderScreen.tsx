interface PlaceholderScreenProps {
  name: string;
}

export function PlaceholderScreen({ name }: PlaceholderScreenProps) {
  return (
    <div className="px-10 pt-9">
      <h1 className="font-heading text-2xl text-ink">{name}</h1>
      <p className="text-ink3 mt-2">Coming soon.</p>
    </div>
  );
}
