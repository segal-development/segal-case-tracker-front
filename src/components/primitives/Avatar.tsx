interface AvatarProps {
  iniciales: string;
  color: string;
  nombre?: string;
  size?: number;
}

export function Avatar({ iniciales, color, nombre, size = 28 }: AvatarProps) {
  return (
    <span
      title={nombre ?? iniciales}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        borderRadius: 999,
        background: color,
        color: "#fff",
        fontFamily: "var(--fj-body)",
        fontWeight: 600,
        fontSize: Math.round(size * 0.40),
        letterSpacing: ".01em",
        flex: "0 0 auto",
      }}
    >
      {iniciales}
    </span>
  );
}
