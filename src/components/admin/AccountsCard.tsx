import { useState, type CSSProperties } from "react";
import { Card } from "@/components/primitives/Card";
import { Btn } from "@/components/primitives/Btn";
import { useAccounts, useSetAccount, type Account } from "@/hooks/useAccounts";

const inputCss: CSSProperties = {
  height: 34, padding: "0 10px", borderRadius: 8,
  background: "var(--fj-panel)", border: "1px solid var(--fj-line-strong)",
  fontFamily: "var(--fj-body)", fontSize: 13, color: "var(--fj-ink)", outline: "none",
  boxSizing: "border-box",
};
const labelCss: CSSProperties = {
  fontFamily: "var(--fj-body)", fontSize: 10.5, letterSpacing: ".10em",
  textTransform: "uppercase", color: "var(--fj-ink3)", fontWeight: 600,
};

function AccountRow({ acc, last }: { acc: Account; last: boolean }) {
  const setAccount = useSetAccount();
  const [email, setEmail] = useState(acc.email ?? "");
  const [role, setRole] = useState(acc.role);
  const [pwd, setPwd] = useState("");

  const dirty = email !== (acc.email ?? "") || role !== acc.role || pwd.length > 0;

  const save = () => {
    const body: { id: number; email?: string; role?: string; new_password?: string } = { id: acc.id };
    if (email !== (acc.email ?? "")) body.email = email;
    if (role !== acc.role) body.role = role;
    if (pwd.length > 0) body.new_password = pwd;
    setAccount.mutate(body, { onSuccess: () => setPwd("") });
  };

  return (
    <div style={{
      display: "grid", gridTemplateColumns: "1.2fr 1.4fr 0.8fr 1.2fr auto", gap: 12,
      alignItems: "end", padding: "14px 20px",
      borderBottom: last ? undefined : "1px solid var(--fj-line)",
    }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--fj-ink)" }}>{acc.name}</div>
        <div style={{ fontFamily: "var(--fj-mono)", fontSize: 11, color: "var(--fj-ink3)" }}>{acc.rut}</div>
      </div>
      <div>
        <label style={labelCss}>Email</label>
        <input style={inputCss} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="—" />
      </div>
      <div>
        <label style={labelCss}>Rol</label>
        <select style={{ ...inputCss, appearance: "auto" as const }} value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="lawyer">Abogado</option>
          <option value="auditor">Auditor</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div>
        <label style={labelCss}>{acc.has_password ? "Nueva contraseña" : "Contraseña (sin setear)"}</label>
        <input style={inputCss} type="password" value={pwd} onChange={(e) => setPwd(e.target.value)}
          placeholder={acc.has_password ? "dejar vacío = sin cambio" : "min 8 caracteres"} />
      </div>
      <Btn kind="primary" size="sm" disabled={!dirty || setAccount.isPending} onClick={save}>
        {setAccount.isPending ? "…" : "Guardar"}
      </Btn>
    </div>
  );
}

export function AccountsCard() {
  const { data: accounts = [], isLoading } = useAccounts();
  return (
    <Card pad={0} style={{ marginBottom: 20, overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--fj-line)" }}>
        <div style={{ fontFamily: "var(--fj-heading)", fontSize: 16, fontWeight: 600, color: "var(--fj-ink)" }}>
          Cuentas del estudio
        </div>
        <div style={{ fontFamily: "var(--fj-body)", fontSize: 12, color: "var(--fj-ink3)", marginTop: 2 }}>
          Email, rol y contraseña por abogado · solo administradores
        </div>
      </div>
      {isLoading ? (
        <div style={{ padding: 20, fontSize: 13, color: "var(--fj-ink3)" }}>Cargando…</div>
      ) : (
        accounts.map((a, i) => <AccountRow key={a.id} acc={a} last={i === accounts.length - 1} />)
      )}
    </Card>
  );
}
