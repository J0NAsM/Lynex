"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { site } from "@/lib/site";

type FormState = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState("");

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setState("submitting");
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          website: data.get("website"),
        }),
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message || "No pudimos enviar el mensaje.");
      }

      form.reset();
      setState("success");
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "No pudimos enviar el mensaje. Inténtalo nuevamente.",
      );
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="contact-form form-success" role="status" aria-live="polite">
        <span aria-hidden="true">✓</span>
        <h3>Mensaje enviado.</h3>
        <p>Gracias por escribirnos. Te contactaremos para conocer mejor tu proyecto.</p>
        <button type="button" className="text-link" onClick={() => setState("idle")}>
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={submitForm} noValidate={false}>
      <div className="form-row">
        <label>
          Tu nombre
          <input
            required
            autoComplete="name"
            name="name"
            minLength={2}
            maxLength={80}
            placeholder="Nombre y apellidos"
          />
        </label>
        <label>
          Tu email
          <input
            required
            autoComplete="email"
            type="email"
            name="email"
            maxLength={254}
            placeholder="nombre@empresa.com"
          />
        </label>
      </div>
      <label>
        ¿En qué podemos ayudarte?
        <textarea
          required
          name="message"
          rows={5}
          minLength={20}
          maxLength={3000}
          placeholder="Cuéntanos brevemente tu proyecto o reto..."
        />
      </label>
      <label className="form-honeypot" aria-hidden="true">
        Tu sitio web
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      {state === "error" && (
        <p className="form-error" role="alert">
          {error} También puedes escribirnos directamente a{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
      )}
      <button
        className="button button-light form-submit"
        type="submit"
        disabled={state === "submitting"}
      >
        {state === "submitting" ? "Enviando…" : "Solicitar una conversación"}
        <span aria-hidden="true">↗</span>
      </button>
      <small>
        Usaremos tus datos únicamente para responder a tu consulta. Consulta nuestra{" "}
        <Link href="/privacidad">política de privacidad</Link>.
      </small>
    </form>
  );
}
